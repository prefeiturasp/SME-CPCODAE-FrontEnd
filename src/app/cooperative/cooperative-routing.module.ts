import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CooperativeGuard } from '../_services/_guards/cooperative.guard';

import { ProfileComponent } from '../profile/profile.component';
import { CooperativeComponent } from './cooperative.component';
import { CooperativeDashboardComponent } from './dashboard/dashboard.component';
import { CooperativeDocumentsComponent } from './documents/documents.component';
import { CooperativeEmailConfirmationComponent } from './email-confirmation/email-confirmation.component';
import { CooperativeGeneralDataComponent } from './general-data/general-data.component';
import { CooperativeMembersComponent } from './members/members.component';
import { ProposalComponent } from './proposal/proposal.component';
import { CooperativeRegistrationCompletionStep1Component } from './registration-completion/step1/registration-completion-step1.component';
import { CooperativeRegistrationCompletionStep2Component } from './registration-completion/step2/registration-completion-step2.component';
import { CooperativeRegistrationCompletionStep3Component } from './registration-completion/step3/registration-completion-step3.component';
import { CooperativeRegistrationComponent } from './registration/registration.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'cooperativa', redirectTo: '/cooperativa/minhas-propostas', pathMatch: 'full' },

  { path: '', component: CooperativeComponent,
    children: [
      { path: 'chamadas-publicas/:id/edicao-proposta/:food_id', canActivate: [CooperativeGuard], component: ProposalComponent },
      { path: 'chamadas-publicas/:id/inscricao', canActivate: [CooperativeGuard], component: ProposalComponent }
    ]
  },

  {
    path: 'cooperativa', component: CooperativeComponent,
    children: [
      { path: 'cadastro', component: CooperativeRegistrationComponent },
      { path: 'confirme-email/:token', component: CooperativeEmailConfirmationComponent },
      { path: 'complete-seu-registro/passo-1/:id', canActivate: [CooperativeGuard], component: CooperativeRegistrationCompletionStep1Component },
      { path: 'complete-seu-registro/passo-2/:id', canActivate: [CooperativeGuard], component: CooperativeRegistrationCompletionStep2Component },
      { path: 'complete-seu-registro/passo-3/:id', canActivate: [CooperativeGuard], component: CooperativeRegistrationCompletionStep3Component },
      { path: 'cooperados', canActivate: [CooperativeGuard], component: CooperativeMembersComponent },
      { path: 'dados-gerais', canActivate: [CooperativeGuard], component: CooperativeGeneralDataComponent },
      { path: 'documentos', canActivate: [CooperativeGuard], component: CooperativeDocumentsComponent },
      { path: 'minhas-propostas', canActivate: [CooperativeGuard], component: CooperativeDashboardComponent },
      { path: ':id', canActivate: [CooperativeGuard], component: ProfileComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CooperativeRoutingModule {}
