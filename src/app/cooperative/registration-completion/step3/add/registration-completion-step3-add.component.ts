import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { CooperativeService } from 'src/app/cooperative/cooperative.service';
import { LocationService } from 'src/app/_services/location.service';
import { LoaderService } from 'src/app/_services/loader.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { UtilsService } from 'src/app/_services/utils.service';

import { City, State } from 'src/app/_models/location.model';
import { Cooperative, CooperativeMember } from 'src/app/_models/cooperative.model';

import { CepCpfCnpjValidator } from 'src/app/_utils/validators/cep-cpf-cnpj.validator';

declare const focusOnFormError: any;
declare const formatDate: any;
declare const isEmpty: any;
declare const onlyNumbers: any;
declare const textTransformCapitalize: any;

@Component({ selector: 'app-cooperative-registration-completion-step3-add', templateUrl: './registration-completion-step3-add.component.html', styleUrls: ['./registration-completion-step3-add.component.scss'] })
export class CooperativeRegistrationCompletionStep3AddComponent implements OnInit {
  public registrationForm!: UntypedFormGroup;
  
  @Input() cooperative!: Cooperative;
  @Output() toggleButtons = new EventEmitter<boolean>();

  public member: CooperativeMember = new CooperativeMember();
  public memberMessage: string = '';
  public citiesList: City[] = [];
  public statesList: State[] = [];

  public submitted = false;

  constructor(
    private cooperativeService: CooperativeService,
    private locationService: LocationService,
    private loaderService: LoaderService,
    private notificationService: NotificationService,
    private utilsService: UtilsService,
    private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
      this.registrationForm = this.formBuilder.group({
        pf_type: [0, [Validators.required, Validators.min(1)]],
        production_type: [0, [Validators.required, Validators.min(1)]],
        dap_caf_code: [{ value: '', disabled: true }],
        dap_caf_registration_date: [{ value: '', disabled: true }],
        dap_caf_expiration_date: [{ value: '', disabled: true }],
        name: [{ value: '', disabled: true }],
        cpf: ['', [Validators.required, CepCpfCnpjValidator.cpf]],
        address_street: ['', [Validators.required]],
        address_number: ['', [Validators.required]],
        address_cep: ['', [Validators.required, CepCpfCnpjValidator.cep]],
        address_district: ['', [Validators.required]],
        address_complement: [''],
        address_state_acronym: [''],
        address_city_id: [0, [Validators.required, Validators.min(1)]],
        isMaleGroup: new FormGroup({
          is_male: new FormControl(true, [Validators.required])
        }),
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

  cancel() {
    this.toggleButtons.emit(false);
    this.member = new CooperativeMember();
  }

  findMember() {
    this.memberMessage = '';

    this.cooperativeService.getMemberByDapCaf(this.member.dap_caf_code).subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          this.member = Object.assign({}, ret.retorno);

          this.onReset();
          this.registrationForm.patchValue({
            dap_caf_registration_date: formatDate(this.member.dap_caf_registration_date),
            dap_caf_expiration_date: formatDate(this.member.dap_caf_expiration_date),
            name: this.member.name,
            dap_caf_code: this.member.dap_caf_code,
            is_male: true
           });

           this.toggleButtons.emit(true);
        } else {
          this.memberMessage = 'Não foi possível encontrar nenhum cooperado com esta DAP/CAF';
        }
      },
      error: (err) => { console.log(err); }
    });
  }

  getAddress($event: any) {
    const cep = onlyNumbers($event.target.value);

    this.locationService.getAddressDataFromCep(cep).subscribe({
      next: (ret) => {
        this.registrationForm.patchValue({
          address_street: ret.logradouro,
          address_complement: ret.complemento,
          address_district: ret.bairro,
          address_state_acronym: ret.uf
        });

        this.loadCities(ret.uf, parseInt(ret.ibge));
      },
      error: (err) => console.log(err)
    })
  }

  loadCities(state_acronym: string, city_id: number) {
    this.loaderService.loaderName = 'spinnerCities';

    this.citiesList = [];

    this.locationService.getCitiesJSON(state_acronym).subscribe({
      next: (ret) => {
        this.citiesList = ret;

        if (!isEmpty(city_id))
            this.registrationForm.patchValue({ address_state_acronym: state_acronym, address_city_id: city_id });
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  saveMember() {
    this.loaderService.loaderName = null;
    this.submitted = true;

    if (this.registrationForm.invalid) {
      focusOnFormError(this.registrationForm.controls);
      return;
    }

    const newMember = Object.assign(this.member, this.registrationForm.value);
    newMember.cooperative_id = this.cooperative.id;
    newMember.dap_caf_code = this.member.dap_caf_code;
    newMember.is_dap = this.member.is_dap;
    newMember.is_male = this.registrationForm.value.isMaleGroup.is_male;
    newMember.is_active = true;

    newMember.address = {
      cep: onlyNumbers(newMember.address_cep),
      city_id: newMember.address_city_id,
      complement: newMember.address_complement ? textTransformCapitalize(newMember.address_complement.trim()) : null,
      district: textTransformCapitalize(newMember.address_district.trim()),
      number: newMember.address_number,
      street: textTransformCapitalize(newMember.address_street.trim())
    };

    this.cooperativeService.addMember(newMember).subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          const member = Object.assign({}, ret.retorno);

          if (!this.cooperative.members)
            this.cooperative.members = [];
  
          this.cooperative.members.push(member);
  
          this.notificationService.showSuccess('Cooperado adicionado com sucesso', 'Sucesso!');
        } else {
          this.memberMessage = ret.mensagens[0];
        }
        
        this.member = new CooperativeMember();
      },
      error: (err) => { console.log(err); }
    });
  }
  
  onReset() {
    this.submitted = false;
    this.registrationForm.reset();

    this.registrationForm.patchValue({
      pf_type: 0,
      production_type: 0,
      state_acronym: '',
      city_id: 0,
      isMaleGroup: { is_male: true }
    });
  }

  get f() {
    return this.registrationForm.controls;
  }

  get dapCafName() : string {
    return this.member.is_dap ? 'DAP' : 'CAF';
  }
}