import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcessoNegadoComponent } from './navigation/acesso-negado/acesso-negado.component';
import { NotFoundComponent } from './navigation/not-found/not-found.component';

const routes: Routes = [
  { path: '', loadChildren: () => import('./public/public.module').then(m => m.PublicModule) },
  { path: '', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: '', loadChildren: () => import('./cooperative/cooperative.module').then(m => m.CooperativeModule) },
  { path: '', loadChildren: () => import('./logistic/logistic.module').then(m => m.LogisticModule) },
  { path: '', loadChildren: () => import('./authorization/authorization.module').then(m => m.AuthorizationModule) },

  { path: 'acesso-negado', component: AcessoNegadoComponent },
  { path: 'nao-encontrado', component: NotFoundComponent },
	{ path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
