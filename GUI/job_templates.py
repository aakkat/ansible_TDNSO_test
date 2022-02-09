import requests
import json
import os
from flask import Flask, request, render_template
from flask_restful import Resource, Api
from pymongo import MongoClient
from paramiko import SSHClient, AutoAddPolicy

# Variables
app = Flask(__name__, template_folder='template')
api = Api(app)
DATABASE_NAME = "td_nso"
FILE_COLLECTION_NAME = "files"
HOST_COLLECTION_NAME = "hostcollection"
JOB_COLLECTION_NAME = "jobcollection"
DB_CLIENT = MongoClient("mongodb://127.0.0.1:27017/")


def retrieve_recent_job_template():
    job_status = None
    while job_status is None or job_status not in ["failed", "successful"]:
        print("1111111 --> job_status-->", job_status)
        headers = {'Content-type': 'application/json', "Authorization": "Basic YWRtaW46bnNvYWRtaW4="}
        response = requests.get("http://10.78.236.119/api/v2/job_templates/", headers=headers)
        json_response = json.loads(response.text)
        job_status = _fetch_recent_job_status(json_response)
    print("22222222 --> job_status-->", job_status)
    return job_status


def _fetch_recent_job_status(json_response):
    recent_job_data = []
    job_status = None
    if json_response and json_response.get("results"):
        recent_job_data = []
        for data in json_response["results"]:
            if data.get("summary_fields") and data["summary_fields"].get("recent_jobs"):
                recent_job_data.extend(data["summary_fields"]["recent_jobs"])
    if recent_job_data:
        recent_job_data = _sort_list(recent_job_data)
        job_status = recent_job_data[0]["status"]
    return job_status


def _sort_list(job_list):
    return sorted(job_list, key=lambda i: i["id"], reverse=True)


def connect_server(host_ip):
    client = SSHClient()
    file_data = []
    file_types = []
    print("Connecting to the server ", )
    client.set_missing_host_key_policy(AutoAddPolicy())
    client.connect('10.78.236.119', username='root', password='roZes123')
    stdin, stdout, stderr = client.exec_command("ls /tmp/logs_{}\n".format(host_ip))
    files = stdout.readlines()
    version_details = None
    sftp_client = client.open_sftp()
    for file in files:
        file = file.strip()
        file_data.append(file)
        remote_file = sftp_client.open('/tmp/logs_{}/{}'.format(host_ip, str(file)))
        remote_file_content = remote_file.read()
        if file.startswith("log_VERSION"):
            version_details = _fetch_version_details(remote_file_content.decode("utf-8"))
        file_type = _fetch_file_type(file)
        file_types.append(file_type)
        text_file_doc = {
            "file-name": file,
            "file-type": file_type,
            "contents": remote_file_content,
            "host-ip": host_ip,
        }
        print(f"remote file content ---> {remote_file_content}")
        file_query = {"file-type": file_type, "host-ip": host_ip}
        _insert_or_update_data_into_db(text_file_doc, FILE_COLLECTION_NAME, file_query)
    client.close()
    return file_data, version_details, file_types


def _fetch_file_type(file_name):
    split_file = file_name.split("_")
    split_file = split_file[1:-1]
    return "_".join(split_file)


def _fetch_version_details(version_details):
    data_dict = {}
    if version_details:
        for data in version_details.split("\n"):
            data_list = data.split(":")
            if len(data_list) == 2:
                data_dict.update({data_list[0].strip().replace(" ", "_"): data_list[1].strip()})
    return data_dict


def _insert_or_update_data_into_db(content, collection_name, query):
    is_data_present = True
    query_data = _fetch_data_from_db(query, collection_name)
    for item in query_data:
        is_data_present = False
        print(f"item--> {item}")
        data = _update_data_into_db(collection_name, query, content)
        print(f"updated data successfully--> {data}")
        break
    if is_data_present:
        data = _insert_data_into_db(content, collection_name)
        print(f"push data successfully--> {data}")
    return {"success": "ok"}


def _update_data_into_db(db_collection, filter_data, update_data):
    collection = DB_CLIENT[DATABASE_NAME][db_collection]
    return collection.update_one(filter_data, {"$set": update_data})


def _insert_data_into_db(db_data, collection_name=FILE_COLLECTION_NAME):
    coll = DB_CLIENT[DATABASE_NAME][collection_name]
    if isinstance(db_data, list):
        return coll.insert_many(db_data)
    else:
        return coll.insert_one(db_data)


def _fetch_data_from_db(query, collection_name=FILE_COLLECTION_NAME, remove_id=True):
    coll = DB_CLIENT[DATABASE_NAME][collection_name]
    if remove_id:
        return coll.find(query, {"_id": 0})
    else:
        return coll.find(query)


def _remove_db_id(response):
    if "_id" in response:
        del response["_id"]


class Compile(Resource):
    def post(self):
        try:
            print("1111111 -->", request.data)
            content = json.loads(request.data)
            if content:
                file_data = []
                print(f"content of the file---> {content}")
                print(f"type content of the file---> {type(content)}")
                headers = {'Content-type': 'application/json', "Authorization": "Basic YWRtaW46bnNvYWRtaW4="}
                response = requests.post("http://10.78.236.119/api/v2/job_templates/7/launch/", headers=headers)
                json_response = json.loads(response.text)
                print("1111111 -->", json_response)
                status = retrieve_recent_job_template()
                if status == "successful":
                    print(f"job is {status}")
                    print("connecting server-->")
                    if content.get("description") and content.get("name"):
                        file_data, version_details, file_type = connect_server(content["name"])
                        print("uploaded successfully -->")
                        job_response = {
                            "response": status,
                            "file-name": file_data,
                            "file-type": file_type,
                            "version-details": version_details,
                            "host-ip": content["name"],
                        }
                        job_query = {"host-ip": content["name"]}
                        _insert_or_update_data_into_db(job_response, JOB_COLLECTION_NAME, job_query)
                        _remove_db_id(job_response)
                        print(f"@@@@@@@@@@@@@@@@@@ response ---> {job_response}")
                        return job_response, 200
                    else:
                        msg = "Host details are not present"
                        return {"response": msg}, 404
                else:
                    job_response = {"response": status, "data": file_data}
                    print(f"@@@@@@@@@@@@@@@@@@ response ---> {job_response}")
                    return job_response, 404
            else:
                msg = "Invalid Data request"
                return {"response": msg}, 404
        except Exception as exe:
            error = f"Failed due to : {str(exe)}"
            return error, 404

    def delete(self):
        coll = DB_CLIENT[DATABASE_NAME][FILE_COLLECTION_NAME]
        coll.delete_many({})
        return {"success": "ok"}, 200


class CollectData(Resource):
    def post(self):
        try:
            headers = {'Content-type': 'application/json', "Authorization": "Basic YWRtaW46bnNvYWRtaW4="}
            response = requests.get("http://10.78.236.119/api/v2/inventories/2/hosts/", headers=headers)
            mylist = []
            json_response = json.loads(response.text)
            print("1111111 -->", json_response)
            if "results" in json_response:
                for data in json_response['results']:
                    host_data = {"name": data.get("name"), "description": data.get("description")}
                    mylist.append(host_data)
                    _insert_or_update_data_into_db(host_data, HOST_COLLECTION_NAME, host_data)
            for data in mylist:
                _remove_db_id(data)
            print("1111111 updated_list-->", mylist)
            return {"response": "success", "data": mylist}, 200
        except Exception as exe:
            error = f"Failed due to : {str(exe)}"
            return error, 404

    def delete(self):
        coll = DB_CLIENT[DATABASE_NAME][FILE_COLLECTION_NAME]
        coll.delete_many({})
        return {"success": "ok"}, 200


class CollectFileData(Resource):
    def post(self):
        path = os.path.abspath("template/file.txt")
        content = json.loads(request.data)
        file_type = {"file-type": content["file-type"], "host-ip": content["name"]}
        print(f"content of the file---> {content}")
        print(f"type content of the file---> {file_type}")
        files_data = _fetch_data_from_db(file_type)
        file_data = ""
        for file in files_data:
            new_file = file.get("contents", "").decode("utf-8")
            file_data = file_data + new_file
        print(f"content of the file---> {file_data}")
        with open(path, 'w') as config_file:
            config_file.write(file_data)
            config_file.close()
        return render_template("file.txt")


class CheckData(Resource):
    def post(self):
        print("$$$$$$$$$$$$$ --> ", request.data)
        content = json.loads(request.data)
        check_query = {"host-ip": content["name"]}
        files_data = _fetch_data_from_db(check_query, JOB_COLLECTION_NAME)
        version_details = "no_data"
        file_details = "no_data"
        file_type = "no_data"
        for item in files_data:
            print("$$$$$$$$$$$$$ --> ", item)
            _remove_db_id(item)
            version_details = item.get("version-details", "no_data")
            file_details = item.get("file-name", "no_data")
            file_type = item.get("file-type", "no_data")
        return {
                   "response": "success",
                   "version-details": version_details,
                   "file-name": file_details,
                   "file-type": file_type
               }, 202


api.add_resource(
    Compile,
    '/compile'
)

api.add_resource(
    CollectData,
    '/collectdata'
)

api.add_resource(
    CollectFileData,
    '/collect-file-data'
)


api.add_resource(
    CheckData,
    '/checkdata'
)

if __name__ == '__main__':
    app.run(debug=True)
