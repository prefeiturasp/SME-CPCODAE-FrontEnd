import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentsModule } from '../_components/components.module';
import { CooperativeRoutingModule } from './cooperative-routing.module';
import { CoreModule } from '../_modules/core.module';
import { NavigationModule } from '../navigation/navigation.module';
import { ProposalComponentsModule } from '../_modules/proposal-components.module';

import { CooperativeService } from './cooperative.service';
import { CooperativeFaleConoscoService } from './fale-conosco/fale-conosco.service';
import { ProposalService } from './proposal/proposal.service';

import { CooperativeGuard } from '../_services/_guards/cooperative.guard';

import { CooperativeComponent } from './cooperative.component';
import { CooperativeDashboardComponent } from './dashboard/dashboard.component';
import { CooperativeDashboardAcceptModalComponent } from './dashboard/modal/accept-modal.component';
import { CooperativeDashboardListComponent } from './dashboard/list/dashboard-list.component';
import { CooperativeDocumentsComponent } from './documents/documents.component';
import { CooperativeEmailConfirmationComponent } from './email-confirmation/email-confirmation.component';
import { CooperativeFaleConoscoComponent } from './fale-conosco/fale-conosco.component';
import { CooperativeGeneralDataComponent } from './general-data/general-data.component';
import { CooperativeMembersComponent } from './members/members.component';
import { CooperativeProposalCheckoutComponent } from './proposal/checkout/proposal-checkout.component';
import { CooperativeRegistrationComponent } from './registration/registration.component';
import { CooperativeRegistrationCompletionStep1Component } from './registration-completion/step1/registration-completion-step1.component';
import { CooperativeRegistrationCompletionStep2Component } from './registration-completion/step2/registration-completion-step2.component';
import { CooperativeRegistrationCompletionStep2AddComponent } from './registration-completion/step2/add/registration-completion-step2-add.component';
import { CooperativeRegistrationCompletionStep2ViewComponent } from './registration-completion/step2/view/registration-completion-step2-view.component';
import { CooperativeRegistrationCompletionStep3Component } from './registration-completion/step3/registration-completion-step3.component';
import { CooperativeRegistrationCompletionStep3AddComponent } from './registration-completion/step3/add/registration-completion-step3-add.component';
import { CooperativeRegistrationCompletionStep3ListComponent } from './registration-completion/step3/list/registration-completion-step3-list.component';
import { ProposalComponent } from './proposal/proposal.component';
import { ProposalChangeRequestModalComponent } from './proposal/change-request-modal/change-request-modal.component';
import { ProposalUploadMembersComponent } from './proposal/upload-members/proposal-upload-members.component';
import { ProposalUploadMembersErrorComponent } from './proposal/upload-members-error/proposal-upload-members-error.component';
import { CooperativeDashboardService } from './dashboard/dashboard.service';
import { SearchDropdown } from '../_components/search-dropdown/search-dropdown.component';

@NgModule({
  declarations: [
    CooperativeComponent,
    CooperativeDashboardComponent,
    CooperativeDashboardAcceptModalComponent,
    CooperativeDashboardListComponent,
    CooperativeDocumentsComponent,
    CooperativeEmailConfirmationComponent,
    CooperativeFaleConoscoComponent,
    CooperativeGeneralDataComponent,
    CooperativeProposalCheckoutComponent,
    CooperativeMembersComponent,
    CooperativeRegistrationComponent,
    CooperativeRegistrationCompletionStep1Component,
    CooperativeRegistrationCompletionStep2Component,
    CooperativeRegistrationCompletionStep2AddComponent,
    CooperativeRegistrationCompletionStep2ViewComponent,
    CooperativeRegistrationCompletionStep3Component,
    CooperativeRegistrationCompletionStep3AddComponent,
    CooperativeRegistrationCompletionStep3ListComponent,
    ProposalComponent,
    ProposalChangeRequestModalComponent,
    ProposalUploadMembersComponent,
    ProposalUploadMembersErrorComponent,
    SearchDropdown
  ],
  imports: [
    RouterModule,
    
    ComponentsModule,
    CooperativeRoutingModule,
    CoreModule,
    NavigationModule,
    ProposalComponentsModule
  ],
  providers: [
    CooperativeGuard,
    
    CooperativeDashboardService,
    CooperativeFaleConoscoService,
    CooperativeService,
    ProposalService
  ],
  bootstrap: [
    CooperativeDashboardComponent
  ],
})
export class CooperativeModule {}
