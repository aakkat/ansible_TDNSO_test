import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AddhostService {
   
  constructor(private http: HttpClient) {
  }
  downloadFile(url: any) {
		return this.http.get(url, {responseType: 'blob'});
  }

  getfiledetails(data:any): Observable<any>{
    console.log(data);
    const body = JSON.stringify({
                 host: data,
             });
    return this.http.post('http://127.0.0.1:5000/collect-file-data', JSON.stringify(data))
  }

  gethostdetails(): Observable<any>{ 
    const body = JSON.stringify({
                 username: 'admin',
                 password: 'nsoadmin',
             });
    console.log(body);
    return this.http.post('http://127.0.0.1:5000/collectdata',"")
  }

  collectdata(data:any): Observable<any>{ 
    const body = JSON.stringify({
      host: data,
  });
    return this.http.post('http://127.0.0.1:5000/compile',JSON.stringify(data))
  }
  
  checkdata(data:any): Observable<any>{ 
    const body = JSON.stringify({
      host: data,
  });
    return this.http.post('http://127.0.0.1:5000/checkdata',JSON.stringify(data))
  }
 
}
