import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { AdminCategoryService } from '../../category/category.service';
import { AdminFoodService } from '../food.service';
import { MenuService } from 'src/app/navigation/menu/menu.service';
import { NotificationService } from 'src/app/_services/notification.service';

import { SMECategory } from 'src/app/_models/category.model';
import { SMEFood } from 'src/app/_models/food.model';

declare const isEmpty: any;

@Component({ selector: 'admin-food-registration', templateUrl: './food-registration.component.html', styleUrls: ['./food-registration.component.scss'] })
export class AdminFoodRegistrationComponent implements OnInit {
  public foodForm!: UntypedFormGroup;

  public categories: SMECategory[] = [];
  public food!: SMEFood;
  public unmodified!: SMEFood;
  public isAdd: boolean = false;
  public submitted: boolean = false;

  constructor(
    private categoryService: AdminCategoryService,
    private foodService: AdminFoodService,
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

    this.foodForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      category_id: ['', [Validators.required]],
      measure_unit: ['', [Validators.required, Validators.min(1)]],
      isActive: [true]
    });

    this.loadCategories();

    if (this.isAdd) {
      this.food = new SMEFood();
      this.unmodified = Object.assign({}, this.food);
    } else {
      this.foodService.get(id).subscribe({
        next: (ret) => {
          if (ret && ret.sucesso) {
            this.food = ret.retorno;
            this.unmodified = Object.assign({}, this.food);

            this.foodForm.patchValue({
              name: this.food.name,
              category_id: this.food.category_id,
              measure_unit: this.food.measure_unit,
              isActive: this.food.is_active
            });
          }
        },
        error: (err) => console.log(err)
      });
    }
  }

  async goBack() {
    if (!this.isChanged() || !(await this.notificationService.showConfirm('Existem alterações não salvas. Caso continue você irá perder estas informações. Deseja continuar?')))
      this.router.navigate(['/admin/alimento']);
  }

  isChanged() : boolean {
    return this.food.id !== this.unmodified.id
      || this.food.name !== this.unmodified.name
      || this.food.category_id !== this.unmodified.category_id
      || this.food.is_active !== this.unmodified.is_active;
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (ret) => {
        if (ret && ret.sucesso && ret.retorno.length > 0) {
          this.categories = ret.retorno;
        }
      },
      error: (err) => console.log(err)
    })
  }

  resultNext(ret: any, successfulMessage: string, errorMessage: string) {
    if (ret && ret.sucesso) {
      this.notificationService.showSuccess(successfulMessage, 'Sucesso!');
      this.unmodified = Object.assign({}, this.food);
      this.goBack();
      return;
    }

    this.notificationService.showWarning(errorMessage, 'Erro');
  }

  onSubmit() {
    this.submitted = true;

    if (this.foodForm.invalid) {
      return;
    }

    const foodForm = this.foodForm.value;
    this.food.name = foodForm.name;
    this.food.category_id = foodForm.category_id;
    this.food.measure_unit = foodForm.measure_unit;
    this.food.is_active = foodForm.isActive;

    if (this.isAdd) {
      this.foodService.add(this.food).subscribe({
        next: (ret) => this.resultNext(ret, 'Alimento criado', 'Não foi possível criar este alimento'),
        error: (err) => console.log(err)
      });
    } else {
      this.foodService.update(this.food).subscribe({
        next: (ret) => this.resultNext(ret, 'Alimento alterado', 'Não foi possível alterar este alimento'),
        error: (err) => console.log(err)
      });
    }
  }

  onReset() {
    this.submitted = false;
    this.foodForm.reset();
  }

  get f() {
    return this.foodForm.controls;
  }
}
