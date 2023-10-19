import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdminRoutingModule } from './admin-routing.module';
import { ComponentsModule } from '../_components/components.module';
import { CoreModule } from '../_modules/core.module';
import { NavigationModule } from '../navigation/navigation.module';


import { AdminComponent } from './admin.component';
import { AdminCategoryComponent } from './category/category.component';
import { AdminCategoryRegistrationComponent } from './category/registration/category-registration.component';
import { AdminChangeRequestsComponent } from './change-requests/change-requests.component';
import { AdminCooperativeComponent } from './cooperative/cooperative.component';
import { AdminCooperativeRegistrationComponent } from './cooperative/registration/cooperative-registration.component';
import { AdminCooperativeMemberComponent } from './cooperative-member/cooperative-member.component';
import { AdminDashboardDetailCheckoutComponent } from './dashboard/detail/checkout/dashboard-checkout.component';
import { AdminDashboardComponent } from './dashboard/dashboard.component';
import { AdminDashboardDetailComponent } from './dashboard/detail/dashboard-detail.component';
import { AdminDashboardDetailChangeRequestModalComponent } from './dashboard/detail/change-request-modal/change-request-modal.component';
import { AdminDashboardDetailConfirmModalComponent } from './dashboard/detail/confirm-delivery-modal/confirm-delivery-modal.component';
import { AdminDashboardDetailTableComponent } from './dashboard/detail/table/dashboard-detail-table.component';
import { AdminDocumentTypeComponent } from './document-type/document-type.component';
import { AdminDocumentTypeRegistrationComponent } from './document-type/registration/document-type-registration.component';
import { AdminFoodComponent } from './food/food.component';
import { AdminFoodRegistrationComponent } from './food/registration/food-registration.component';
import { AdminPublicCallComponent } from './public-call/public-call.component';
import { AdminPublicCallFoodDocumentModalComponent } from './public-call/modal/public-call-food-document-modal.component';
import { AdminUserComponent } from './user/user.component';
import { AdminUserRegistrationComponent } from './user/registration/user-registration.component';

import { AdminGuard } from '../_services/_guards/admin.guard';
import { AdminCategoryService } from './category/category.service';
import { AdminCooperativeService } from './cooperative/cooperative.service';
import { AdminCooperativeMemberService } from './cooperative-member/cooperative-member.service';
import { AdminDocumentTypeService } from './document-type/document-type.service';
import { AdminFoodService } from './food/food.service';
import { AdminPublicCallService } from './public-call/public-call.service';

@NgModule({
  declarations: [
    AdminComponent,
    AdminCategoryComponent,
    AdminCategoryRegistrationComponent,
    AdminChangeRequestsComponent,
    AdminCooperativeComponent,
    AdminCooperativeRegistrationComponent,
    AdminCooperativeMemberComponent,
    AdminDashboardComponent,
    AdminDashboardDetailCheckoutComponent,
    AdminDashboardDetailComponent,
    AdminDashboardDetailChangeRequestModalComponent,
    AdminDashboardDetailConfirmModalComponent,
    AdminDashboardDetailTableComponent,
    AdminDocumentTypeComponent,
    AdminDocumentTypeRegistrationComponent,
    AdminFoodComponent,
    AdminFoodRegistrationComponent,
    AdminPublicCallComponent,
    AdminPublicCallFoodDocumentModalComponent,
    AdminUserComponent,
    AdminUserRegistrationComponent
  ],
  imports: [
    RouterModule,
    
    AdminRoutingModule,
    ComponentsModule,
    CoreModule,
    NavigationModule
  ],
  providers: [
    AdminGuard,

    AdminCategoryService,
    AdminCooperativeService,
    AdminCooperativeMemberService,
    AdminDocumentTypeService,
    AdminFoodService,
    AdminPublicCallService
  ],
  bootstrap: [
  ],
})
export class AdminModule {}
