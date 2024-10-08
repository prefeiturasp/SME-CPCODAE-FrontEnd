import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

import { AdminCooperativeService } from '../cooperative.service';
import { BankService } from 'src/app/_services/bank.service';
import { LocationService } from 'src/app/_services/location.service';
import { LoaderService } from 'src/app/_services/loader.service';
import { MenuService } from 'src/app/navigation/menu/menu.service';
import { NotificationService } from 'src/app/_services/notification.service';

import { MaritalStatusEnum } from 'src/app/_enums/marital-status.enum';

import { Cooperative } from 'src/app/_models/cooperative.model';
import { City, State } from 'src/app/_models/location.model';
import { CepCpfCnpjValidator } from 'src/app/_utils/validators/cep-cpf-cnpj.validator';
import { DateValidator } from 'src/app/_utils/validators/date.validator';
import { PhoneNumberValidator } from 'src/app/_utils/validators/phone-number.validator';

declare const focusOnFormError: any;
declare const formatDate: any;
declare const isEmpty: any;
declare const onlyNumbers: any;
declare const textTransformCapitalize: any;

@Component({ selector: 'admin-cooperative-registration', templateUrl: './cooperative-registration.component.html', styleUrls: ['./cooperative-registration.component.scss'] })
export class AdminCooperativeRegistrationComponent implements OnInit {
  @ViewChild(ImageCropperComponent) imageCropper!: ImageCropperComponent;
  public cooperativeForm!: UntypedFormGroup;

  public cooperative!: Cooperative;
  public unmodified!: Cooperative;
  public isAdd: boolean = false;
  public submitted: boolean = false;

  public MaritalStatusEnum: any = MaritalStatusEnum;
  
  public citiesList: City[] = [];
  public citiesListLegalRepresentative: City[] = [];
  public statesList: State[] = [];

  public imageChangedEvent: any = '';
  public croppedImage: any = '';

  constructor(
    private bankService: BankService,
    private cooperativeService: AdminCooperativeService,
    private locationService: LocationService,
    private loaderService: LoaderService,
    private menuService: MenuService,
    private notificationService: NotificationService,
    private sanitizer: DomSanitizer,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {
    this.menuService.showSearchFilter = false;
    const id = this.route.snapshot.paramMap.get('id') ?? '';

    this.isAdd = (isEmpty(id) || id.toLowerCase() === 'novo');

    this.cooperativeForm = this.formBuilder.group({
      croppedImage: ['', [Validators.required]],
      pj_type: ['', [Validators.required, Validators.min(1)]],
      production_type: ['', [Validators.required, Validators.min(1)]],
      cnpj: ['', [Validators.required, CepCpfCnpjValidator.cnpj]],
      cnpj_central: ['', [ CepCpfCnpjValidator.cnpj ]],
      isDapGroup: new FormGroup({ is_dap: new FormControl(true, [Validators.required]) }),
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
      is_active: [true]
    }, { 
      validators: [
        // ConditionalRequiredValidator('pj_type', '==', '3', 'cnpj_central'),
        DateValidator.validateRangeDates('dap_caf_registration_date', 'dap_caf_expiration_date', 1, 2, true),
        DateValidator.validateDateLowerThanToday('legal_representative_position_expiration_date', false)
      ],
    });

    if (this.isAdd) {
      this.cooperative = new Cooperative();
      this.unmodified = Object.assign({}, this.cooperative);
    } else {
      this.cooperativeService.get(id).subscribe({
        next: (ret) => {
          if (ret && ret.sucesso) {
            this.cooperative = ret.retorno;
            this.unmodified = Object.assign({}, this.cooperative);

            this.cooperativeForm.patchValue({
              cnpj: this.cooperative.cnpj,
              cnpj_central: this.cooperative.cnpj_central,
              isDapGroup: { is_dap: this.cooperative.is_dap },
              is_active: this.cooperative.is_active,
              dap_caf_code: this.cooperative.dap_caf_code,
              dap_caf_registration_date: new Date(this.cooperative.dap_caf_registration_date) < new Date(2010, 0, 1) ? null : formatDate(this.cooperative.dap_caf_registration_date),
              dap_caf_expiration_date: new Date(this.cooperative.dap_caf_registration_date) < new Date(2010, 0, 1) ? null : formatDate(this.cooperative.dap_caf_expiration_date),
              name: this.cooperative.name,
              croppedImage: this.cooperative.logo,
              acronym: this.cooperative.acronym,
              email: this.cooperative.email,
              phone: this.cooperative.phone,
              pj_type: this.cooperative.pj_type,
              production_type: this.cooperative.production_type,
              address_street: this.cooperative.address.street,
              address_number: this.cooperative.address.number,
              address_cep: this.cooperative.address.cep,
              address_district: this.cooperative.address.district,
              address_complement: this.cooperative.address.complement,
              bank_account: this.cooperative.bank?.account_number,
              bank_agency: this.cooperative.bank?.agency,
              bank_code: this.cooperative.bank?.code,
              bank_name: this.cooperative.bank?.name,
              legal_representative_name: this.cooperative.legal_representative?.name,
              legal_representative_cpf: this.cooperative.legal_representative?.cpf,
              legal_representative_phone: this.cooperative.legal_representative?.phone,
              legal_representative_marital_status: this.cooperative.legal_representative?.marital_status,
              legal_representative_position: this.cooperative.legal_representative?.position,
              legal_representative_position_expiration_date: !this.cooperative.legal_representative?.position_expiration_date || new Date(this.cooperative.legal_representative?.position_expiration_date) < new Date(2010, 0, 1) ? null : formatDate(this.cooperative.legal_representative?.position_expiration_date),
              legal_representative_address_street: this.cooperative.legal_representative?.address?.street,
              legal_representative_address_number: this.cooperative.legal_representative?.address?.number,
              legal_representative_address_cep: this.cooperative.legal_representative?.address?.cep,
              legal_representative_address_district: this.cooperative.legal_representative?.address?.district,
              legal_representative_address_complement: this.cooperative.legal_representative?.address?.complement
            });

            this.croppedImage = `data:image/png;base64,${this.cooperative.logo}`;
            
            this.locationService.getStatesJSON().subscribe({
              next: (retS) => {
                this.statesList = retS;
  
                if (this.cooperative.address.city_id) {
                  this.locationService.getCityById(this.cooperative.address.city_id).subscribe({
                    next: (retC) => {
                      this.loadCities(retC.state_acronym, this.cooperative.address.city_id!, true);
                    }
                  })
                }
  
                if (this.cooperative.legal_representative?.address?.city_id) {
                  this.locationService.getCityById(this.cooperative.legal_representative.address.city_id).subscribe({
                    next: (retC) => {
                      this.loadCities(retC.state_acronym, this.cooperative.legal_representative.address.city_id!, false);
                    }
                  })
                }
              },
              error: (errS) => {
                console.log(errS);
              }
            });
          }
        },
        error: (err) => console.log(err)
      });
    }
  }

  getAddress($event: any, isCooperative: boolean) {
    const cep = onlyNumbers($event.target.value);

    this.locationService.getAddressDataFromCep(cep).subscribe({
      next: (ret) => {
        if (isCooperative) {
          this.cooperativeForm.patchValue({
            address_street: ret.logradouro,
            address_complement: ret.complemento,
            address_district: ret.bairro,
            address_state_acronym: ret.uf
          });
        } else {
        this.cooperativeForm.patchValue({
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

  async goBack() {
    if (!this.isChanged() || !(await this.notificationService.showConfirm('Existem alterações não salvas. Caso continue você irá perder estas informações. Deseja continuar?')))
      this.router.navigate(['/admin/cooperativa']);
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64!;
    //this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl!);
    this.cooperativeForm.patchValue({ croppedImage: this.croppedImage });
  }

  isChanged() : boolean {
    return this.cooperative.id !== this.unmodified.id
    || this.cooperative.acronym !== this.unmodified.acronym
      || this.cooperative.address.street !== this.unmodified.address.street
      || this.cooperative.address.cep !== this.unmodified.address.cep
      || this.cooperative.address.city_id !== this.unmodified.address.city_id
      || this.cooperative.address.complement !== this.unmodified.address.complement
      || this.cooperative.address.district !== this.unmodified.address.district
      || this.cooperative.address.number !== this.unmodified.address.number
      || this.cooperative.cnpj !== this.unmodified.cnpj
      || this.cooperative.cnpj_central !== this.unmodified.cnpj_central
      || this.cooperative.dap_caf_code !== this.unmodified.dap_caf_code
      || this.cooperative.email !== this.unmodified.email
      || this.cooperative.name !== this.unmodified.name
      || this.cooperative.phone !== this.unmodified.phone
      || this.cooperative.pj_type !== this.unmodified.pj_type
      || this.cooperative.production_type !== this.unmodified.production_type
      || this.cooperative.dap_caf_registration_date?.toString().slice(0, 10) !== this.unmodified!.dap_caf_registration_date?.toString().slice(0, 10)
      || this.cooperative.dap_caf_expiration_date?.toString().slice(0, 10) !== this.unmodified!.dap_caf_expiration_date?.toString().slice(0, 10)
      || this.cooperative.legal_representative.cpf !== this.unmodified.legal_representative.cpf
      || this.cooperative.legal_representative.name !== this.unmodified.legal_representative.name
      || this.cooperative.legal_representative.address.street !== this.unmodified.legal_representative.address.street
      || this.cooperative.legal_representative.address.cep !== this.unmodified.legal_representative.address.cep
      || this.cooperative.legal_representative.address.city_id !== this.unmodified.legal_representative.address.city_id
      || this.cooperative.legal_representative.address.complement !== this.unmodified.legal_representative.address.complement
      || this.cooperative.legal_representative.address.district !== this.unmodified.legal_representative.address.district
      || this.cooperative.legal_representative.address.number !== this.unmodified.legal_representative.address.number;
  }

  loadBank(bank_code: string) {
    this.loaderService.loaderName = 'spinnerBank';

    this.bankService.getBankFromCode(bank_code).subscribe({
      next: (ret) => {
        this.cooperativeForm.patchValue({
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
            this.cooperativeForm.patchValue({ address_state_acronym: state_acronym, address_city_id: city_id });
          else
          this.cooperativeForm.patchValue({ legal_representative_address_state_acronym: state_acronym, legal_representative_address_city_id: city_id });
        }
      },
      error: (err) => console.log(err)
    })
  }

  resultNext(ret: any, successfulMessage: string, errorMessage: string) {
    if (ret && ret.sucesso) {
      this.notificationService.showSuccess(successfulMessage, 'Sucesso!');
      this.unmodified = Object.assign({}, this.cooperative);
      this.goBack();
      return;
    }

    this.notificationService.showWarning(errorMessage, 'Erro');
  }

  onFileChange(event: any): void {
    this.croppedImage = null;
    this.imageChangedEvent = event;
  }

  onSubmit() {
    this.loaderService.loaderName = null;
    this.submitted = true;

    if (this.cooperativeForm.invalid) {
      focusOnFormError(this.cooperativeForm.controls);
      return;
    }

    const cooperative = Object.assign(this.unmodified, this.cooperativeForm.value);

    cooperative.logo = this.croppedImage.replace('data:image/png;base64,', '');

    if (cooperative.acronym.trim().length > 0)
      cooperative.acronym = cooperative.acronym.trim().toUpperCase();

    if (cooperative.email.trim().length > 0)
      cooperative.email = cooperative.email.trim().toLowerCase();

    if (cooperative.name.trim().length > 0)
      cooperative.name = textTransformCapitalize(cooperative.name.trim());

    cooperative.address = {
      cep: onlyNumbers(cooperative.address_cep),
      city_id: cooperative.address_city_id,
      complement: cooperative.address_complement ? textTransformCapitalize(cooperative.address_complement.trim()) : null,
      district: textTransformCapitalize(cooperative.address_district.trim()),
      number: cooperative.address_number,
      street: textTransformCapitalize(cooperative.address_street.trim())
    };

    cooperative.bank = {
      account_number: cooperative.bank_account,
      agency: cooperative.bank_agency,
      code: cooperative.bank_code,
      name: textTransformCapitalize(cooperative.bank_name.trim())
    };

    const legal_representative_position_expiration_date = !cooperative.legal_representative_position_expiration_date ? null : cooperative.legal_representative_position_expiration_date;

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
    
    cooperative.cnpj = onlyNumbers(this.unmodified.cnpj);
    cooperative.is_dap = cooperative.isDapGroup.is_dap;
    cooperative.dap_caf_code = this.unmodified.dap_caf_code;

    if (this.isAdd) {
      this.cooperativeService.add(this.cooperative).subscribe({
        next: (ret) => this.resultNext(ret, 'Cooperativa criada', 'Não foi possível criar esta cooperativa'),
        error: (err) => console.log(err)
      });
    } else {
      this.cooperativeService.update(cooperative).subscribe({
        next: (ret) => this.resultNext(ret, 'Cooperativa alterada', 'Não foi possível alterar esta cooperativa'),
        error: (err) => console.log(err)
      });
    }
  }

  onReset() {
    this.submitted = false;
    this.cooperativeForm.reset();
  }

  get f() {
    return this.cooperativeForm.controls;
  }

  get dapCafName() : string {
    return this.f['is_dap'].value ? 'DAP' : 'CAF';
  }

  get isDap() : boolean {
    return this.cooperativeForm.value.isDapGroup.is_dap;
  }
}
