import { Component, OnInit } from '@angular/core';

import { ChangeRequestsService } from './change-requests.service';
import { NotificationService } from 'src/app/_services/notification.service';

import { faPercentage, faTasks} from '@fortawesome/free-solid-svg-icons';
@Component({ selector: 'app-change-requests', templateUrl: './change-requests.component.html', styleUrls: ['./change-requests.component.scss'] })
export class AdminChangeRequestsComponent implements OnInit {
  changeRequests: any = [];
  public faIcons: any;
  
  constructor(private changeRequestService: ChangeRequestsService, private notificationService: NotificationService) { 
    this.faIcons = { percentage: faPercentage, tasks: faTasks };
  }

  ngOnInit(): void {
    this.changeRequestService.getChangesRequests().subscribe({
      next: (ret) => {

        if (ret && ret.sucesso) {
          this.changeRequests = ret.retorno.public_calls;
          return;
        }
        
        this.notificationService.showWarning('Houve um erro ao tentar listar as solicitações', 'Erro!');
      },
      error: (err) => console.log(err)
    });
  }
}
