import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AdminPublicCallService } from '../../public-call/public-call.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { LoaderService } from 'src/app/_services/loader.service';

import { ChangeRequest } from 'src/app/_models/change-request.model';
import { CooperativeDeliveryInfo } from 'src/app/_models/cooperative-delivery-info.model';
import { CooperativeDocument } from 'src/app/_models/cooperative-document.model';
import { CooperativePublicCallDelivery } from 'src/app/_models/cooperative-public-call-delivery.model';
import { PublicCall } from 'src/app/_models/public-call.model';

import { PublicCallFood } from 'src/app/_models/public-call-food.model';
import { PublicCallStatusEnum } from 'src/app/_enums/public-call-status-enum';
import readXlsxFile from 'read-excel-file';

declare const $: any;
declare const replaceAll: any;
declare const toBase64: any;

@Component({ selector: 'admin-dashboard-detail', templateUrl: './dashboard-detail.component.html', styleUrls: ['./dashboard-detail.component.scss'] })
export class AdminDashboardDetailComponent implements OnInit {
  public id: string = '';
  public publicCall: PublicCall | undefined;
  public publicCallDelivery!: CooperativePublicCallDelivery;
  public changeRequests: ChangeRequest[] = [];
  public cooperatives: CooperativeDeliveryInfo[] = [];
  public currentFood?: PublicCallFood = undefined;
  public documents: CooperativeDocument[] = [];
  public PublicCallStatusEnum: any = PublicCallStatusEnum;

  currentStep = 1;
  cookieName = 'publicCallBuy';
  keyValueList: { key: string, value: any }[] = [];

  constructor(
    private notificationService: NotificationService,
    public publicCallService: AdminPublicCallService,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private router: Router
  ) {
    $('.search-filter').val('');
    const currentState: any = this.router.getCurrentNavigation()?.extras?.state;

    if (currentState) {
      this.publicCall = currentState.publicCall;
      this.currentFood = this.publicCall!.foods[0];
      this.setPublicCallDelivery();
    }
  }

  ngOnInit(): void {
    if (!this.publicCall || !this.publicCall.foods || this.publicCall.foods.length <= 0) {
      this.id = this.route.snapshot.params['id'];

      this.publicCallService.get(this.id).subscribe({
        next: (ret) => {
          if (!ret || !ret.sucesso || !ret.retorno || !ret.retorno.foods || ret.retorno.foods.length <= 0) {
            this.invalidPublicCall('Chamada pública inválida', ret);
            return;
          }

          this.publicCall = ret.retorno;
          this.currentFood = this.publicCall!.foods[0];

          this.setPublicCallDelivery();

          this.loadAnswersList(this.id);
        },
        error: (error) => {
          this.invalidPublicCall(error, null);
        }
      });
      
      return;
    }

    this.id = this.publicCall.id;
    this.loadAnswersList(this.id);
  }

  buy(content: any) {
    let isValid = true;

    for (let i = 0; i <= this.publicCall!.foods.length - 1; i++) {
      const food = this.publicCall!.foods[i];
      const totalSelected = this.getSelectedQuantity(food.food_id);
      const totalQuantity = food.quantity;
      const measureUnit = food.measure_unit;
  
      // if (totalSelected > totalQuantity) {
      //   this.notificationService.showWarning(`A quantidade total selecionada do produto ${food.food_name} deve ser menor ou igual a ${totalQuantity} ${measureUnit}`, 'Erro!');
      //   isValid = false;
      //   continue;
      // }
    }

    if (!isValid)
      return;

    //this.modalService.open(content, { centered: true });
    const selectedCooperatives = this.selected.map((item) => ({
      public_call_answer_id: item.public_call_answer_id,
      new_quantity: item.total_proposal_edited
    }));

    this.publicCallService.buy(this.id, selectedCooperatives, []).subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          this.notificationService.showSuccess('Documentos da chamada analisados com sucesso', 'Sucesso!');
          this.goBack(true);
          return;
        }

        this.notificationService.showWarning('Não foi possível definir esta chamada como documentos analisados', 'Erro');
      },
      error: (err) => console.log(err)
    });
  }

  public async contratarPublicCall() {
    if (!(await this.notificationService.showConfirm('Deseja realmente definir esta chamada como contratada?', '')))
      return;

    this.onChangeStatusEvent({ public_call_id: this.publicCall!.id, status: PublicCallStatusEnum.contratada });
  }

  public async cronogramaExecutadoPublicCall() {
    if (!(await this.notificationService.showConfirm('Deseja realmente definir esta chamada como cronograma executado?', '')))
      return;

    this.onChangeStatusEvent({ public_call_id: this.publicCall!.id, status: PublicCallStatusEnum.cronogramaExecutado });
  }

  public async cronogramaExecutadoPublicCallAnswer(public_call_answer_id: string) {
    if (!(await this.notificationService.showConfirm('Deseja realmente definir o cronograma desta cooperativa como executado?', '')))
      return;

      this.publicCallService.confirmDeliveryPut(public_call_answer_id).subscribe({
        next: (ret) => {
            if (ret && ret.sucesso) {
                this.notificationService.showSuccess(`Cronograma da cooperativa executado com sucesso`, 'Sucesso!');
                this.goBack(true);
                return;
              }
          
              this.notificationService.showWarning(`Não foi possível marcar o cronograma desta cooperativa como executado`, 'Erro');
            },
            error: (err) => console.log(err)
      })
  }

  changeQuantity(cooperative: CooperativeDeliveryInfo) {
    const publicCall = this.publicCall!;
    const measureUnit = publicCall.foods[0].measure_unit;

    return Swal.fire({
      title: `Defina a quantidade a ser comprada (em ${measureUnit})`,
      input: 'text',
      inputLabel: cooperative.name,
      inputValue: cooperative.total_proposal_edited || cooperative.total_proposal,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Alterar',
      cancelButtonText: 'Cancelar',
      didOpen: (el) => {
        const container = $(el);
        const input = container.find('#swal2-input');
        input.maskMoney({ decimal: ',', thousands: '.', precision: 0 });
        input.maskMoney('mask');
        input.attr('maxlength', '9');
      },
      inputValidator: (value) => {
        if (!value)
          return 'Defina uma quantidade'

          const quantity = replaceAll(value, '.', '');

        if (quantity > publicCall.foods[0].quantity)
          return `A quantidade não deve ser maior do que ${publicCall.foods[0].quantity} ${measureUnit}`;

        return '';
      }
    })
    .then((result) => {
      if (!result.isConfirmed)
        return;

      const quantity = result.value.replaceAll('.', '');

      cooperative.total_proposal_edited = parseFloat(quantity);
      return result.isConfirmed
    });
  }

  clearInputFile() {
    $(".upload:hidden").val('');
  }

  public async homologarPublicCall() {
    if (!(await this.notificationService.showConfirm('Deseja realmente definir esta chamada como homologada?', '')))
      return;

    this.onChangeStatusEvent({ public_call_id: this.publicCall!.id, status: PublicCallStatusEnum.homologada });
  }

  getSelectedCooperativesByFood(food_id: string): CooperativeDeliveryInfo[] {
    return this.cooperatives.filter(c => c.food_id === food_id && c.is_selected);
  }

  getSelectedQuantity(food_id: string): number {
    const selectedCooperatives = this.getSelectedCooperativesByFood(food_id);
    if (!selectedCooperatives || selectedCooperatives.length <= 0)
      return 0;
      
    return selectedCooperatives.reduce((acc, item) => acc += (item.total_proposal_edited || item.total_proposal), 0);
  }

  getCronogramaExecutadoSelectedQuantity(): number {
    const selectedCooperatives = this.cooperativesSelectedByProduct;
    if (!selectedCooperatives || selectedCooperatives.length <= 0)
      return 0;
      
    return selectedCooperatives.reduce((acc, item) => acc += (item.total_proposal_edited || item.total_proposal), 0);
  }

  loadAnswersList(publicCallId: string) {
    this.publicCallService.getAllCooperativesAvailableToBeChosen(publicCallId).subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          this.cooperatives = ret.retorno;
          this.cooperatives.map(c => { c.id == c.cooperative_id});

          this.loadChangeRequestHistory(publicCallId);
          setTimeout(() => this.loadDocuments(publicCallId), 500);
        }
      },
      error: (error) => {
        console.log(error);
        this.notificationService.showWarning('Não foi possível carregar a lista de cooperativas', 'Tente novamente mais tarde');
      }
    });
  }

  loadChangeRequestHistory(publicCallId: string) {
    this.publicCallService.getAllChangeRequestHistory(publicCallId).subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          this.changeRequests = ret.retorno;
        }
      },
      error: (error) => {
        console.log(error);
        this.notificationService.showWarning('Não foi possível carregar o histórico de mensagens', 'Tente novamente mais tarde');
      }
    });
  }

  loadDocuments(publicCallId: string) {
    this.publicCallService.getAllDocumentsFromCooperative(publicCallId).subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          this.documents = ret.retorno;
        }
      },
      error: (error) => {
        console.log(error);
        this.notificationService.showWarning('Não foi possível carregar os anexos', 'Tente novamente mais tarde');
      }
    });
  }

  invalidPublicCall(errorMessage: string, error: any) {
    console.log(errorMessage, error);
    this.notificationService.showWarning('Não foi possível carregar esta chamada', 'Tente novamente mais tarde');
    this.goBack(true);
  }

  goBack($event: boolean) {
    this.router.navigate(['/admin/chamadas-publicas']);
  }

  nextStep() {
    const lastStep = this.publicCall!.status <= 1 ? this.publicCall!.foods.length + 1 : this.publicCall!.foods.length;

    if (this.currentStep < lastStep) {
      this.currentFood = this.currentStep >= this.publicCall!.foods.length ? undefined : this.publicCall!.foods[this.currentStep];
      this.currentStep++;
    }
  }

  onChangeStatusEvent($event: any) {
    this.publicCallService.changeStatus($event.public_call_id, $event.status.id).subscribe({
      next: (ret) => {
          const typeStatus = $event.status.id === PublicCallStatusEnum.homologada.id ? { success: 'homologada', fail: 'homologar' } : { success: 'contratada', fail: 'contratar' };

          if (ret && ret.sucesso) {
              this.notificationService.showSuccess(`Chamada Pública ${typeStatus.success} com sucesso`, 'Sucesso!');
              this.goBack(true);
              return;
            }
        
            this.notificationService.showWarning(`Não foi possível ${typeStatus.fail} esta chamada`, 'Erro');
          },
          error: (err) => console.log(err)
    })
  }

  onDesertaEvent(id: string) {
    this.publicCallService.setAsDeserta(this.id).subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          this.notificationService.showSuccess('Chamada Pública definida como deserta com sucesso', 'Sucesso!');
          this.goBack(true);
          return;
        }

        this.notificationService.showWarning('Não foi possível definir esta chamada como deserta', 'Erro');
      },
      error: (err) => console.log(err)
    });
  }

  onEditEvent(id: string) {
    this.router.navigate([`/admin/chamadas-publicas/${this.id}`]);
  }

  onReload() {
    this.loadAnswersList(this.id);
  }

  onRemoveEvent(id: string) {
    this.publicCallService.delete(this.id).subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          this.notificationService.showSuccess('Chamada Pública removida com sucesso', 'Sucesso!');
          this.goBack(true);
          return;
        }

        this.notificationService.showWarning('Não foi possível remover esta chamada', 'Erro');
      },
      error: (err) => console.log(err)
    });
  }

  onSuspendEvent(id: string) {
    this.publicCallService.suspend(this.id).subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          this.notificationService.showSuccess('Chamada Pública suspensa com sucesso', 'Sucesso!');
          this.goBack(true);
          return;
        }

        this.notificationService.showWarning('Não foi possível suspender esta chamada', 'Erro');
      },
      error: (err) => console.log(err)
    });
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentFood = this.currentStep >= this.publicCall!.foods.length ? undefined : this.publicCall!.foods[this.currentStep];
      this.currentStep--;
    }
  }

  setCurrentStep(step: number) {
    const stepBack = this.currentStep > step;

    this.currentStep = step;
    this.currentFood = (step - 1) >= this.publicCall!.foods.length ? undefined : this.publicCall!.foods[(step - 1)];

    const foodId = this.currentFood?.food_id ?? '';
    const documents = this.documents.filter(d => d.file_base_64);
    const newDocuments = JSON.parse(JSON.stringify(documents));

    if(this.keyValueList.filter(x=> x.key == foodId).length === 0) {
      this.keyValueList.push({ key: foodId, value: newDocuments });
    } else {
      this.keyValueList.filter(x=> x.key == foodId)[0].value = newDocuments;
    }

    const nextFoodId = this.publicCall?.foods[this.currentStep - 1]?.food_id;

    if(nextFoodId) {
      if(this.keyValueList.filter(x=> x.key == nextFoodId).length > 0) {
        this.documents.map(doc=> {
          this.keyValueList.map(keyValue=> {
            keyValue.value.map((kv: CooperativeDocument)=> {
              if(kv.document_type_id === doc.document_type_id) {
                doc.file_base_64 = kv.file_base_64;
              }
            });
          });
        });
      }
    }
  }

  setPublicCallDelivery() {
    const publicCall = this.publicCall!;
    this.publicCallDelivery = {
      id: publicCall.id,
      name: publicCall.name,
      process: publicCall.process,
      creation_date: new Date(),
      public_session_date: publicCall.public_session_date,
      registration_end_date: publicCall.registration_end_date,
      total_proposal: publicCall.foods[0].quantity,
      status: publicCall.status,
      food_id: publicCall.foods[0].food_id,
      food_name: publicCall.foods[0].food_name,
      measure_unit: publicCall.foods[0].measure_unit,
      delivery_progress: [],
      was_chosen: true,
      registrationDateIsGreaterThanToday: false
    };
  }

  async uploadFile(e: any) {
    const cooperative_id = $(".upload:hidden").attr('data-id');
    const cooperative = this.cooperatives.find(c => c.cooperative_id === cooperative_id && c.food_id == this.currentFood?.food_id);

    if (!cooperative) {
      this.notificationService.showWarning('Cooperativa não encontrada', 'Erro!');
      return;
    }

    const files: FileList = e.target.files;

    if (files.length == 0) {
        this.notificationService.showWarning('Nenhum arquivo foi selecionado', 'Erro!');
        return;
    }

    const fileToRead = files[0];
    const fileNameSplitted = fileToRead.name.split('.');
    const extension = fileNameSplitted[fileNameSplitted.length - 1].toLowerCase();

    if (fileNameSplitted.length <= 1 || extension !== 'xlsx') {
        this.notificationService.showWarning('Somente arquivos xlsx são permitidos', 'Erro!');
        return;
    }

    let lineNumber = -1;
    let csvLines: string[] = [];

    readXlsxFile(fileToRead)
      .then((lineArray) => {
        lineArray.forEach(line => {
          lineNumber++;
          
          if (lineNumber > 0) {
            line[5] = new Date(line[5].toString()).toISOString();
            const lineInQuotes = line.map(csv => `"${csv}"`);
            csvLines.push(`${lineInQuotes.join(';')}`);
          }
        });

        const csvFile = csvLines.join('\n');
        this.uploadFileExecution(csvFile, cooperative);
    });
  }

  uploadFileExecution(csvFile: string, cooperative: any) {
    this.clearInputFile();
    const fileBase64 = btoa(csvFile);
    const handledFileBase64 = fileBase64.replace('data:text/csv;base64,', '');

    this.publicCallService.validateMembers(cooperative.public_call_answer_id, handledFileBase64).subscribe({
      next: (ret) => {
        if (!ret) {
          this.notificationService.showError('Não foi possível validar estes cooperados', 'Erro');
          return;
        }

        if (ret.sucesso) {
          cooperative.members_validated = true;
          this.notificationService.showSuccess('Validação da lista de cooperados realizada com sucesso', 'Sucesso!');
          return;
        }

        const total_validated_members = ret.retorno.total_validated_members;
        const total_members = ret.retorno.total_members;
        const message = ret.retorno.total_validated_members === 0 ? 'Nenhum cooperado foi validado' : `Somente ${total_validated_members} de ${total_members} cooperados foram validados`;

        this.notificationService.showWarning(message, 'Erro');
      },
      error: (err) => {
        this.notificationService.showError('Não foi possível validar estes cooperados', 'Erro');
        console.log(err);
      }
    });
  }

  get cooperativesByProduct() {
    if (!this.cooperatives)
      return [];

    return this.cooperatives.filter(c => c.food_id === this.currentFood?.food_id);
  }

  get cooperativesSelectedByProduct() {
    if (!this.cooperatives)
      return [];

    return this.cooperatives.filter(c => c.food_id === this.currentFood?.food_id && c.was_chosen);
  }

  get selected() : CooperativeDeliveryInfo[] {
    if (!this.cooperatives)
      return [];

      return this.cooperatives.filter(c => c.is_selected);
  }

  get selectedQuantity(): number {
    if (!this.selected || this.selected.length <= 0)
      return 0;

    return this.selected.reduce((acc, item) => acc += (item.total_proposal_edited || item.total_proposal), 0);
  }

  get allCooperativesWasConfirmed() {
    return this.cooperatives.filter(c => c.was_chosen).every(c => c.was_confirmed);
  }
}
