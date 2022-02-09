import { Component, OnInit } from '@angular/core';
import { AddhostService } from '../../service/add-host.service';
import {NgForm} from '@angular/forms'; 

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private addhost: AddhostService) { }


  title = 'nso-host';
  data= [];
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
  isOpenDropDown:boolean = false;
  model:string = "close";

  ngOnInit(): void {
    // this.addhost.gethostdetails().subscribe(data => {
    //   console.log(data);
    // }) 
  }

  changeTab(tab:string="upgradeDashboard"){
    this.activeTabs = tab;
  }
  dropDownToggle(){
    this.isOpenDropDown = this.isOpenDropDown ? false : true;
  }
  selectOpt(val:string=""){
    this.upgradeOption = val == 'select_host' ? 'Select Host' : val;
   // this.isOpenDropDown = false;
  }
 
}
