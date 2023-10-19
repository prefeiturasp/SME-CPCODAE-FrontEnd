import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DashboardDetailHeaderComponent } from '../public/dashboard/_components/detail-header/dashboard-detail-header.component';
import { DashboardGeneralInfoComponent } from '../public/dashboard/_components/general-info/dashboard-general-info.component';

import { CoreModule } from './core.module';

@NgModule({
  declarations: [
    DashboardDetailHeaderComponent,
    DashboardGeneralInfoComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    RouterModule
  ],
  exports: [
    DashboardDetailHeaderComponent,
    DashboardGeneralInfoComponent,

    CommonModule,
    CoreModule,
    RouterModule
  ],
  providers: [ ],
  bootstrap: [],
})
export class ProposalComponentsModule {}
