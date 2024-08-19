import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { NotificationService } from 'src/app/_services/notification.service';

declare const focusOnFormError: any;

@Component({ selector: 'app-cooperative-change-request-modal', templateUrl: './change-request-modal.component.html', styleUrls: ['./change-request-modal.component.scss'] })
export class ProposalChangeRequestModalComponent implements OnInit {
    @Input() modal: any;
    @Input() public_call_id: string = '';
    @Input() cooperative_name: string = '';
    @Output() onSendMessage: EventEmitter<any> = new EventEmitter();

    public changeRequestForm!: UntypedFormGroup;
    public submitted: boolean = false;

    constructor(
        private notificationService: NotificationService,
        private formBuilder: UntypedFormBuilder
    ) {
    }

    ngOnInit(): void {
        this.changeRequestForm = this.formBuilder.group({
            title: ['', [Validators.required]],
            message: ['', [Validators.required]]
          });
    }

    onSubmit() {
      this.submitted = true;
  
      if (this.changeRequestForm.invalid) {
        focusOnFormError(this.changeRequestForm.controls);
        return;
      }
  
      const form = this.changeRequestForm.value;
      this.modal.close('Save click');
      this.onSendMessage.emit({ title: form.title, message: form.message });
    }
  
    onReset() {
      this.submitted = false;
      this.changeRequestForm.reset();
    }
  
    get f() {
      return this.changeRequestForm.controls;
    }
}