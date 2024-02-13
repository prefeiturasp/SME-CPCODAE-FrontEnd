import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { CooperativeFaleConoscoService } from './fale-conosco.service';
import { NotificationService } from 'src/app/_services/notification.service';

declare const focusOnFormError: any;

@Component({ selector: 'app-fale-conosco', templateUrl: './fale-conosco.component.html', styleUrls: ['./fale-conosco.component.scss'] })
export class CooperativeFaleConoscoComponent implements OnInit {
    public faleConoscoForm!: UntypedFormGroup;
    public submitted: boolean = false;

    constructor(
        private notificationService: NotificationService,
        private faleConoscoService: CooperativeFaleConoscoService,
        private formBuilder: UntypedFormBuilder
    ) { }

    ngOnInit(): void {
        this.faleConoscoForm = this.formBuilder.group({
            title: ['', [Validators.required]],
            message: ['', [Validators.required]]
          });
    }

    onSubmit() {
      this.submitted = true;

      if (this.faleConoscoForm.invalid) {
        focusOnFormError(this.faleConoscoForm.controls);
        return;
      }

      const form = this.faleConoscoForm.value;
      this.faleConoscoService.send(form.title, form.message)
      .subscribe({
        next: (ret) => this.resultNext(ret, 'Mensagem enviada', 'Não foi possível enviar esta mensagem'),
        error: (err) => console.log(err)
      });
    }

    onReset() {
      this.submitted = false;
      this.faleConoscoForm.reset();
    }

    resultNext(ret: any, successfulMessage: string, errorMessage: string) {
        if (ret && ret.sucesso) {
          this.notificationService.showSuccess(successfulMessage, 'Sucesso!');
          this.onReset();
          return;
        }

        this.notificationService.showWarning(errorMessage, 'Erro');
    }

    get f() {
      return this.faleConoscoForm.controls;
    }
}
