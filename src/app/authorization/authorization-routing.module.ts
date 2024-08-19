import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizationGuard } from '../_services/_guards/authorization.guard';
import { AuthorizationLoginGuard } from '../_services/_guards/authorization-login.guard';

import { LoginComponent } from './login/login.component';
import { AuthorizationComponent } from './authorization.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  {
    path: '',
    component: AuthorizationComponent,
    children: [
      { path: 'login', canActivate: [AuthorizationLoginGuard], component: LoginComponent },
      { path: 'alterar-senha', canActivate: [AuthorizationGuard], component: ChangePasswordComponent },
      { path: 'recuperar-senha/:token', canActivate: [AuthorizationLoginGuard], component: RecoverPasswordComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthorizationRoutingModule {}
