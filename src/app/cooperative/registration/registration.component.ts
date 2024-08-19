import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ImageCroppedEvent } from 'ngx-image-cropper';

import { BankService } from 'src/app/_services/bank.service';
import { CooperativeService } from '../cooperative.service';
import { LoaderService } from 'src/app/_services/loader.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { UtilsService } from 'src/app/_services/utils.service';

import { City, State } from 'src/app/_models/location.model';
import { CepCpfCnpjValidator } from 'src/app/_utils/validators/cep-cpf-cnpj.validator';
import { ConfirmedValidator } from 'src/app/_utils/validators/confirmed-validator';
import { DateValidator } from 'src/app/_utils/validators/date.validator';
import { LocationService } from 'src/app/_services/location.service';
import { MaritalStatusEnum } from 'src/app/_enums/marital-status.enum';
import { PhoneNumberValidator } from 'src/app/_utils/validators/phone-number.validator';

import { environment } from 'src/environments/environment';

declare const focusOnFormError: any;
declare const isEmpty: any;
declare const onlyNumbers: any;
declare const textTransformCapitalize: any;

@Component({ selector: 'app-cooperative-registration', templateUrl: './registration.component.html', styleUrls: ['./registration.component.scss'] })
export class CooperativeRegistrationComponent implements OnInit {
    public registrationForm!: UntypedFormGroup;

    public inRegistrationMode = true;
    public submitted = false;
    public isAdd: boolean = true;
    public citiesList: City[] = [];
    public citiesListLegalRepresentative: City[] = [];
    public statesList: State[] = [];

    public MaritalStatusEnum: any = MaritalStatusEnum;

    public imageChangedEvent: any = '';
    public croppedImage: any = '';
    public pdfSrc: string = `/assets/upload-docs/${environment.termosUsoFileName}`;

    constructor(
      private bankService: BankService,
        private cooperativeService: CooperativeService,
        private loaderService: LoaderService,
        private notificationService: NotificationService,
        private utilsService: UtilsService,
        private locationService: LocationService,
        private modalService: NgbModal,
        private formBuilder: UntypedFormBuilder) {
    }

    ngOnInit(): void {
      this.registrationForm = this.formBuilder.group({
        croppedImage: ['', [Validators.required]],
        pj_type: [0, [Validators.required, Validators.min(1)]],
        production_type: [0, [Validators.required, Validators.min(1)]],
        cnpj: ['', [Validators.required, CepCpfCnpjValidator.cnpj]],
        cnpj_central: ['', [ CepCpfCnpjValidator.cnpj ]],
        isDapGroup: new FormGroup({
          is_dap: new FormControl(true, [Validators.required])
        }),
        dap_caf_code: ['', [Validators.required]],
        dap_caf_registration_date: ['', Validators.required],
        dap_caf_expiration_date: ['', Validators.required],
        name: ['', [Validators.required]],
        acronym: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, PhoneNumberValidator.phone]],
        address_street: ['', [Validators.required]],
        address_number: ['', [Validators.required]],
        address_cep: ['', [Validators.required, CepCpfCnpjValidator.cep]],
        address_district: ['', [Validators.required]],
        address_complement: [''],
        address_state_acronym: [''],
        address_city_id: [0, [Validators.required, Validators.min(1)]],
        bank_code: ['', [Validators.required]],
        bank_name: ['', [Validators.required]],
        bank_agency: ['', [Validators.required]],
        bank_account: ['', [Validators.required]],
        legal_representative_name: ['', [Validators.required]],
        legal_representative_email: ['', [Validators.required, Validators.email]],
        legal_representative_cpf: ['', [Validators.required, CepCpfCnpjValidator.cpf]],
        legal_representative_phone: ['', [Validators.required, PhoneNumberValidator.phone]],
        legal_representative_marital_status: [0, [Validators.required, Validators.min(1)]],
        legal_representative_position: ['', [Validators.required]],
        legal_representative_position_expiration_date: [''],
        legal_representative_address_street: ['', [Validators.required]],
        legal_representative_address_number: ['', [Validators.required]],
        legal_representative_address_cep: ['', [Validators.required, CepCpfCnpjValidator.cep]],
        legal_representative_address_district: ['', [Validators.required]],
        legal_representative_address_complement: [''],
        legal_representative_address_state_acronym: [''],
        legal_representative_address_city_id: [0, [Validators.required, Validators.min(1)]],
        is_active: [true],
        confirmEmail: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
        termosOfUse: [false, [Validators.requiredTrue]]
      }, {
          validators: [ ConfirmedValidator('legal_representative_email', 'confirmEmail'), ConfirmedValidator('password', 'confirmPassword'),
          DateValidator.validateDateLowerThanToday('legal_representative_position_expiration_date', false),
          DateValidator.validateRangeDates('dap_caf_registration_date', 'dap_caf_expiration_date', 1, 2, true)
        ]
      });

      this.locationService.getStatesJSON().subscribe({
        next: (retS) => {
          this.statesList = retS;
        },
        error: (errS) => {
          console.log(errS);
        }
      });
    }

    getAddress($event: any, isCooperative: boolean) {
      const cep = onlyNumbers($event.target.value);

      this.locationService.getAddressDataFromCep(cep).subscribe({
        next: (ret) => {
          if (isCooperative) {
            this.registrationForm.patchValue({
              address_street: ret.logradouro,
              address_complement: ret.complemento,
              address_district: ret.bairro,
              address_state_acronym: ret.uf
            });
          } else {
          this.registrationForm.patchValue({
            legal_representative_address_street: ret.logradouro,
            legal_representative_address_complement: ret.complemento,
            legal_representative_address_district: ret.bairro,
            legal_representative_address_state_acronym: ret.uf
          });
          }

          this.loadCities(ret.uf, parseInt(ret.ibge), isCooperative);
        },
        error: (err) => console.log(err)
      })
    }

    getBank($event: any) {
      const code = onlyNumbers($event.target.value);
      this.loadBank(code);
    }

    imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64!;
      //this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl!);
      this.registrationForm.patchValue({ croppedImage: this.croppedImage });
    }

    loadBank(bank_code: string) {
      this.loaderService.loaderName = 'spinnerBank';
  
      this.bankService.getBankFromCode(bank_code).subscribe({
        next: (ret) => {
          this.registrationForm.patchValue({
            bank_code: bank_code,
            bank_name: ret.fullName
          });
        },
        error: (err) => console.log(err)
      });
    }

    loadCities(state_acronym: string, city_id: number, isCooperative: boolean) {
      this.loaderService.loaderName = 'spinnerAddress' + (isCooperative ? '' : 'LegalRepresentative');

      if (isCooperative)
        this.citiesList = [];
      else
        this.citiesListLegalRepresentative = [];

      this.locationService.getCitiesJSON(state_acronym).subscribe({
        next: (ret) => {
          if (isCooperative)
            this.citiesList = ret;
          else
            this.citiesListLegalRepresentative = ret;

          if (!isEmpty(city_id)) {
            if (isCooperative)
              this.registrationForm.patchValue({ address_state_acronym: state_acronym, address_city_id: city_id });
            else
            this.registrationForm.patchValue({ legal_representative_address_state_acronym: state_acronym, legal_representative_address_city_id: city_id });
          }
        },
        error: (err) => console.log(err)
      })
    }

    onFileChange(event: any): void {
      this.croppedImage = null;
      this.imageChangedEvent = event;
    }

    onSubmit() {
      this.loaderService.loaderName = null;
      this.submitted = true;

      if (this.registrationForm.invalid) {
        focusOnFormError(this.registrationForm.controls);
        return;
      }

      const cooperative = this.registrationForm.value;
      cooperative.is_dap = this.f['isDapGroup'].value.is_dap;

      cooperative.logo = this.croppedImage.replace('data:image/png;base64,', '');

      cooperative.terms_use_acceptance_ip = '0.0.0.0';

      const legal_representative_position_expiration_date = !cooperative.legal_representative_position_expiration_date ? null : cooperative.legal_representative_position_expiration_date;

      cooperative.bank = {
        account_number: cooperative.bank_account,
        agency: cooperative.bank_agency,
        code: cooperative.bank_code,
        name: textTransformCapitalize(cooperative.bank_name.trim())
      };

      cooperative.legal_representative = {
        cpf: onlyNumbers(cooperative.legal_representative_cpf),
        name: textTransformCapitalize(cooperative.legal_representative_name.trim()),
        phone: onlyNumbers(cooperative.legal_representative_phone),
        marital_status: cooperative.legal_representative_marital_status,
        position: cooperative.legal_representative_position,
        position_expiration_date: legal_representative_position_expiration_date,

        address: {
          cep: onlyNumbers(cooperative.legal_representative_address_cep),
          city_id: cooperative.legal_representative_address_city_id,
          complement: cooperative.legal_representative_address_complement ? textTransformCapitalize(cooperative.legal_representative_address_complement.trim()) : null,
          district: textTransformCapitalize(cooperative.legal_representative_address_district.trim()),
          number: cooperative.legal_representative_address_number,
          street: textTransformCapitalize(cooperative.legal_representative_address_street.trim())
        }
      };

      this.cooperativeService.add(cooperative).subscribe({
        next: (ret) => {
          if (ret && ret.sucesso) {
            this.notificationService.showSuccess(`Cadastro realizado com sucesso`, 'Sucesso!');
            this.inRegistrationMode = false;
            return;
          }

          this.notificationService.showWarning('Houve um erro ao tentar criar sua conta', 'Erro!');
          this.submitted = false;
        },
        error: (error) => {
          this.submitted = false;
          console.log(error);
        }
      });
    }

    onReset() {
      this.submitted = false;
      this.registrationForm.reset();
    }

    openTermsOfUse(content: any) {
      this.modalService.open(content, { centered: true, size: 'lg' });
    }

    get f() {
      return this.registrationForm.controls;
    }

    get dapCafName() : string {
      return this.f['isDapGroup'].value.is_dap ? 'DAP' : 'CAF';
    }

    get isDap() : boolean {
      return this.registrationForm.value.isDapGroup.is_dap;
    }
}
