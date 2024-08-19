import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardDetailComponent } from './dashboard/detail/dashboard-detail.component';
import { MessagePageComponent } from './message-page/message-page.component';
import { PublicComponent } from './public.component';

const routes: Routes = [
  { path: '', redirectTo: '/chamadas-publicas', pathMatch: 'full' },

  {
    path: 'mensagem', component: PublicComponent,
    children: [{ path: '', component: MessagePageComponent }]
  },

  {
    path: 'chamadas-publicas',
    component: PublicComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: ':id', component: DashboardDetailComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule { }
