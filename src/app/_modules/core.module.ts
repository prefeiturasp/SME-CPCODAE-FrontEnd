import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { CurrencyMaskConfig, CurrencyMaskModule, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IConfig, NgxMaskModule } from 'ngx-mask'

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelect2Module } from 'ng-select2';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ToastrModule } from 'ngx-toastr';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { OverlayModule } from '@angular/cdk/overlay';

import { ErrorInterceptorService } from '../_services/_interceptors/error-interceptor.service';
import { HttpInterceptorService } from '../_services/_interceptors/http-interceptor.service';
import { BankService } from '../_services/bank.service';
import { LocationService } from '../_services/location.service';
import { SettingsService } from '../_services/settings.service';
import { UtilsService } from '../_services/utils.service';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

import { ProfileComponent } from '../profile/profile.component';
import { PreventSpaceDirective } from '../_utils/directives/prevent-keys.directive';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = { suppressScrollX: true };
const DEFAULT_CURRENCY_MASK_CONFIG: CurrencyMaskConfig = { align: "right", allowNegative: true, decimal: ",", precision: 2, prefix: "R$ ", suffix: "", thousands: "." };
const DEFAULT_MASK_CONFIG: () => Partial<IConfig> = () => { return { validation: false, }; };

@NgModule({
  declarations: [
    ProfileComponent,
    PreventSpaceDirective
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,

    AngularEditorModule,
    ImageCropperModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    OverlayModule,
    
    AutocompleteLibModule,
    CurrencyMaskModule,
    NgxChartsModule,
    NgxMaskModule.forRoot(DEFAULT_MASK_CONFIG),
    NgxSpinnerModule,
    NgbModule,
    NgSelect2Module,
    PdfViewerModule,
    PerfectScrollbarModule,
    ToastrModule.forRoot()
  ],
  exports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,

    AngularEditorModule,
    ImageCropperModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    OverlayModule,

    AutocompleteLibModule,
    CurrencyMaskModule,
    NgxChartsModule,
    NgxMaskModule,
    NgxSpinnerModule,
    NgbModule,
    NgSelect2Module,
    PdfViewerModule,
    PerfectScrollbarModule,
    ToastrModule,

    PreventSpaceDirective
  ],
  providers: [
    { provide: CURRENCY_MASK_CONFIG, useValue: DEFAULT_CURRENCY_MASK_CONFIG },
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },

    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },

    BankService,
    LocationService,
    SettingsService,
    UtilsService
  ],
  bootstrap: [],
})
export class CoreModule {}
