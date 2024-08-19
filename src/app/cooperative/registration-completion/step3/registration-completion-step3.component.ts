import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CooperativeService } from '../../cooperative.service';
import { NotificationService } from 'src/app/_services/notification.service';

import { Cooperative } from 'src/app/_models/cooperative.model';

declare const isEmpty: any;

@Component({ selector: 'app-cooperative-registration-completion-step3', templateUrl: './registration-completion-step3.component.html', styleUrls: ['./registration-completion-step3.component.scss'] })
export class CooperativeRegistrationCompletionStep3Component implements OnInit {
  public active: number = 1;
  public cooperative!: Cooperative;
  public hideButtons: boolean = false;

  constructor(
    private cooperativeService: CooperativeService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router) {
    const currentState: any = this.router.getCurrentNavigation()?.extras?.state;

    if (currentState) {
      this.cooperative = currentState.cooperative;
    }
  }

  ngOnInit(): void {
    if (this.cooperative) {
      return;
    }

    const id = this.route.snapshot.paramMap.get('id') ?? '';

    this.cooperativeService.get(id).subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          this.cooperative = ret.retorno;
        } else {
          this.notificationService.showWarning('Não foi possível carregar os dados desta cooperativa', 'Erro!');
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  goBack() {
    this.router.navigate([`/cooperativa/complete-seu-registro/passo-1/${this.cooperative.id}`], { state: { cooperative: this.cooperative } });
  }

  goToNext() {
    if (isEmpty(this.cooperative) || isEmpty(this.cooperative.members)) {
      this.notificationService.showWarning('Ao menos um cooperado deve ser adicionado', 'Erro!');
      return;
    }

    this.router.navigate([`/cooperativa/complete-seu-registro/passo-3/${this.cooperative.id}`], { state: { cooperative: this.cooperative } });
  }

  toggleButtons($event: any) {
    this.hideButtons = $event;
  }
}