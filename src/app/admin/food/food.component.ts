import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AdminCategoryService } from '../category/category.service';
import { AdminFoodService } from './food.service';
import { MenuService } from 'src/app/navigation/menu/menu.service';
import { NotificationService } from 'src/app/_services/notification.service';

import { GridViewConfig } from 'src/app/_components/grid-view/_models/grid-view-config.model';
import { SMECategory } from 'src/app/_models/category.model';
import { SMEFood } from 'src/app/_models/food.model';

@Component({ selector: 'admin-food', templateUrl: './food.component.html', styleUrls: ['./food.component.scss'] })
export class AdminFoodComponent implements OnInit {
  public categories: SMECategory[] = [];
  public foods: SMEFood[] = [];
  public config: GridViewConfig = new GridViewConfig();

  constructor(
    private categoryService: AdminCategoryService,
    private foodService: AdminFoodService,
    private menuService: MenuService,
    private notificationService: NotificationService,
    private router: Router) {
      this.menuService.showSearchFilter = true;
      this.menuService.searchFilterChanged.subscribe(ret => this.config.searchFilter = ret);
  }

  ngOnInit(): void {
    this.config = Object.assign(new GridViewConfig(), {
      props: [
        { header: 'Categoria', prop: 'category_name' },
        { header: 'Alimento', prop: 'name' },
        { header: 'Unidade Medida', prop: 'measure_unit_name' },
        { header: 'Ativo?', prop: 'is_active', type: 'boolean' }
      ],
      list: [],
      addButtonLabel: 'Novo Alimento',
      emptyMessage: 'Nenhum alimento foi encontrado',
      pageSize: 10,
      filterFn: this.filterFood
    });

    this.categoryService.getAll().subscribe({
      next: (ret) => {
        if (ret && ret.sucesso && ret.retorno.length > 0) {
          this.categories = ret.retorno;

          this.foodService.getAll().subscribe({
            next: (retF) => {
              if (retF && retF.sucesso) {
                this.foods = retF.retorno;
                
                this.foods.map(d => d.category_name = this.categories.find(c => c.id === d.category_id)!.name);
            
                this.config.list = this.foods;
                return;
              }
              
              this.notificationService.showWarning('Houve um erro ao tentar listar os alimentos', 'Erro!');
            },
            error: (err) => console.log(err)
          });
        }
      },
      error: (err) => console.log(err)
    });    
  }

  filterFood(item: SMEFood, filter: string)  {
    return item.name.toLowerCase().indexOf(filter) >= 0;
  }

  goToAdd() {
    this.router.navigate([`/admin/alimento/novo`]);
  }

  goToEdit(id: any) {
    this.router.navigate([`/admin/alimento/${id}`]);
  }

  async remove ($event: any) {
    if (!(await this.notificationService.showConfirm('Deseja realmente remover este gênero alimentício?')))
      return;

    this.foodService.delete($event.id).subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          const indice = this.foods.findIndex(d => d.id === $event.id);
          this.foods[indice].is_active = false;

          this.notificationService.showSuccess(`Alimento removido com sucesso`, 'Sucesso!');
          return;
        }

        this.notificationService.showWarning('Houve um erro ao tentar remover este alimento', 'Erro!');
      },
      error: (err) => console.log(err)
    })
  }
}
