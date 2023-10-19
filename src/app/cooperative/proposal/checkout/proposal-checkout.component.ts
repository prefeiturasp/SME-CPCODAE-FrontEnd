import { Component, HostListener, Input, OnDestroy } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { City, State } from 'src/app/_models/location.model';
import { MemberInfo } from 'src/app/_models/public-call-answer.model';
import { LoaderService } from 'src/app/_services/loader.service';
import { LocationService } from 'src/app/_services/location.service';

import { AdminPublicCallService } from 'src/app/admin/public-call/public-call.service';

declare const focusOnFormError: any;
declare const isEmpty: any;

@Component({ selector: 'app-proposal-checkout', templateUrl: './proposal-checkout.component.html', styleUrls: ['./proposal-checkout.component.scss'] })
export class CooperativeProposalCheckoutComponent implements OnDestroy {
  public selectedFoods: any[] | undefined = [];

  @Input() statesList: State[] = [];

  @Input() get filteredFoods(): any[] | undefined {
    return this.selectedFoods;
  }
  set filteredFoods(value: any[] | undefined) {
    this.selectedFoods = value;
  }

  public proposalForm: UntypedFormGroup | undefined;
  public submitted: boolean = false;
  public citiesList: City[] = [];

  constructor(
      public publicCallService: AdminPublicCallService,
      private loaderService: LoaderService,
      private locationService: LocationService,
      private formBuilder: UntypedFormBuilder,
  ) {
    this.buildForm();
  }

  ngOnDestroy(): void {
    const memberInfo: MemberInfo = this.proposalForm!.value;
    localStorage.setItem('memberInfo', JSON.stringify(memberInfo));
  }

  buildForm() {
    this.proposalForm = this.formBuilder.group({
      city_id: [0, [Validators.required, Validators.min(1)]],
      state_acronym: ['SP'],
      city_members_total: ['', [Validators.required, this.maxTotalCityValidator()]],
      daps_fisicas_total: ['', [Validators.required, this.maxTotalDapsValidator()]],
      pnra_settlement_total: ['', [Validators.required]],
      indigenous_community_total: ['', [Validators.required]],
      quilombola_community_total: ['', [Validators.required]],
      other_family_agro_total: ['', [Validators.required]],
      total: ['', [Validators.required, this.sumValidator()]]
      // total: ['', [Validators.required]]
    });

    const memberInfo: MemberInfo = JSON.parse(localStorage.getItem('memberInfo') ?? '{}');

    if (memberInfo) {
      this.proposalForm.patchValue(memberInfo);
    }

    this.loadCities(this.f!['state_acronym'].value, this.f!['city_id'].value);
  }

  loadCities(state_acronym: string, city_id: number) {
    this.loaderService.loaderName = 'spinnerAddress';
    this.citiesList = [];

    this.locationService.getCitiesJSON(state_acronym).subscribe({
      next: (ret) => {
        this.citiesList = ret;

        if (!isEmpty(city_id)) {
            this.proposalForm!.patchValue({ state_acronym: state_acronym, city_id: city_id });
        }
      },
      error: (err) => console.log(err)
    })
  }

  public setCityId($event: any) {
    this.proposalForm?.patchValue({ city_id: $event.id });
  }

  maxTotalCityValidator() {
    return (formGroup: FormGroup) => {
      const fieldTotal = this.proposalForm?.value['total'];
      const fieldCity = formGroup.value;

      const totalCity = parseInt(fieldCity || 0);
      const total = parseInt(fieldTotal || 0);

      return totalCity <= total ? null : { invalidTotalCity: true };
    };
  }

  maxTotalDapsValidator() {
    return (formGroup: FormGroup) => {
      const fieldTotal = this.proposalForm?.value['total'];
      const fieldDaps = formGroup.value;

      const totalDaps = parseInt(fieldDaps || 0);
      const total = parseInt(fieldTotal || 0);

      return totalDaps <= total ? null : { invalidTotalDap: true };
    };
  }

  sumValidator() {
    return (formGroup: FormGroup) => {
      const fieldPnra = this.proposalForm?.value['pnra_settlement_total'];
      const fieldIndigenous = this.proposalForm?.value['indigenous_community_total'];
      const fieldQuilombola = this.proposalForm?.value['quilombola_community_total'];
      const fieldOther = this.proposalForm?.value['other_family_agro_total'];
      const fieldTotal = formGroup.value;

      if (!fieldPnra || !fieldIndigenous || !fieldQuilombola || !fieldOther || !fieldTotal)
        return null;

      const result = parseInt(fieldPnra) + parseInt(fieldIndigenous) + parseInt(fieldQuilombola) + parseInt(fieldOther);

      return result == parseInt(fieldTotal) ? null : { invalidSum: true };
    };
  }

  validate() : boolean {
    this.submitted = true;
    this.proposalForm!.get('total')!.updateValueAndValidity();
    this.proposalForm!.get('city_members_total')!.updateValueAndValidity();
    this.proposalForm!.get('daps_fisicas_total')!.updateValueAndValidity();

    if (this.proposalForm?.invalid) {
      focusOnFormError(this.proposalForm.controls);
      return false;
    }

    return true;
  }

  get f() {
    return this.proposalForm?.controls;
  }
}
