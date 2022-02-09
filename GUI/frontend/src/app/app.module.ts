import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UpgradeDashnoardComponent } from './components/upgrade-dashnoard/upgrade-dashnoard.component';
import { InstallNSOComponent } from './components/install-nso/install-nso.component';
import { InventoryHostsComponent } from './components/inventory-hosts/inventory-hosts.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { MigrationReportsComponent } from './components/migration-reports/migration-reports.component';
import { AddhostService } from './service/add-host.service';

import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NavbarComponent,
    UpgradeDashnoardComponent,
    InstallNSOComponent,
    InventoryHostsComponent,
    ConfigurationComponent,
    MigrationReportsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [AddhostService],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
