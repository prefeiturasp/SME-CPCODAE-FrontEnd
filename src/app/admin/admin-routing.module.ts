import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from '../_services/_guards/admin.guard';

import { AdminComponent } from './admin.component';
import { AdminCategoryComponent } from './category/category.component';
import { AdminCategoryRegistrationComponent } from './category/registration/category-registration.component';
import { AdminChangeRequestsComponent } from './change-requests/change-requests.component';
import { AdminCooperativeComponent } from './cooperative/cooperative.component';
import { AdminCooperativeRegistrationComponent } from './cooperative/registration/cooperative-registration.component';
import { AdminCooperativeMemberComponent } from './cooperative-member/cooperative-member.component';
import { AdminDashboardComponent } from './dashboard/dashboard.component';
import { AdminDashboardDetailComponent } from './dashboard/detail/dashboard-detail.component';
import { AdminDocumentTypeComponent } from './document-type/document-type.component';
import { AdminDocumentTypeRegistrationComponent } from './document-type/registration/document-type-registration.component';
import { AdminFoodComponent } from './food/food.component';
import { AdminFoodRegistrationComponent } from './food/registration/food-registration.component';
import { AdminPublicCallComponent } from './public-call/public-call.component';
import { AdminUserComponent } from './user/user.component';
import { AdminUserRegistrationComponent } from './user/registration/user-registration.component';
import { ProfileComponent } from '../profile/profile.component';

const routes: Routes = [
  { path: 'admin', redirectTo: '/admin/chamadas-publicas', pathMatch: 'full' },
  {
    path: 'admin', component: AdminComponent,
    children: [
      { path: 'alimento', canActivate: [AdminGuard], component: AdminFoodComponent },
      { path: 'alimento/:id', canActivate: [AdminGuard], component: AdminFoodRegistrationComponent },
      { path: 'categoria', canActivate: [AdminGuard], component: AdminCategoryComponent },
      { path: 'categoria/:id', canActivate: [AdminGuard], component: AdminCategoryRegistrationComponent },
      { path: 'solicitacoes-alteracoes', canActivate: [AdminGuard], component: AdminChangeRequestsComponent },
      { path: 'chamadas-publicas', canActivate: [AdminGuard], component: AdminDashboardComponent },
      { path: 'chamadas-publicas/:id', canActivate: [AdminGuard], component: AdminPublicCallComponent },
      { path: 'chamadas-publicas/:id/propostas', canActivate: [AdminGuard], component: AdminDashboardDetailComponent },
      { path: 'cooperado', canActivate: [AdminGuard], component: AdminCooperativeMemberComponent },
      { path: 'cooperativa', canActivate: [AdminGuard], component: AdminCooperativeComponent },
      { path: 'cooperativa/:id', canActivate: [AdminGuard], component: AdminCooperativeRegistrationComponent },
      { path: 'tipo-documento', canActivate: [AdminGuard], component: AdminDocumentTypeComponent },
      { path: 'tipo-documento/:id', canActivate: [AdminGuard], component: AdminDocumentTypeRegistrationComponent },
      { path: 'usuario', canActivate: [AdminGuard], component: AdminUserComponent },
      { path: 'usuario/:id', canActivate: [AdminGuard], component: AdminUserRegistrationComponent },
      { path: ':id', canActivate: [AdminGuard], component: ProfileComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
