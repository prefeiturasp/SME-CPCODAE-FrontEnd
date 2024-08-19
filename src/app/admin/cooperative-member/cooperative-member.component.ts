import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { City, State } from 'src/app/_models/location.model';
import { Cooperative, CooperativeMember } from 'src/app/_models/cooperative.model';

import { AdminCooperativeService } from '../cooperative/cooperative.service';
import { AdminCooperativeMemberService } from './cooperative-member.service';
import { LoaderService } from 'src/app/_services/loader.service';
import { LocationService } from 'src/app/_services/location.service';
import { MenuService } from 'src/app/navigation/menu/menu.service';
import { NotificationService } from 'src/app/_services/notification.service';

import { CepCpfCnpjValidator } from 'src/app/_utils/validators/cep-cpf-cnpj.validator';

declare const formatDate: any;
declare const isEmpty: any;
declare const onlyNumbers: any;
declare const textTransformCapitalize: any;

@Component({ selector: 'admin-cooperative-member', templateUrl: './cooperative-member.component.html', styleUrls: ['./cooperative-member.component.scss'] })
export class AdminCooperativeMemberComponent implements OnInit {
  public cooperativeMemberForm!: UntypedFormGroup;

  public cooperativeMember!: CooperativeMember | null;
  public unmodified!: CooperativeMember | null;
  public cooperatives: Cooperative[] = [];
  public isAdd: boolean = true;
  public isOnEditMode: boolean = false;
  public selectedMemberInfo: string = '';
  public submitted: boolean = false;

  public citiesList: City[] = [];
  public statesList: State[] = [];

  constructor(
    private cooperativeService: AdminCooperativeService,
    private cooperativeMemberService: AdminCooperativeMemberService,
    private loaderService: LoaderService,
    private locationService: LocationService,
    private menuService: MenuService,
    private notificationService: NotificationService,
    private formBuilder: UntypedFormBuilder
  ) {
    this.menuService.showSearchFilter = false;
  }

  ngOnInit(): void {
    this.cooperativeMemberForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      cpf: ['', [Validators.required, CepCpfCnpjValidator.cpf]],
      dap_caf_code: ['', [Validators.required]],
      dap_caf_registration_date: ['', Validators.required],
      dap_caf_expiration_date: ['', Validators.required],
      cooperative_id: [''],
      pf_type: [0, [Validators.required, Validators.min(1)]],
      production_type: [0, [Validators.required, Validators.min(1)]],
      address_street: ['', [Validators.required]],
      address_number: ['', [Validators.required]],
      address_cep: ['', [Validators.required, CepCpfCnpjValidator.cep]],
      address_district: ['', [Validators.required]],
      address_complement: [''],
      address_state_acronym: [''],
      address_city_id: [0, [Validators.required, Validators.min(1)]],
      isDapGroup: new FormGroup({
        is_dap: new FormControl(true, [Validators.required])
      }),
      isMaleGroup: new FormGroup({
        is_male: new FormControl(true, [Validators.required])
      }),
      is_active: [true]
    });

    this.cooperativeService.getAll().subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          this.cooperatives = ret.retorno;
        }
      },
      error: (err) => console.log(err)
    });

    this.locationService.getStatesJSON().subscribe({
      next: (retS) => this.statesList = retS,
      error: (errS) => console.log(errS)
    });
  }

  add() {
    this.onReset();
    this.isAdd = true;
    this.isOnEditMode = true;
    this.cooperativeMember = null;
    this.selectedMemberInfo = '';
    this.cooperativeMemberForm.patchValue( {
      address_state_acronym: '',
      address_city_id: 0,
      isDapGroup: { is_dap: true }, 
      isMaleGroup: { is_male: true },
      is_active: true,
      pf_type: 0,
      production_type: 0
    } );
    this.unmodified = null;
  }

  checkFormIsInValid() : boolean {
    const cooperativeMemberForm = this.cooperativeMemberForm.value;
    const cooperative_id = cooperativeMemberForm.cooperative_id

    if (this.hasCooperative)
      return this.cooperativeMemberForm.invalid;

    return this.cooperativeMemberForm.controls['name'].invalid
      || this.cooperativeMemberForm.controls['dap_caf_code'].invalid
      || this.cooperativeMemberForm.controls['dap_caf_registration_date'].invalid
      || this.cooperativeMemberForm.controls['dap_caf_expiration_date'].invalid;
  }

  getAddress($event: any) {
    const cep = onlyNumbers($event.target.value);

    this.locationService.getAddressDataFromCep(cep).subscribe({
      next: (ret) => {
        this.cooperativeMemberForm.patchValue({
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

  async getCooperativeMember() {
    if (!this.isChanged() || !(await this.notificationService.showConfirm('Existem alterações não salvas. Caso continue você irá perder estas informações. Deseja continuar?')))
      return;

    this.onReset();

    if (isEmpty(this.selectedMemberInfo) || this.selectedMemberInfo.length < 3) {
      this.notificationService.showWarning('Digite ao menos 3 caracteres antes de pesquisar', 'Erro!');
      return;
    }

    this.isAdd = true;

    this.cooperativeMemberService.getByDapCafCPF(this.selectedMemberInfo).subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          const member = ret.retorno;
          this.cooperativeMember = member;
          this.unmodified = Object.assign({}, member);

          this.cooperativeMemberForm.patchValue({
            name: member.name,
            cpf: member.cpf,
            dap_caf_code: member.dap_caf_code,
            cooperative_id: member.cooperative_id,
            pf_type: member.pf_type,
            production_type: member.production_type,
            dap_caf_registration_date: formatDate(member.dap_caf_registration_date),
            dap_caf_expiration_date: formatDate(member.dap_caf_expiration_date),
            isDapGroup: { is_dap: member.is_dap },
            isMaleGroup: { is_male: member.is_male },
            is_active: member.is_active
          });

          this.loadLocationData(member);

          this.isAdd = false;
          this.isOnEditMode = true;
          return;
        }
        
        this.cooperativeMember = null;
        this.notificationService.showWarning('Não foi possível encontrar nenhum cooperado com esta DAP', 'Erro!');
      },
      error: (err) => console.log(err)
    });
  }

  goBack() {
    this.onReset();
    this.isAdd = true;
    this.isOnEditMode = false;
    this.cooperativeMember = null;
    this.unmodified = null;
  }

  isChanged() : boolean {
    const cooperativeMemberForm = this.cooperativeMemberForm.value;

    if (!this.cooperativeMember)
      return false;

    const cooperative_id = cooperativeMemberForm.cooperative_id == '0' ? null : cooperativeMemberForm.cooperative_id;

    return cooperativeMemberForm.name !== this.unmodified!.name
      || cooperativeMemberForm.dap_caf_code !== this.unmodified!.dap_caf_code
      || cooperative_id !== this.unmodified!.cooperative_id
      || cooperativeMemberForm.dap_caf_registration_date !== new Date(this.unmodified!.dap_caf_registration_date).toISOString().slice(0, 10)
      || cooperativeMemberForm.dap_caf_expiration_date !== new Date(this.unmodified!.dap_caf_expiration_date).toISOString().slice(0, 10)
      || cooperativeMemberForm.address_street !== this.unmodified!.address.street
      || cooperativeMemberForm.address_cep !== this.unmodified!.address.cep
      || cooperativeMemberForm.address_city_id !== this.unmodified!.address.city_id
      || cooperativeMemberForm.address_complement !== this.unmodified!.address.complement
      || cooperativeMemberForm.address_district !== this.unmodified!.address.district
      || cooperativeMemberForm.address_number !== this.unmodified!.address.number
      || cooperativeMemberForm.cpf !== this.unmodified!.cpf
      || cooperativeMemberForm.pf_type !== this.unmodified!.pf_type
      || cooperativeMemberForm.production_type !== this.unmodified!.production_type
      || cooperativeMemberForm.isDapGroup.is_dap !== this.unmodified!.is_dap
      || cooperativeMemberForm.isMaleGroup.is_male !== this.unmodified!.is_male
      || cooperativeMemberForm.is_active !== this.unmodified!.is_active;
  }

  loadCities(state_acronym: string, city_id: number) {
    this.loaderService.loaderName = 'spinnerAddress';
    this.citiesList = [];

    this.locationService.getCitiesJSON(state_acronym).subscribe({
      next: (ret) => {
        this.citiesList = ret;

        if (!isEmpty(city_id)) {
          this.cooperativeMemberForm.patchValue({ address_state_acronym: state_acronym, address_city_id: city_id });
        }
      },
      error: (err) => console.log(err)
    })
  }

  loadLocationData(member: CooperativeMember) {
    const city_id = member.address.city_id;
        
    this.cooperativeMemberForm.patchValue({ 
      address_street: member.address.street,
      address_number: member.address.number,
      address_cep: member.address.cep,
      address_district: member.address.district,
      address_complement: member.address.complement
    });

    if (city_id) {
      this.locationService.getCityById(city_id).subscribe({
        next: (retC) => this.loadCities(retC.state_acronym, city_id!)
      })
    }
  }

  onSubmit() {
    this.loaderService.loaderName = null;
    this.submitted = true;

    if (this.checkFormIsInValid()) {
      return;
    }

    const cooperativeMemberForm = this.cooperativeMemberForm.value;
    const member = Object.assign({}, this.cooperativeMember);
 
    member.name = textTransformCapitalize(cooperativeMemberForm.name.trim());
    member.dap_caf_code = cooperativeMemberForm.dap_caf_code.trim().toUpperCase();
    member.cooperative_id = !cooperativeMemberForm.cooperative_id || cooperativeMemberForm.cooperative_id == '0' ? null : cooperativeMemberForm.cooperative_id;
    member.dap_caf_registration_date = cooperativeMemberForm.dap_caf_registration_date;
    member.dap_caf_expiration_date = cooperativeMemberForm.dap_caf_expiration_date;
    member.is_dap = cooperativeMemberForm.isDapGroup.is_dap;

    if (this.hasCooperative) {
      member.cpf = onlyNumbers(cooperativeMemberForm.cpf);
      member.pf_type = cooperativeMemberForm.pf_type;
      member.production_type = cooperativeMemberForm.production_type;
      member.is_male = cooperativeMemberForm.isMaleGroup.is_male;
      member.is_active = cooperativeMemberForm.is_active;
  
      member.address = {
        cep: onlyNumbers(cooperativeMemberForm.address_cep),
        city_id: cooperativeMemberForm.address_city_id,
        complement: cooperativeMemberForm.address_complement ? textTransformCapitalize(cooperativeMemberForm.address_complement.trim()) : null,
        district: textTransformCapitalize(cooperativeMemberForm.address_district.trim()),
        number: cooperativeMemberForm.address_number,
        street: textTransformCapitalize(cooperativeMemberForm.address_street.trim())
      };
    }
    
    if (this.isAdd) {
      this.cooperativeMemberService.add(member).subscribe({
        next: (ret) => this.resultNext(ret, 'Cooperado criado', 'Não foi possível criar este cooperado'),
        error: (err) => console.log(err)
      });
    } else {
      this.cooperativeMemberService.update(member).subscribe({
        next: (ret) => this.resultNext(ret, 'Cooperado alterado', 'Não foi possível alterar este cooperado'),
        error: (err) => console.log(err)
      });
    }
  }

  onReset() {
    this.submitted = false;
    this.cooperativeMemberForm.reset();
  }

  resultNext(ret: any, successfulMessage: string, errorMessage: string) {
    if (ret && ret.sucesso) {
      this.isOnEditMode = false;
      this.cooperativeMember = null;
      this.unmodified = null;
      this.notificationService.showSuccess(successfulMessage, 'Sucesso!');
      return;
    }

    this.notificationService.showWarning(errorMessage, 'Erro');
  }

  get f() {
    return this.cooperativeMemberForm.controls;
  }

  get isDap() : boolean {
    return this.cooperativeMemberForm.value.isDapGroup.is_dap;
  }

  get hasCooperative(): boolean {
    return !isEmpty(this.cooperativeMemberForm.value.cooperative_id) && this.cooperativeMemberForm.value.cooperative_id.length > 1;
  }
}
