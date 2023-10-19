import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LogisticGuard } from '../_services/_guards/logistic.guard';

import { LogisticComponent } from './logistic.component';
import { LogisticDashboardComponent } from './dashboard/dashboard.component';
import { LogisticDeliveryConfirmationComponent } from './delivery-confirmation/delivery-confirmation.component';
import { ProfileComponent } from '../profile/profile.component';

const routes: Routes = [
  { path: 'logistica', redirectTo: '/logistica/chamadas-publicas', pathMatch: 'full' },
  {
    path: 'logistica', component: LogisticComponent,
    children: [
      { 
        path: 'chamadas-publicas', canActivate: [LogisticGuard],
        children: [
          { path: ':id/confirmar-entrega', component: LogisticDeliveryConfirmationComponent },
          { path: '', component: LogisticDashboardComponent }
        ]
      },
      { path: ':id', canActivate: [LogisticGuard], component: ProfileComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogisticRoutingModule {}
