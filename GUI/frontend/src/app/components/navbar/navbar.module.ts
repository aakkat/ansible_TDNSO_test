import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { NavbarComponent } from '../../components/navbar/navbar.component';
import { UpgradeDashnoardComponent } from '../../components/upgrade-dashnoard/upgrade-dashnoard.component';
import { InstallNSOComponent } from '../../components/install-nso/install-nso.component';
import { InventoryHostsComponent } from '../../components/inventory-hosts/inventory-hosts.component';
import { ConfigurationComponent } from '../../components/configuration/configuration.component';
import { MigrationReportsComponent } from '../../components/migration-reports/migration-reports.component';
// import { NavbarRoutingModule } from './navbar-routing.module';

import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { AddhostService } from '../../service/add-host.service';


@NgModule({
  declarations: [
    NavbarComponent,
    UpgradeDashnoardComponent,
    InstallNSOComponent,
    InventoryHostsComponent,
    ConfigurationComponent,
    MigrationReportsComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    // NavbarRoutingModule
  ],
  providers: [AddhostService],
  bootstrap: [NavbarComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class NavbarModule { }
