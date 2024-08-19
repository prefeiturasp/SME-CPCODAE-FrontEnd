import { NgModule } from '@angular/core';

import { CoreModule } from '../_modules/core.module';
import { NavigationModule } from '../navigation/navigation.module';

import { AuthorizationRoutingModule } from './authorization-routing.module';

import { AuthorizationComponent } from './authorization.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LoginComponent } from '../authorization/login/login.component';
import { RecoverPasswordComponent } from '../authorization/recover-password/recover-password.component';

import { AuthorizationGuard } from '../_services/_guards/authorization.guard';
import { AuthorizationLoginGuard } from '../_services/_guards/authorization-login.guard';

import { LoginService } from '../authorization/login/login.service';
import { ChangePasswordService } from './change-password/change-password.service';
import { RecoverPasswordService } from '../authorization/recover-password/recover-password.service';

@NgModule({
  declarations: [
    AuthorizationComponent,
    ChangePasswordComponent,
    LoginComponent,
    RecoverPasswordComponent
  ],
  imports: [
    CoreModule,
    
    AuthorizationRoutingModule,
    NavigationModule
  ],
  providers: [
    AuthorizationGuard,
    AuthorizationLoginGuard,
    
    ChangePasswordService,
    LoginService,
    RecoverPasswordService
  ],
  bootstrap: [
    LoginComponent
  ],
})
export class AuthorizationModule {}
