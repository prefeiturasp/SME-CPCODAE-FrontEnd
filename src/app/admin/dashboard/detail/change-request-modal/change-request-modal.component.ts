import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { NotificationService } from 'src/app/_services/notification.service';
import { AdminPublicCallService } from 'src/app/admin/public-call/public-call.service';

import { CooperativeDeliveryInfo } from 'src/app/_models/cooperative-delivery-info.model';
import { CooperativeDocument } from 'src/app/_models/cooperative-document.model';
import { PublicCallFood } from 'src/app/_models/public-call-food.model';
import { DateValidator } from 'src/app/_utils/validators/date.validator';

declare const $: any;
declare const focusOnFormError: any;
declare const sort_by: any;
declare const textTransformCapitalize: any;
@Component({ selector: 'admin-change-request-modal', templateUrl: './change-request-modal.component.html', styleUrls: ['./change-request-modal.component.scss'] })
export class AdminDashboardDetailChangeRequestModalComponent implements OnInit {
[x: string]: any;
    @Input() modal: any;
    @Input() public_call_id: string = '';
    @Input() cooperative!: CooperativeDeliveryInfo;
    @Input() food: PublicCallFood | undefined;
    @Output() onSave: EventEmitter<boolean> = new EventEmitter();

    private _documents: CooperativeDocument[] = [];
    @Input() get documents(): CooperativeDocument[] {
      return this._documents;
    }
    set documents(value: CooperativeDocument[]) {
      value = value || [];

      this._documents = value
                          .filter(d => 
                                      (!d.food_id || d.food_id === this.food!.food_id)
                                      && (d.application === 1 || d.application === 3))
                          .sort(sort_by([{ 'name': 'document_type_name' }]));
    }

    public changeRequestForm!: UntypedFormGroup;
    public submitted: boolean = false;

    constructor(
        private notificationService: NotificationService,
        private publicCallService: AdminPublicCallService,
        private formBuilder: UntypedFormBuilder
    ) {
    }

    ngOnInit(): void {
        this.changeRequestForm = this.formBuilder.group({
            title: ['', [Validators.required]],
            message: ['', [Validators.required]],
            response_date: ['', Validators.required],
            new_upload: [false]
          }, { validators: [ DateValidator.validateDateLowerThanToday('response_date', true) ] });
    }

    getRefusedDocuments(): string[] {
      let documents = $('.document:checked').map((i: number, item: any) => $(item).attr('document-id')).get();
      return documents || [];
    }

    onSubmit() {
      this.submitted = true;

      if (this.changeRequestForm.invalid) {
        focusOnFormError(this.changeRequestForm.controls);
        return;
      }

      const selectedDocuments: string[] = this.getRefusedDocuments();
      const form = this.changeRequestForm.value;
      this.publicCallService.changeRequest(this.public_call_id, this.cooperative.cooperative_id, this.food!.food_id, form.title, form.message, form.response_date,
          form.new_upload, selectedDocuments)
      .subscribe({
        next: (ret) => this.resultNext(ret, 'Solicitação enviada', 'Não foi possível enviar esta solicitação'),
        error: (err) => console.log(err)
      });
    }

    onReset() {
      this.submitted = false;
      this.changeRequestForm.reset();
    }

    resultNext(ret: any, successfulMessage: string, errorMessage: string) {
        if (ret && ret.sucesso) {
          this.notificationService.showSuccess(successfulMessage, 'Sucesso!');
          this.modal.close('Save click');
          this.onSave.emit(true);
          return;
        }

        this.notificationService.showWarning(errorMessage, 'Erro');
    }

    get f() {
      return this.changeRequestForm.controls;
    }

    get getFoodName() {
      let value = this.food?.food_name ?? '';
      value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      return value;
    }
}
