import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AdminContactService } from '../contact.service';
import { MenuService } from 'src/app/navigation/menu/menu.service';
import { NotificationService } from 'src/app/_services/notification.service';

import { SMEContact } from 'src/app/_models/contact.model';

@Component({ selector: 'admin-contact-view', templateUrl: './contact-view.component.html', styleUrls: ['./contact-view.component.scss'] })
export class AdminContactViewComponent implements OnInit {
  public contact!: SMEContact;

  constructor(
    private contactService: AdminContactService,
    private menuService: MenuService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router) {
      this.menuService.showSearchFilter = false;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';

    this.loadMessage(id);
  }

  goBack() {
    this.router.navigate([`/admin/fale-conosco`]);
  }

  loadMessage(id: string) {
    this.contactService.get(id).subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          this.contact = ret.retorno;
          return;
        }
        
        this.notificationService.showWarning('Houve um erro ao tentar obter a mensagen', 'Erro!');
      },
      error: (err) => console.log(err)
    });
  }
}
