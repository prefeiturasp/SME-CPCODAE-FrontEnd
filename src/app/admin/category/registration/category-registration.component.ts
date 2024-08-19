import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { AdminCategoryService } from '../category.service';
import { MenuService } from 'src/app/navigation/menu/menu.service';
import { NotificationService } from 'src/app/_services/notification.service';

import { SMECategory } from 'src/app/_models/category.model';

declare const isEmpty: any;

@Component({ selector: 'admin-category-registration', templateUrl: './category-registration.component.html', styleUrls: ['./category-registration.component.scss'] })
export class AdminCategoryRegistrationComponent implements OnInit {
  public categoryForm!: UntypedFormGroup;

  public category!: SMECategory;
  public unmodified!: SMECategory;
  public isAdd: boolean = false;
  public submitted: boolean = false;

  constructor(
    private categoryService: AdminCategoryService,
    private menuService: MenuService,
    private notificationService: NotificationService,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {
    this.menuService.showSearchFilter = false;
    const id = this.route.snapshot.paramMap.get('id') ?? '';

    this.isAdd = (isEmpty(id) || id.toLowerCase() === 'nova');

    this.categoryForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      isActive: [true]
    });

    if (this.isAdd) {
      this.category = new SMECategory();
      this.unmodified = Object.assign({}, this.category);
    } else {
      this.categoryService.get(id).subscribe({
        next: (ret) => {
          if (ret && ret.sucesso) {
            this.category = ret.retorno;
            this.unmodified = Object.assign({}, this.category);

            this.categoryForm.patchValue({
              name: this.category.name,           
              isActive: this.category.is_active
            });
          }
        },
        error: (err) => console.log(err)
      });
    }
  }

  async goBack() {
    if (!this.isChanged() || !(await this.notificationService.showConfirm('Existem alterações não salvas. Caso continue você irá perder estas informações. Deseja continuar?')))
      this.router.navigate(['/admin/categoria']);
  }

  isChanged() : boolean {
    return this.category.id !== this.unmodified.id
      || this.category.name !== this.unmodified.name
      || this.category.is_active !== this.unmodified.is_active;
  }

  resultNext(ret: any, successfulMessage: string, errorMessage: string) {
    if (ret && ret.sucesso) {
      this.notificationService.showSuccess(successfulMessage, 'Sucesso!');
      this.unmodified = Object.assign({}, this.category);
      this.goBack();
      return;
    }

    this.notificationService.showWarning(errorMessage, 'Erro');
  }

  setFormBuilder() {
    this.categoryForm = this.formBuilder.group({
      name: [this.category.name, [Validators.required]],
      isActive: [this.category.is_active]
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.categoryForm.invalid) {
      return;
    }

    const docForm = this.categoryForm.value;
    this.category.name = docForm.name;
    this.category.is_active = docForm.isActive;

    if (this.isAdd) {
      this.categoryService.add(this.category).subscribe({
        next: (ret) => this.resultNext(ret, 'Categoria criada', 'Não foi possível criar esta categoria'),
        error: (err) => console.log(err)
      });
    } else {
      this.categoryService.update(this.category).subscribe({
        next: (ret) => this.resultNext(ret, 'Categoria alterada', 'Não foi possível alterar esta categoria'),
        error: (err) => console.log(err)
      });
    }
  }

  onReset() {
    this.submitted = false;
    this.categoryForm.reset();
  }

  get f() {
    return this.categoryForm.controls;
  }
}
