import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt);

import { CoreModule } from './_modules/core.module';

import { AppRoutingModule } from './app-routing.module';

import { AdminModule } from './admin/admin.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { CooperativeModule } from './cooperative/cooperative.module';
import { PublicModule } from './public/public.module';
import { NavigationModule } from './navigation/navigation.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,

    CoreModule,

    AdminModule,
    AuthorizationModule,
    CooperativeModule,
    PublicModule,
    NavigationModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "pt-BR" }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
