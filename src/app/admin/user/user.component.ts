import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from 'src/app/navigation/menu/menu.service';

import { GridViewConfig } from 'src/app/_components/grid-view/_models/grid-view-config.model';
import { User } from 'src/app/_models/user.model';
import { NotificationService } from 'src/app/_services/notification.service';
import { AdminUserService } from './user.service';

@Component({ selector: 'admin-user', templateUrl: './user.component.html', styleUrls: ['./user.component.scss'] })
export class AdminUserComponent implements OnInit {
  public users: User[] = [];
  public config: GridViewConfig = new GridViewConfig();

  constructor(
    private menuService: MenuService,
    private notificationService: NotificationService,
    private userService: AdminUserService,
    private router: Router
  ) {
    this.menuService.showSearchFilter = true;
    this.menuService.searchFilterChanged.subscribe(ret => this.config.searchFilter = ret);
  }

  ngOnInit(): void {
    this.config = Object.assign(new GridViewConfig(), {
      props: [
        { header: 'Nome', prop: 'name' },
        { header: 'E-mail', prop: 'email' },
        { header: 'Perfil', prop: 'role' },
        { header: 'Ativo?', prop: 'is_active', type: 'boolean' }
      ],
      list: [],
      addButtonLabel: 'Novo Usuário',
      emptyMessage: 'Nenhum usuário foi encontrado',
      pageSize: 10,
      filterFn: this.filterUsers
    });

    this.userService.getAll().subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          this.users = ret.retorno;

          this.users.map(d => d.role = d.roles && d.roles.length >= 1 ? d.roles[0] : 'Sem Perfil');

          this.config.list = this.users;
          return;
        }

        this.notificationService.showWarning('Houve um erro ao tentar listar os usuários', 'Erro!');
      },
      error: (err) => console.log(err)
    });
  }

  filterUsers(item: User, filter: string)  {
    return item.name.toLowerCase().indexOf(filter) >= 0
            || (item.email && item.email.toLowerCase().indexOf(filter) >= 0)
            || (item.role && item.role.toLowerCase().indexOf(filter) >= 0);
  }

  goToAdd() {
    this.router.navigate([`/admin/usuario/novo`]);
  }

  goToEdit(id: any) {
    this.router.navigate([`/admin/usuario/${id}`]);
  }

  async remove ($event: any) {
    if (!(await this.notificationService.showConfirm('Deseja realmente remover este usuário?')))
      return;

    this.userService.delete($event.id).subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          const indice = this.users.findIndex(d => d.id === $event.id);
          this.users[indice].is_active = false;

          this.notificationService.showSuccess(`Usuário removido com sucesso`, 'Sucesso!');
          return;
        }

        this.notificationService.showWarning('Houve um erro ao tentar remover este usuário', 'Erro!');
      },
      error: (err) => console.log(err)
    })
  }
}
