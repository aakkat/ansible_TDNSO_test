import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigurationComponent } from '../../components//configuration/configuration.component';
import { InstallNSOComponent } from '../../components/install-nso/install-nso.component';
import { InventoryHostsComponent } from '../../components/inventory-hosts/inventory-hosts.component';
import { MigrationReportsComponent } from '../../components/migration-reports/migration-reports.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { UpgradeDashnoardComponent } from '../../components/upgrade-dashnoard/upgrade-dashnoard.component';

const routes: Routes = [
    {
    path: '/',
    loadChildren: () => import('../../components/upgrade-dashnoard/upgrade-dashnoard.module').then(m => m.UpgradeDashnoardModule ),
    children: [
          {
            path: 'upgradeDashboard',
            loadChildren: () => import('../../components/upgrade-dashnoard/upgrade-dashnoard.module').then(m => m.UpgradeDashnoardModule ),
          },
          {
            path: 'installnewNSO',
            loadChildren: () => import('../../components/install-nso/install-nso.module').then(m => m.InstallNSOModule ),
          },
    // {
    // path: 'upgradeDashboard',
    // component: UpgradeDashnoardComponent
    // },
    {
    path: 'installnewNSO',
    component: InstallNSOComponent
    },
    {
        path: 'inventoryHosts',
        component: InventoryHostsComponent
        },
        {
        path: 'configurations',
        component: ConfigurationComponent
        },
        {
            path: 'migrationReports',
            component: MigrationReportsComponent
            }
    ]
    }
    ];
  
    @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
    })
    export class NavbarRoutingModule { }
     