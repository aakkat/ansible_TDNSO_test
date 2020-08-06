def credentialsId = params.credentialsId

// library mantaining groovy files which are adding functionality 
library identifier: 'nso-pipeline-library@master', retriever: modernSCM(
    [$class       : 'GitSCMSource',
        remote       : 'https://wwwin-github.cisco.com/AS-Community/nso-pipeline-library.git',
        credentialsId: "${credentialsId}"])
library identifier: 'rasta-pipeline-library@ansible-trial', retriever: modernSCM(
    [$class       : 'GitSCMSource',
        remote       : 'https://wwwin-github.cisco.com/AS-Community/rasta-pipeline-library.git',
        credentialsId: "${credentialsId}"])
library identifier: 'as-jenkins-pipeline-utils-dsl@master', retriever: modernSCM(
    [$class       : 'GitSCMSource',
        remote       : 'https://wwwin-github.cisco.com/AS-Community/as-jenkins-pipeline-utils-dsl.git',
        credentialsId: "${credentialsId}"])

@Library('AutomateEverything@1.2') // global Library should be see
import com.cisco.docker.* 
import com.cisco.nso.*
import com.cisco.ansible.*
import com.cisco.jenkins.*
import java.text.SimpleDateFormat

def dockerImage = new Docker(this)
def nso = new Nso(this)
def sonar = new Sonar(this)

// Data
def dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
def date = new Date()
def startDate = dateFormat.format(date)

// Pipeline Variables
def buildNum = "${env.BUILD_NUMBER}"
def buildIdNumber = buildId() // Unique buildId based upon the Jenkins Job & Build Number
def cicd_network_name = "cicd_network_name_" + "${buildIdNumber}" 
credentialsId = "345c79bc-9def-4981-94b5-d8190fdd2304"

// ###Project Variables
def EMAIL = "mdobieck@cisco.com"
def gitProjectUrl = "https://wwwin-github.cisco.com/mdobieck/ansible_nso_automation.git"
// One of the available cs-emear
def SPADE_node = "emear-sio-slv04" 
// ansible variables
def ansible_image_url = "ansible/ansible"



ansiColor('xterm') { timestamps {
node("${SPADE_node}") {
    try {
        stage('Clone Repository'){
            branch_name = "master"
            checkout([$class: 'GitSCM', branches: [[name: "*/${branch_name}"]],
                    doGenerateSubmoduleConfigurations: false, extensions: [],
                    submoduleCfg: [], userRemoteConfigs: [[credentialsId: "${credentialsId}",
                    url: "${gitProjectUrl}"]]])    
        }

        stage('Create Docker Network') {
            docker_containers = sh (script: "docker ps", returnStdout: true)
            echo "Docker Containers: ${docker_containers}"
            
            echo "Removing old containers" 
            remDock = dockerImage.cleanJobEnv()
            echo "docker remove ${remDock}"
            
            docker_network = dockerImage.createRandomPrivateNetwork(networkName: "${cicd_network_name}", networkMask: "29", retries: 10)
            echo "Subnet is ${docker_network}"
            docker_networks = sh (script: "docker network ls", returnStdout: true)
            echo "Docker Networks: ${docker_networks}"
            
            if (docker_networks.contains("${cicd_network_name}") ) {
                echo "Docker Network was properly created."
            } else {
                echo "ERROR: Couldn't create docker network."
                throw new Exception("ERROR: Docker Network creation failed")
            }
        }
        stage('Ansible Container Creation') {
            echo "Ansible starts here"
            ansibleImage = docker.image("${ansible_image_url}")
            ansibleImage.pull()
            echo "ansible container pulled successfully"
            // ansible_container_ has to be named rasta_container_ because of coping function
            ansibleContainer = ansibleImage.run("--name ansible-${buildIdNumber} --network=${cicd_network_name}", "tail -f /dev/null")
            echo "ansible Container ID = ${ansibleContainer.id}"
            ansible_ip = dockerImage.getContainerIPaddress(containerId: "${ansibleContainer.id}", networkName: "${cicd_network_name}")
            echo "ansible Container IP = ${ansible_ip}"
        }
    }
    catch (error) {
        echo "Exception: " + error
        echo "Cleaning up: "
        sh "docker network disconnect ${cicd_network_name} ansible-${buildIdNumber} || true"
        sh "docker rm --force ansible-${buildIdNumber} || true"
        sh "docker network rm ${cicd_network_name} || true"
        throw error
    }
    finally {
        sh "docker network disconnect ${cicd_network_name} ansible-${buildIdNumber} || true"
        sh "docker rm --force ansible-${buildIdNumber} || true"
        sh "docker network rm ${cicd_network_name} || true"
    }
}
}}

