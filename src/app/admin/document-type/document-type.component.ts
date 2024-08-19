import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AdminDocumentTypeService } from './document-type.service';
import { MenuService } from 'src/app/navigation/menu/menu.service';
import { NotificationService } from 'src/app/_services/notification.service';

import { GridViewConfig } from 'src/app/_components/grid-view/_models/grid-view-config.model';
import { SMEDocumentType } from 'src/app/_models/document-type.model';

@Component({ selector: 'admin-document-type', templateUrl: './document-type.component.html', styleUrls: ['./document-type.component.scss'] })
export class AdminDocumentTypeComponent implements OnInit {
  public documents: SMEDocumentType[] = [];
  public config: GridViewConfig = new GridViewConfig();

  constructor(
    private documentTypeService: AdminDocumentTypeService,
    private menuService: MenuService,
    private notificationService: NotificationService,
    private router: Router) {
      this.menuService.showSearchFilter = true;
      this.menuService.searchFilterChanged.subscribe(ret => this.config.searchFilter = ret);
  }

  ngOnInit(): void {
    this.config = Object.assign(new GridViewConfig(), {
      props: [{ header: 'Documento', prop: 'name' }, { header: 'Aplicação', prop: 'application_text' }, { header: 'Ativo?', prop: 'is_active', type: 'boolean' }],
      list: [],
      addButtonLabel: 'Novo Documento',
      emptyMessage: 'Nenhum tipo de documento foi encontrado',
      pageSize: 10,
      filterFn: this.filterDocuments
    });

    this.documentTypeService.getAll().subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          this.documents = ret.retorno;

          // for (let i = 0; i <= 20; i++) {
          //   let is_active = i != 5;
          //  this.documents.push({ id: i.toString(), name: `Documento ${i.toString().padStart(2, '0')}`, application: Math.ceil(Math.random() * 3), is_active: is_active });
          // }
      
          this.documents.map(d => d.application_text = this.getApplicationText(d.application));

          this.config.list = this.documents;
          return;
        }
        
        this.notificationService.showWarning('Houve um erro ao tentar listar os tipos de documento', 'Erro!');
      },
      error: (err) => console.log(err)
    });
  }

  filterDocuments(item: SMEDocumentType, filter: string)  {
    return item.name.toLowerCase().indexOf(filter) >= 0 
            || (item.application_text && item.application_text.toLowerCase().indexOf(filter) >= 0);
  }

  getApplicationText(application: number): string {
    switch(application)
    {
      case 1:
        return 'Proposta';
      case 2:
        return 'Cadastro Cooperativa';
      case 3:
        return 'Proposta / Cadastro Cooperativa';
      default:
        return 'Nenhuma forma de aplicação encontrada';
    }
  }

  goToAdd() {
    this.router.navigate([`/admin/tipo-documento/novo`]);
  }

  goToEdit(id: any) {
    this.router.navigate([`/admin/tipo-documento/${id}`]);
  }

  async remove ($event: any) {
    if (!(await this.notificationService.showConfirm('Deseja realmente remover este tipo de documento?')))
      return;

    this.documentTypeService.delete($event.id).subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          const indice = this.documents.findIndex(d => d.id === $event.id);
          this.documents[indice].is_active = false;

          this.notificationService.showSuccess(`Tipo de documento removido com sucesso`, 'Sucesso!');
          return;
        }

        this.notificationService.showWarning('Houve um erro ao tentar remover este tipo de documento', 'Erro!');
      },
      error: (err) => console.log(err)
    })
  }
}
