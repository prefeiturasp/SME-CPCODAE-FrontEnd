import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faBuilding, faCopy, faCubes, faMapMarkerAlt, faPercentage, faSeedling, faUsers } from '@fortawesome/free-solid-svg-icons';

import { AdminPublicCallService } from 'src/app/admin/public-call/public-call.service';
import { LocationService } from 'src/app/_services/location.service';
import { NotificationService } from 'src/app/_services/notification.service';

import { ChangeRequest } from 'src/app/_models/change-request.model';
import { CooperativeDeliveryInfo } from 'src/app/_models/cooperative-delivery-info.model';
import { CooperativeDocument } from 'src/app/_models/cooperative-document.model';
import { PublicCall } from 'src/app/_models/public-call.model';
import { PublicCallFood } from 'src/app/_models/public-call-food.model';
import { State } from 'src/app/_models/location.model';

import { PublicCallStatusEnum } from 'src/app/_enums/public-call-status-enum';
import { copyToClipboard } from 'src/app/_utils/geral';

@Component({ selector: 'app-public-call-delivery', templateUrl: './public-call-delivery.component.html', styleUrls: ['./public-call-delivery.component.scss'] })
export class PublicCallDeliveryComponent implements OnInit {
    @Input() public publicCall: PublicCall | undefined;
    @Input() public isLogistic: boolean = false;
    @Input() public changeRequests: ChangeRequest[] = [];
    @Input() public cooperatives: CooperativeDeliveryInfo[] = [];
    @Input() public documents: CooperativeDocument[] = [];
    @Output() public onGoBack: EventEmitter<boolean> = new EventEmitter();
    @Output() public onReload = new EventEmitter();

    private filteredCooperativesByFood: CooperativeDeliveryInfo[] = [];
    private _food!: PublicCallFood;
    @Input() get food(): PublicCallFood {
        return this._food;
    }
    set food(value: PublicCallFood) {
        this._food = value;

        if (!this.cooperatives)
            return;

        this.updateCalculatedInfo();
    }

    public id: string = '';
    public faIcons: any;
    public PublicCallStatusEnum: any = PublicCallStatusEnum;
    public statesList!: State[];

    public chartValues: any[] = [];
    public colorScheme = [{ name: "Entregue", value: '#FF9900' }];
    public totalDeliveredPercentage: number = 0;
    public totalPurchased: number = 0;

    constructor(
        private locationService: LocationService,
        private notificationService: NotificationService,
        public publicCallService: AdminPublicCallService,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private router: Router
    ) {
        this.faIcons = { copy: faCopy, goodLocationAlt: faMapMarkerAlt, inclusiveCooperative: faUsers, organic: faSeedling, percentage: faBuilding, singular: faCubes };

        this.locationService.getStatesJSON().subscribe({
            next: (retS) => {
              this.statesList = retS;
            },
            error: (errS) => {
              console.log(errS);
            }
          });
    }

    ngOnInit(): void {
        if (!this.publicCall || !this.publicCall.foods || this.publicCall.foods.length <= 0) {
            this.id = this.route.snapshot.params['id'];

            this.publicCallService.get(this.id).subscribe({
                next: (ret) => {
                    if (ret && ret.sucesso) {
                        this.publicCall = ret.retorno;

                        this.loadDeliveryInformation(this.id);
                    }
                },
                error: (error) => {
                    console.log(error);
                    this.notificationService.showWarning('Não foi possível carregar esta chamada', 'Tente novamente mais tarde');
                }
            });

            return;
        }

        this.loadDeliveryInformation(this.publicCall.id);
    }

    async confirmCronogramaExecutado(cooperative: CooperativeDeliveryInfo) {
        if (cooperative.was_confirmed)
            return;

        if (!(await this.notificationService.showConfirm('Deseja realmente definir o cronograma desta cooperativa como executado?', '')))
            return;

        const public_call_answer_id: string = cooperative.public_call_answer_id;
        
        this.publicCallService.confirmDeliveryPut(public_call_answer_id).subscribe({
            next: (ret) => {
                if (ret && ret.sucesso) {
                    this.notificationService.showSuccess(`Cronograma da cooperativa executado com sucesso`, 'Sucesso!');
                    cooperative.was_confirmed = true;
                    return;
                }
            
                this.notificationService.showWarning(`Não foi possível marcar o cronograma desta cooperativa como executado`, 'Erro');
                },
                error: (err) => console.log(err)
        })
    }

    confirmDelivery($event: boolean) {
        this.modalService.dismissAll('');

        if ($event)
            this.publicCall!.status = 3;

        this.loadDeliveryInformation(this.publicCall!.id);
        this.notificationService.showSuccess('Entrega confirmada com sucesso', 'Sucesso!');
    }

    copyToClipboardCnpj(text: string) {
      if (!text)
          return;

        text = text.trim();
        copyToClipboard(text);

        this.notificationService.showSuccess('Cnpj copiado', 'Sucesso!');
    }

    onChangeStatusEvent($event: any) {
      this.publicCallService.changeStatus($event.public_call_id, $event.status.id).subscribe({
        next: (ret) => {
            const typeStatus = $event.status.id === PublicCallStatusEnum.homologada.id ? { success: 'homologada', fail: 'homologar' } : { success: 'contratada', fail: 'contratar' };

            if (ret && ret.sucesso) {
                this.notificationService.showSuccess(`Chamada Pública ${typeStatus.success} com sucesso`, 'Sucesso!');
                this.goBack();
                return;
              }
          
              this.notificationService.showWarning(`Não foi possível ${typeStatus.fail} esta chamada`, 'Erro');
            },
            error: (err) => console.log(err)
      })
    }

    removeDelivery($event: boolean) {
        this.modalService.dismissAll('');

        if ($event)
            this.publicCall!.status = 3;

        this.loadDeliveryInformation(this.publicCall!.id);
        this.notificationService.showSuccess('Entrega removida com sucesso', 'Sucesso!');
    }

    loadDeliveryInformation(publicCallId: string) {

        this.publicCallService.getAllCooperativesDeliveryInfo(publicCallId).subscribe({
            next: (ret) => {
                if (ret && ret.sucesso) {
                    this.cooperatives = ret.retorno;

                    this.updateCalculatedInfo();
                }
            },
            error: (error) => {
                console.log(error);
                this.notificationService.showWarning('Não foi possível carregar a lista de cooperativas', 'Tente novamente mais tarde');
            }
        });
    }

    goBack() {
        this.onGoBack.emit(true);
    }

    onRemoveEvent(id: string) {
        this.publicCallService.delete(id).subscribe({
          next: (ret) => {
            if (ret && ret.sucesso) {
              this.notificationService.showSuccess('Chamada Pública removida com sucesso', 'Sucesso!');
              this.goBack();
              return;
            }
        
            this.notificationService.showWarning('Não foi possível remover esta chamada', 'Erro');
          },
          error: (err) => console.log(err)
        });
    }

    onSaveBoardOfAssociates($event: boolean) {
      if ($event)
        this.onReload.emit();
    }
    
    onSuspendEvent(id: string) {
        this.publicCallService.suspend(id).subscribe({
          next: (ret) => {
            if (ret && ret.sucesso) {
              this.notificationService.showSuccess('Chamada Pública suspensa com sucesso', 'Sucesso!');
              this.goBack();
              return;
            }
        
            this.notificationService.showWarning('Não foi possível suspender esta chamada', 'Erro');
          },
          error: (err) => console.log(err)
        });
    }

    openModal(content: any, isLargeSize: boolean) {
        const size = isLargeSize ? 'lg' : 'md';
    
        this.modalService.open(content, { centered: true, size });
    }

    updateCalculatedInfo() {
        this.filteredCooperativesByFood = this.cooperatives.filter(coop => coop.food_id === this._food.food_id);
        this.totalPurchased = this.filteredCooperativesByFood.reduce((acc, item) => acc += item.total_price, 0);

        const total_proposal = this.filteredCooperativesByFood.reduce((acc, item) => acc += item.total_proposal, 0);
        const total_delivered = this.filteredCooperativesByFood.reduce((acc, item) => acc += item.total_delivered, 0);
        const total_awaiting = total_proposal - total_delivered;

        // this.totalDeliveredPercentage = (total_delivered * 100 / total_proposal);

        // if (this.totalDeliveredPercentage >= 100)
        //     this.publicCall!.status = 4;
                    
        this.chartValues = [{ "name": "Entregue", "value": total_delivered }, { "name": "Aguardando", "value": total_awaiting }];
    }
}
