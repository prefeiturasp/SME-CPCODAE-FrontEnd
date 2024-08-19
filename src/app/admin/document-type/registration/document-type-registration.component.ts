import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { AdminDocumentTypeService } from '../document-type.service';
import { MenuService } from 'src/app/navigation/menu/menu.service';
import { NotificationService } from 'src/app/_services/notification.service';

import { SMEDocumentType } from 'src/app/_models/document-type.model';
import { RequireCheckboxesToBeCheckedValidator } from 'src/app/_utils/validators/require-checkboxes-to-be-checked.validator';

declare const isEmpty: any;

@Component({ selector: 'admin-document-type-registration', templateUrl: './document-type-registration.component.html', styleUrls: ['./document-type-registration.component.scss'] })
export class AdminDocumentTypeRegistrationComponent implements OnInit {
  public documentTypeForm: UntypedFormGroup;

  public document: SMEDocumentType;
  public unmodified: SMEDocumentType;
  public isAdd: boolean = false;
  public submitted: boolean = false;

  constructor(
    private documentTypeService: AdminDocumentTypeService,
    private menuService: MenuService,
    private notificationService: NotificationService,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {
    this.menuService.showSearchFilter = false;
    const id = this.route.snapshot.paramMap.get('id') ?? '';

    this.isAdd = (isEmpty(id) || id.toLowerCase() === 'novo');

    this.documentTypeForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      applicationGroup: new FormGroup({
        applicationProposal: new FormControl(false),
        applicationCooperativeRegistration: new FormControl(false)
      }, RequireCheckboxesToBeCheckedValidator()),
      isActive: [true]
    });

    if (this.isAdd) {
      this.document = new SMEDocumentType();
      this.unmodified = Object.assign({}, this.document);
    } else {
      this.documentTypeService.get(id).subscribe({
        next: (ret) => {
          if (ret && ret.sucesso) {
            this.document = ret.retorno;
            this.unmodified = Object.assign({}, this.document);

            const appProposal: boolean = this.document.application === 1 || this.document.application === 3;
            const appCooperative: boolean = this.document.application === 2 || this.document.application === 3;

            this.documentTypeForm.patchValue({
              name: this.document.name,
              applicationGroup: {
                applicationProposal: appProposal,
                applicationCooperativeRegistration: appCooperative
              },              
              isActive: this.document.is_active
            });
          }
        },
        error: (err) => console.log(err)
      });
    }
  }

  async goBack() {
    if (!this.isChanged() || !(await this.notificationService.showConfirm('Existem alterações não salvas. Caso continue você irá perder estas informações. Deseja continuar?')))
      this.router.navigate(['/admin/tipo-documento']);
  }

  isChanged() : boolean {
    return this.document.id !== this.unmodified.id
      || this.document.name !== this.unmodified.name
      || this.document.application !== this.unmodified.application
      || this.document.is_active !== this.unmodified.is_active;
  }

  resultNext(ret: any, successfulMessage: string, errorMessage: string) {
    if (ret && ret.sucesso) {
      this.notificationService.showSuccess(successfulMessage, 'Sucesso!');
      this.unmodified = Object.assign({}, this.document);
      this.goBack();
      return;
    }

    this.notificationService.showWarning(errorMessage, 'Erro');
  }

  setFormBuilder() {
    const appProposal: boolean = this.document.application === 1 || this.document.application === 3;
    const appCooperative: boolean = this.document.application === 2 || this.document.application === 3;

    this.documentTypeForm = this.formBuilder.group({
      name: [this.document.name, [Validators.required]],
      applicationGroup: new FormGroup({
        applicationProposal: new FormControl(appProposal),
        applicationCooperativeRegistration: new FormControl(appCooperative)
      }, RequireCheckboxesToBeCheckedValidator()),
      isActive: [this.document.is_active]
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.documentTypeForm.invalid) {
      return;
    }

    const docForm = this.documentTypeForm.value;
    this.document.name = docForm.name;
    this.document.application = 0 + (docForm.applicationGroup.applicationProposal ? 1 : 0) + (docForm.applicationGroup.applicationCooperativeRegistration ? 2 : 0);
    this.document.is_active = docForm.isActive;

    if (this.isAdd) {
      this.documentTypeService.add(this.document).subscribe({
        next: (ret) => this.resultNext(ret, 'Tipo de documento criado', 'Não foi possível criar este tipo de documento'),
        error: (err) => console.log(err)
      });
    } else {
      this.documentTypeService.update(this.document).subscribe({
        next: (ret) => this.resultNext(ret, 'Tipo de documento alterado', 'Não foi possível alterar este tipo de documento'),
        error: (err) => console.log(err)
      });
    }
  }

  onReset() {
    this.submitted = false;
    this.documentTypeForm.reset();
  }

  get f() {
    return this.documentTypeForm.controls;
  }
}
