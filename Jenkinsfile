properties([
  parameters([
    booleanParam(name: 'Remove_Background_Dockers', defaultValue: false)
  ])
])

def credentialsId = params.credentialsId

// library mantaining groovy files which are adding functionality 
library identifier: 'nso-pipeline-library@master', retriever: modernSCM(
    [$class       : 'GitSCMSource',
        remote       : 'https://wwwin-github.cisco.com/AS-Community/nso-pipeline-library.git',
        credentialsId: "${credentialsId}"])
library identifier: 'rasta-pipeline-library@cxta-trial', retriever: modernSCM(
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
import com.cisco.cxta.*
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
credentialsId = "345c79bc-9def-4981-94b5-d8190fdd2304"

// ###Project Variables
def EMAIL = "mdobieck@cisco.com"
def gitProjectUrl = "https://wwwin-github.cisco.com/mdobieck/ansible_nso_automation.git"
// One of the available cs-emear
def SPADE_node = "emear-sio-slv04" 


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

    }
    catch (error) {
        echo "Exception: " + error
        echo "Cleaning up: "

        throw error
    }
    finally {

    }
}
}}

