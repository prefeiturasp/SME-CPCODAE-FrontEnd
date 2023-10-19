import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AdminCooperativeService } from './cooperative.service';
import { MenuService } from 'src/app/navigation/menu/menu.service';
import { NotificationService } from 'src/app/_services/notification.service';

import { Cooperative } from 'src/app/_models/cooperative.model';
import { GridViewConfig } from 'src/app/_components/grid-view/_models/grid-view-config.model';

declare const maskCnpj: any;
declare const onlyNumbers: any;

@Component({ selector: 'admin-cooperative', templateUrl: './cooperative.component.html', styleUrls: ['./cooperative.component.scss'] })
export class AdminCooperativeComponent implements OnInit {
  public cooperatives: Cooperative[] = [];
  public config: GridViewConfig = new GridViewConfig();

  constructor(
    private cooperativeService: AdminCooperativeService,
    private menuService: MenuService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.menuService.showSearchFilter = true;
    this.menuService.searchFilterChanged.subscribe(ret => this.config.searchFilter = ret);
  }

  ngOnInit(): void {
    this.config = Object.assign(new GridViewConfig(), {
      props: [
        { header: 'Razão Social', prop: 'name' },
        { header: 'CNPJ', prop: 'cnpj_formatted' },
        { header: 'DAP?', prop: 'is_dap', type: 'boolean' },
        { header: 'DAP/CAF', prop: 'dap_caf_code' },
        { header: 'Ativo?', prop: 'is_active', type: 'boolean' }
      ],
      list: [],
      emptyMessage: 'Nenhuma cooperativa foi encontrada',
      filterFn: this.filterCooperatives,
      showButtonArea: false
    });

    this.cooperativeService.getAll().subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          this.cooperatives = ret.retorno;

          this.cooperatives.map(d => d.cnpj_formatted = maskCnpj(d.cnpj));

          this.config.list = this.cooperatives;
          return;
        }

        this.notificationService.showWarning('Houve um erro ao tentar listar as cooperativas', 'Erro!');
      },
      error: (err) => console.log(err)
    });
  }

  filterCooperatives(item: Cooperative, filter: string)  {
    const cnpjOnlyNumbers = onlyNumbers(filter);

    return item.name.toLowerCase().indexOf(filter) >= 0
            || (item.cnpj && cnpjOnlyNumbers && item.cnpj.indexOf(cnpjOnlyNumbers) >= 0)
            || (item.dap_caf_code && item.dap_caf_code.indexOf(filter) >= 0);
  }

  goToAdd() {
    this.router.navigate([`/admin/cooperativa/novo`]);
  }

  goToEdit(id: any) {
    this.router.navigate([`/admin/cooperativa/${id}`]);
  }

  async remove ($event: any) {
    if (!(await this.notificationService.showConfirm('Deseja realmente remover esta cooperativa?')))
      return;

    this.cooperativeService.delete($event.id).subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          const indice = this.cooperatives.findIndex(d => d.id === $event.id);
          this.cooperatives[indice].is_active = false;

          this.notificationService.showSuccess(`Cooperativa removida com sucesso`, 'Sucesso!');
          return;
        }

        this.notificationService.showWarning('Houve um erro ao remover esta cooperativa', 'Erro!');
      },
      error: (err) => console.log(err)
    })
  }
}
