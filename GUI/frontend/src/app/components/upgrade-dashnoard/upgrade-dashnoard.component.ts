import { Component, OnInit } from '@angular/core';
import { AddhostService } from '../../service/add-host.service';
import {NgForm} from '@angular/forms'; 
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-upgrade-dashnoard',
  templateUrl: './upgrade-dashnoard.component.html',
  styleUrls: ['./upgrade-dashnoard.component.css']
})
export class UpgradeDashnoardComponent implements OnInit {

  constructor(private addhost: AddhostService) { }


  title = 'nso-host';
  data= [];
  hostlist=[];
  showloader:boolean=false;
  collectflag:boolean=false;
  showalert:boolean=false;
  showerror:boolean=false;
  selhost:any=[];
  resultset:any=[];
  filedata:any;
  filetype:any="";
  errormsg:any;
  // selhost={nso_version: "", ha_status: "", linux: "", java: "", python: "", ant: "", linuxpackage: "", pythonpackage:""};
  // C:/Users/napetkar/Downloads/176.91/log_python_lib_2022-01-28-08-02-13.txt
  data1= [{"name": "172.18.176.91","Static_hostname": "anirudhnso", "Operating_System": "CentOS Linux 7 (Core)","Kernel": "Linux 3.10.0-1127.19.1.el7.x86_64", "ncs_version": "5.2.4","HA": "None","Apache_Ant": "1.9.4","openjdk_version": "11.0.8 2020-07-14 LTS","Python": "2.7.5", "linuxpackage":"https://www.w3schools.com/xml/plant_catalog.xml" , "pythonpackage":"https://filesamples.com/samples/document/txt/sample1.txt"}
  ,
  {"name": "172.18.176.92","Static_hostname": "NSO-CRF-2","Icon_name": "computer-vm", "Chassis": "vm","Machine_ID": "6fff49d5cfe5469698f442b6023e27ce","Boot_ID": "5853dbdfb03940a9b7124420f7ab09c7","Virtualization": "vmware","Operating_System": "Ubuntu 18.04.6 LTS","Kernel": "Linux 4.15.0-163-generic","Architecture": "x86-64","ncs_version": "5.4.4.3","Apache_Ant": "1.10.5 compiled on March 28 2019","openjdk_version": "1.8.0_312","OpenJDK_Runtime_Environment": "(build 1.8.0_312-8u312-b07-0ubuntu1~18.04-b07)","OpenJDK_64-Bit_Server_VM": "(build 25.312-b07, mixed mode)","Python": "2.7.17","linuxpackage":"C:/Users/napetkar/Downloads/176.92/172.18.176.92_linux_lib_2022-01-28-08-02-05.txt","pythonpackage":"C:/Users/napetkar/Downloads/176.92/172.18.176.92_python_lib_2022-01-28-08-02-05.txt"}
]
morelist=['En/Disable HA', 'Show Status', 'Backup', 'Copy Packages', 'Upgrade','Show NCS Config','Compact CDB',
'Copy NCS Config','Apply Config', 'Testing']
  deviceList:any = [
    {id:1,ned:"Cisco-iosxr 7.36.4",devices:13232},
    {id:2,ned:"Cisco-iosxr 7.38",devices:50},
    {id:3,ned:"Junos 4.16.4",devices:3000},
    {id:4,ned:"Junos 4.6.37",devices:25}
  ]; 

  servicesList:any = [
    {id:1,services:"L2 MPLS",inatnces:70000,migratedIntances:1000},
    {id:1,services:"L3 MPLS",inatnces:80000,migratedIntances:1000},
    {id:1,services:"MPLS VPLS",inatnces:20000,migratedIntances:1000},
    {id:1,services:"Internet",inatnces:120000,migratedIntances:1000}
  ]; 
  host:any={
    name: "",
    username:"",
    password: "",
    description: "",
    instanceid: "",
    enable: true,
    host_key_checking: false,
  }
  activeTabs:string = "upgradeDashboard";
  upgradeOption:string = "Select Host";
  moreOption: string="";
  isOpenDropDown:boolean = false;
  isOpenmore: boolean =false;
  model:string = "close";

  ngOnInit() {
  this.getdetails();
  }
  getdetails(){
    this.showerror = false;
    this.addhost.gethostdetails().subscribe(obj => {
      console.log(obj.data);
      this.data=obj.data;
      this.hostlist= obj.data.map((val: any) => val.name);
      console.log(this.hostlist);
    },
    err => {
      console.log(err);
      this.showloader= false;
      this.showerror=true;
      this.errormsg= err.statusText;
    }) 
  }

  // changeTab(tab:string="upgradeDashboard"){
  //   this.activeTabs = tab;
  //   this.getdetails();
  // }
  dropDownToggle(){
    this.isOpenDropDown = this.isOpenDropDown ? false : true;
  }
  togglemore(){
    this.isOpenmore = this.isOpenmore ? false : true;
  }
  selectOpt(val:string=""){
    console.log(val);
    this.selhost=[];
    this.resultset=[];
    this.filedata= "";
    this.filetype="";
    this.collectflag = false;
    this.showalert=false;
    this.upgradeOption = val == 'select_host' ? 'Select Host' : val;
    console.log(typeof(this.data));
    var selhostdesc= this.data.filter((obj:any)=> obj.name == this.upgradeOption);
    console.log(selhostdesc);
    // var selres= this.data1.filter((obj:any)=> obj.name == val);
    // console.log(selres);
    // // this.selhost=selres[0];
    // this.selhost = selres.map((obj : any)=> ({nso_version: obj.ncs_version, ha_status: obj.HA,linux: obj.Operating_System+" "+obj.Kernel , java: obj.openjdk_version, python: obj.Python, ant: obj.Apache_Ant, pythonpackage:obj.pythonpackage, linuxpackage: obj.linuxpackage}))[0]
    // console.log(this.selhost);
    // var selhostdesc= this.data.filter((obj:any)=> obj.name == val).map((obj:any)=> ({name: obj.name, description:obj.description}));
    // console.log(selhostdesc);
    this.showloader=true;
    this.showerror=false;
    this.addhost.checkdata(selhostdesc[0]).subscribe(data => {
      console.log(data);
      this.resultset= data;
      this.showloader= false;
      if(data['version-details'] == "no_data"){
        this.showalert=true;
        // alert("Please click Run Data Collector to fetch details.")
      }
      else{
        this.selhost=data['version-details'];
        this.collectflag = true;
        console.log(this.selhost);
      }
    },
    err => {
      console.log(err);
      this.showloader= false;
      this.showerror=true;
      this.errormsg= err.statusText;
    })
   // this.isOpenDropDown = false;
  }
  closeModal(){
    this.showalert = false;
  }
  selectmore(val:string=""){
    console.log(val);
    this.moreOption = val ;
   // this.isOpenDropDown = false;
  }
  collectdata(){
    var selres= this.data1.filter((obj:any)=> obj.name == this.upgradeOption);
    console.log(selres);
    // this.selhost=selres[0];
    // this.selhost = selres.map((obj : any)=> ({nso_version: obj.ncs_version, ha_status: obj.HA,linux: obj.Operating_System+" "+obj.Kernel , java: obj.openjdk_version, python: obj.Python, ant: obj.Apache_Ant, pythonpackage:obj.pythonpackage, linuxpackage: obj.linuxpackage}))[0]
    // console.log(this.selhost);
    var selhostdesc= this.data.filter((obj:any)=> obj.name == this.upgradeOption);
    console.log(selhostdesc);
    this.showloader=true;
    this.collectflag = false;
    this.addhost.collectdata(selhostdesc[0]).subscribe(data => {
      console.log(data)
      this.resultset= data;
      this.selhost=data['version-details'];
      this.showloader= false;
      this.collectflag = true;
      console.log(this.selhost);
      // this.data=data;
    },
    err => {
      console.log(err);
      this.showloader= false;
      this.showerror=true;
      this.errormsg= err.statusText;
    })
    
  }
  getfiledata(val:string=""){
    this.showerror= false;
    this.addhost.getfiledetails({"file-type":val, "name":this.upgradeOption}).subscribe(data => {
      console.log(data)
      this.filedata= data;
      this.filetype=val;
      var winPrint:any;
      winPrint= window.open('', '', 'left=0,top=0,width=800,height=600,toolbar=0,scrollbars=0,status=0');
      winPrint.document.write( '<body style="white-space: pre-line"> <xmp> '+this.filedata+' </xmp></body>');
      winPrint.document.close();
  },
  err => {
    console.log(err);
    this.showloader= false;
    this.showerror=true;
    this.errormsg= err.statusText;
  })
  }
	download() {
		// this.addhost.downloadFile(url).subscribe((response: any) => {
			let blob:any = new Blob([this.filedata], { type: 'text/json; charset=utf-8' });
			const url = window.URL.createObjectURL(blob);
			//window.open(url);
			saveAs(blob,this.filetype+'.txt');
			// }), (error: any) => console.log('Error downloading the file'),
			() => console.info('File downloaded successfully');
	}

  openModal(val:string=""){
    this.model = val == 'open' ? 'open' : val;
    this.addhost.gethostdetails().subscribe(data => {
      console.log(data)
    }) 
  }
  onSubmit(){
    let obj ={
      name: this.host.name,
      description: this.host.description,
      instanceid: this.host.instanceid,
      enabled: this.host.enable,
      host_key_checking: false,
      variables: "ansible_connection: ssh\nansible_password: "+this.host.password+"\nansible_ssh_user: "+this.host.username+"\nhost_key_checking: False"
    }
    console.log(obj);
    // this.addhost.addhostdetails(obj).subscribe(data => {
    //   console.log(data)
    //   this.data=data;
    // })  
    this.model = 'close';
  }

}

