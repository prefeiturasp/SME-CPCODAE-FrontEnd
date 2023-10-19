import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CoreModule } from 'src/app/_modules/core.module';
import { ProposalComponentsModule } from 'src/app/_modules/proposal-components.module';

import { DashboardComponent } from './dashboard.component';
import { DashboardDetailComponent } from './detail/dashboard-detail.component';
import { DashboardListComponent } from './_components/list/dashboard-list.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardDetailComponent,
    DashboardListComponent
  ],
  imports: [
    RouterModule,
    
    CoreModule,
    ProposalComponentsModule
  ],
  providers: [ ],
  bootstrap: [
    DashboardComponent
  ],
})
export class DashboardModule {}
