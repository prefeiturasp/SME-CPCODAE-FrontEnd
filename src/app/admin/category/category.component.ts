import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AdminCategoryService } from './category.service';
import { MenuService } from 'src/app/navigation/menu/menu.service';
import { NotificationService } from 'src/app/_services/notification.service';

import { GridViewConfig } from 'src/app/_components/grid-view/_models/grid-view-config.model';
import { SMECategory } from 'src/app/_models/category.model';

@Component({ selector: 'admin-category', templateUrl: './category.component.html', styleUrls: ['./category.component.scss'] })
export class AdminCategoryComponent implements OnInit {
  public categories: SMECategory[] = [];
  public config: GridViewConfig = new GridViewConfig();

  constructor(
    private categoryService: AdminCategoryService,
    private menuService: MenuService,
    private notificationService: NotificationService,
    private router: Router) {
      this.menuService.showSearchFilter = true;
      this.menuService.searchFilterChanged.subscribe(ret => this.config.searchFilter = ret);
  }

  ngOnInit(): void {
    this.config = Object.assign(new GridViewConfig(), {
      props: [{ header: 'Categoria', prop: 'name' }, { header: 'Ativa?', prop: 'is_active', type: 'boolean' }],
      list: [],
      addButtonLabel: 'Nova Categoria',
      emptyMessage: 'Nenhuma categoria foi encontrada',
      filterFn: this.filterCategories
    });

    this.categoryService.getAll().subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          this.categories = ret.retorno;
      
          this.config.list = this.categories;
          return;
        }
        
        this.notificationService.showWarning('Houve um erro ao tentar listar as categorias', 'Erro!');
      },
      error: (err) => console.log(err)
    });
  }

  filterCategories(item: SMECategory, filter: string)  {
    return item.name.toLowerCase().indexOf(filter) >= 0;
  }

  goToAdd() {
    this.router.navigate([`/admin/categoria/nova`]);
  }

  goToEdit(id: any) {
    this.router.navigate([`/admin/categoria/${id}`]);
  }

  async remove ($event: any) {
    if (!(await this.notificationService.showConfirm('Deseja realmente remover esta categoria?')))
      return;

    this.categoryService.delete($event.id).subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          const indice = this.categories.findIndex(d => d.id === $event.id);
          this.categories[indice].is_active = false;

          this.notificationService.showSuccess(`Categoria removida com sucesso`, 'Sucesso!');
          return;
        }

        this.notificationService.showWarning('Houve um erro ao tentar remover esta categoria', 'Erro!');
      },
      error: (err) => console.log(err)
    })
  }
}
