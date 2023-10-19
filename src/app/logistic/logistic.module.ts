import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LogisticRoutingModule } from './logistic-routing.module';
import { ComponentsModule } from '../_components/components.module';
import { CoreModule } from '../_modules/core.module';
import { NavigationModule } from '../navigation/navigation.module';


import { LogisticComponent } from './logistic.component';
import { LogisticDashboardComponent } from './dashboard/dashboard.component';
import { LogisticDeliveryConfirmationComponent } from './delivery-confirmation/delivery-confirmation.component';

import { LogisticGuard } from '../_services/_guards/logistic.guard';

@NgModule({
  declarations: [
    LogisticComponent,
    LogisticDashboardComponent,
    LogisticDeliveryConfirmationComponent
  ],
  imports: [
    RouterModule,
    
    LogisticRoutingModule,
    ComponentsModule,
    CoreModule,
    NavigationModule
  ],
  providers: [
    LogisticGuard
  ],
  bootstrap: [
  ],
})
export class LogisticModule {}
