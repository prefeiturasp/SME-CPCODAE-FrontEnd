import { formatCurrency } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { NotificationService } from 'src/app/_services/notification.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { LocationService } from 'src/app/_services/location.service';
import { LoginService } from 'src/app/authorization/login/login.service';
import { MenuService } from 'src/app/navigation/menu/menu.service';
import { CooperativeService } from '../cooperative.service';
import { ProposalService } from './proposal.service';

import { GridViewConfig } from 'src/app/_components/grid-view/_models/grid-view-config.model';
import { Cooperative, CooperativeMember } from 'src/app/_models/cooperative.model';
import { PublicCallCategoryAnswer, PublicCallCategoryAnswerMember, PublicCallFoodCategoryAnswer } from 'src/app/_models/public-call-answer.model';
import { PublicCallFood } from 'src/app/_models/public-call-food.model';
import { PublicCall } from 'src/app/_models/public-call.model';
import { State } from 'src/app/_models/location.model';

import { faAdd, faArrowLeft, faArrowRight, faSave, faTimes, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import { CookieService } from 'ngx-cookie-service';
import { ChangeRequest } from 'src/app/_models/change-request.model';
import { CooperativeDocument } from 'src/app/_models/cooperative-document.model';
import { CooperativeProposalCheckoutComponent } from './checkout/proposal-checkout.component';

declare const $: any;
declare const groupByKey: any;
declare const isEmpty: any;
declare const onlyNumbers: any;
declare const toBase64: any;
declare const waitForElm: any;

@Component({ selector: 'app-cooperative-proposal', templateUrl: './proposal.component.html', styleUrls: ['./proposal.component.scss'] })
export class ProposalComponent implements OnInit {
  @ViewChild('contentAttachment') contentAttachment: any;
  @ViewChild('contentChangeRequests') contentChangeRequests: any;
  @ViewChild('contentErrors') contentErrors: any;
  @ViewChild('contentComments') contentComments: any;
  @ViewChild('checkout') checkout!: CooperativeProposalCheckoutComponent;

  public faIcons: any;

  public id: string = '';
  public food_id: string = '';
  public config: GridViewConfig = new GridViewConfig();
  public cooperative: Cooperative | null = null;
  public publicCall: PublicCall | null = null;
  public publicCallAnswer: PublicCallCategoryAnswer | null = null;
  public messages: ChangeRequest[] = [];
  public statesList: State[] = [];

  public isEditProposal: boolean = false;
  public editMode: boolean = false;
  public selectedFood: PublicCallFood | null = null;
  public selectedFoodId: string = '';

  public searchMember: string = 'name';
  public selectedMember: CooperativeMember | null = null;
  public selectedMemberAnswer: PublicCallCategoryAnswerMember = new PublicCallCategoryAnswerMember();
  public newMembersUploaded: boolean = false;
  public showUploadLink: boolean = true;

  public showPage: boolean = false;
  public errors: any[] = [];
  public documents: CooperativeDocument[] = [];

  currentStep = 1;
  cookieName = 'publicCallAnswer';
  keyValueList: { key: string, value: any }[] = [];
  filteredFoods: any[] | undefined;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private cooperativeService: CooperativeService,
    private locationService: LocationService,
    private loginService: LoginService,
    private menuService: MenuService,
    private notificationService: NotificationService,
    private proposalService: ProposalService,
    private utilsService: UtilsService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.currentStep = 1;
    this.faIcons = { add: faAdd, arrowLeft: faArrowLeft, arrowRight: faArrowRight, faTrash, faUpload, save: faSave, times: faTimes };
    
    this.locationService.getStatesJSON().subscribe({
      next: (retS) => {
        this.statesList = retS;
      },
      error: (errS) => {
        console.log(errS);
      }
    });

    localStorage.removeItem('memberInfo');
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.food_id = this.route.snapshot.params['food_id'];

    if(this.cookieService.check(this.cookieName)){
      this.cookieService.delete(this.cookieName);
    }
    this.isEditProposal = window.location.href.indexOf('edicao-proposta') > -1 && !isEmpty(this.food_id);

    this.buildConfig();

    this.menuService.showSearchFilter = false;
    this.proposalService.clickGeneralInfoPanelEvent.subscribe({ next: ($event: any) => { this.generalInfoPanelChanged($event); } });

    const cooperative = this.utilsService.localStorageUtils.getCooperative();

    if (!cooperative) {
      this.loginService.logout();
    }

    this.loadInitialData(cooperative!);
  }

  addCoop(showNotification: boolean = true) {
    this.selectedMemberAnswer.formatted_price = formatCurrency(this.selectedMemberAnswer.price, this.locale, 'R$');
    this.selectedMemberAnswer.formatted_quantity = `${this.selectedMemberAnswer.quantity} ${this.selectedFood!.measure_unit}`;
    this.selectedMemberAnswer.formatted_total = formatCurrency(this.selectedMemberAnswer.price * this.selectedMemberAnswer.quantity, this.locale, 'R$');

    let addedMembers = Object.assign([], this.publicCallAnswer!.members);
    addedMembers.push(this.selectedMemberAnswer);

    this.publicCallAnswer!.members = Object.assign([], addedMembers);
    this.config.list = this.publicCallAnswer!.members;

    this.clearCoop();

    if (showNotification)
      this.notificationService.showSuccess('Cooperado adicionado com sucesso', 'Sucesso!');
  }

  addDoc(document_type_id: string) {
    $(".upload-documents:hidden").attr('data-id', document_type_id);
    $(".upload-documents:hidden").trigger('click');
  }

  buildConfig() {
    this.config = Object.assign(new GridViewConfig(), {
      list: [],
      showButtonArea: false,
      pageSize: 10,
      filterFn: this.publicCallAnswer?.members,
      emptyMessage: 'Clique no link "Importe os cooperados aqui" para iniciar'
    });
  }

  cancelEditMode() {
    this.editMode = false;
    this.clearCoop();
  }

  changePriceQuantity($event: any) {
    if (this.selectedMemberAnswer.price > this.selectedFood!.price * 1.3) {
      this.selectedMemberAnswer.price = this.selectedFood!.price * 1.3;

      this.notificationService.showWarning(`O valor do produto deve ser no máximo 30% maior do que o proposto (${formatCurrency(this.selectedMemberAnswer.price, this.locale, 'R$')})`, 'Erro!');
    }

    // Valida que o cooperado não tenha estourado o seu limite anual de fornecimento ((quantidade * preço) + ja_fornecido <= limite)
    const totalPrice = this.selectedMemberAnswer.quantity * this.selectedMemberAnswer.price;
    const total_year_supplied_value = this.selectedMember!.total_year_supplied_value ?? 0;
    let maximumAllowed = this.utilsService.maximum_year_supplied_value - total_year_supplied_value;

    if (totalPrice > maximumAllowed) {
      maximumAllowed = maximumAllowed < 0 ? 0 : maximumAllowed;

      let newQuantity = parseFloat((Math.round((maximumAllowed / this.selectedMemberAnswer.price) * 100) / 100).toFixed(2));

      // Ajusta o arredondamento
      if ((newQuantity * this.selectedMemberAnswer.price) > maximumAllowed)
        newQuantity -= 0.01;

      this.selectedMemberAnswer.quantity = newQuantity;

      this.notificationService.showWarning(`Este cooperado pode fornecer até (${formatCurrency(maximumAllowed, this.locale, 'R$')}) este ano`, 'Erro!');
    }
  }

  clearCoop() {
    $('.not-found').hide();

    this.selectedMember = new CooperativeMember();
    this.selectedMemberAnswer = new PublicCallCategoryAnswerMember();
  }

  clearInputFile() {
    $(".upload-documents:hidden").val('');
  }

  customFilterMember(members: CooperativeMember[], query: string): CooperativeMember[] {
    this.searchMember = query;

    const result = members.filter(m =>
      m.name.toLowerCase().indexOf(query) >= 0
      || m.dap_caf_code.toLowerCase().indexOf(query) >= 0
      || (m.cpf && onlyNumbers(m.cpf).indexOf(query) >= 0)
    );

    return result;
  }

  editCoop($event: any) {
    const selectedAnswerMember = this.publicCallAnswer!.members.find(m => m.id == $event);

    if (!selectedAnswerMember)
      return;

    this.selectedMember = this.cooperative!.members.find(m => m.id == selectedAnswerMember.id) ?? new CooperativeMember();
    this.selectedMemberAnswer = Object.assign({}, selectedAnswerMember);
    this.editMode = true;
  }

  async editFood() {
    if (!isEmpty(this.publicCallAnswer!.members) && !(await this.notificationService.showConfirm('Todos os cooperados adicionados a este produto serão removidos. Deseja realmente continuar?')))
      return;

    this.publicCallAnswer!.members = [];
    this.config.list = this.publicCallAnswer!.members;
    this.selectedFood = null;
    this.showPage = false;
    this.cancelEditMode();
  }

  generalInfoPanelChanged($event: any) {
    $('.proposal-body perfect-scrollbar').removeClass('panel-opened');

    if ($event.nextState) {
      $('.proposal-body perfect-scrollbar').addClass('panel-opened');
    }
  }

  getObject(object: any) : any {
    const result = Object.assign({}, JSON.parse(JSON.stringify(object ?? {})));
    return isEmpty(result) ? undefined : result;
  }

  getObjectFromList(list: any[], key: string, value: string) : any {
    const result = list && list.find(x=> x[key] === value);

    return this.getObject(result);
  }

  getObjectList(list: any[]) : any[] {
    return Object.assign([], JSON.parse(JSON.stringify(list ?? '[]')));
  }

  getFoodById(selectedFoodId: string) {
    const selectedFood = this.publicCall!.foods.find(f => f.food_id == selectedFoodId) ?? new PublicCallFood();
    return selectedFood;
  }

  getNextFood(): any {
    if (!this.selectedFood)
      return null;

    let nextFood : any | null = {
      food_id: this.selectedFoodId,
      food_name: this.selectedFood!.food_name,
      measure_unit: this.selectedFood!.measure_unit,
      quantity: this.selectedFood!.quantity,
      is_organic: this.selectedFood!.is_organic,
      members: this.publicCallAnswer!.members,
      total_proposto: this.totalProposto,
      quantidade_proposta: this.quantidadeProposta
    };
    return nextFood;
  }

  importCoop(content: any) {
    this.clearCoop();
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  loadMessages(loadAnswerData: boolean) {
    this.cooperativeService.getMessages().subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          const visibleMessages = ret.retorno.filter((m: ChangeRequest) => !m.not_visible);
          const currentMessageIsInvisible = ret.retorno[0].not_visible;
          this.messages = groupByKey(visibleMessages, 'public_call_id')[this.publicCall!.id];

          if (this.messages && this.messages.length > 0 && !this.messages[0].is_response) {
            this.showUploadLink = this.messages[0].requires_new_upload;
            this.newMembersUploaded = !this.showUploadLink;
            this.openModal(this.contentComments);
          }

          if (loadAnswerData && !currentMessageIsInvisible)
            this.loadProposalAnswer();
        }
      },
      error: (err) => console.log(err)
    })
  }

  loadInitialData(cooperative: Cooperative) {
    this.cooperativeService.get(cooperative.id).subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          this.cooperative = ret.retorno;

          if (this.isEditProposal) {
            this.loadProposalInfo(true);
            return;
          }

          this.cooperativeService.checkIfIsAlreadyAnswer(cooperative.id, this.id).subscribe({
            next: (retAA) => {
              if (retAA && retAA.sucesso && !retAA.retorno) {
                this.loadProposalInfo(false);
                return;
              }

              this.notificationService.showWarning('Você já está participando desta chamada', '');
              this.router.navigate(['/cooperativa/minhas-propostas']);
            },
            error: (errAA) => {
              console.log(errAA);
            }
          });
        } else {
          this.loginService.logout();
        }
      },
      error: (err) => {
        console.log(err);
        this.loginService.logout();
      }
    });
  }

  loadProposalAnswer() {
    this.proposalService.getData(this.id, this.cooperative!.id, this.food_id).subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          this.publicCallAnswer = ret.retorno.answer;
          let members = this.messages[0].requires_new_upload ? [] : ret.retorno.members;
          this.selectedFood!.is_organic = ret.retorno.answer.is_organic;

          this.onSaveImport(members, !this.showUploadLink);
          this.loadRequiredDocumentsList(ret.retorno.requiredDocuments);
        }
      },
      error: (err) => console.log(err)
    });
  }

  loadProposalInfo(loadAnswerData: boolean) {
    this.proposalService.get(this.id).subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          this.publicCall = ret.retorno;

          if (this.publicCall!.foods.length >= 1) {
            this.selectedFoodId = this.isEditProposal ? this.food_id : this.publicCall!.foods[0].food_id;
            this.selectFood(this.publicCall!.foods[0]);

            if (this.isEditProposal) {
              const index = this.publicCall!.foods.findIndex(f => f.food_id === this.selectedFoodId) + 1;
              this.currentStep = index;
            }
          }

          if (loadAnswerData) {
            this.loadMessages(loadAnswerData);
          } else
            this.loadRequiredDocumentsList([]);
        }
      },
      error: (error) => {
        console.log(error);
        this.notificationService.showWarning('Não foi possível carregar esta chamada', 'Tente novamente mais tarde');
      }
    });
  }

  loadRequiredDocumentsList(requiredDocuments: any[]) {
    const documents = this.publicCall!.documents.filter(x=> x.food_id === null || x.food_id === this.selectedFoodId);

    this.documents = documents.filter((d: any) =>
            (this.isEditProposal) ? requiredDocuments.some(rd => rd.document_type_id === d.document_type_id) : true);

    // this.documentTypeService.getAll().subscribe({
    //   next: (ret) => {
    //     if (ret && ret.sucesso) {
    //       let documents = ret.retorno.filter((d: SMEDocumentType) => (d.application === 1 || d.application === 3) && d.is_active);
    //         documents.forEach((d: any) => { d.document_type_name = d.name; d.document_type_id = d.id });

    //       this.documents = documents.filter((d: any) =>
    //         (this.isEditProposal) ? requiredDocuments.some(rd => rd.document_type_id === d.document_type_id) : true);
    //     }
    //   },
    //   error: (error) => {
    //     console.log(error);
    //     this.notificationService.showWarning('Não foi possível carregar a lista de documentos obrigatórios', 'Tente novamente mais tarde');
    //   }
    // });
  }

  onCooperatedList(event: any) {
    event.subscribe((list: any) => {

    })
  }

  onSaveImport(list: PublicCallCategoryAnswerMember[], newMembersUploaded: boolean) {
    this.errors = [];

    const newMembers = Object.assign([], list);

    this.publicCallAnswer!.members = newMembers;
    this.config.list = newMembers;

    let currentFilledFood = this.publicCallAnswer!.foods && this.publicCallAnswer!.foods.find(x=> x.food_id === this.selectedFoodId);

    if (currentFilledFood) {
        currentFilledFood.members = newMembers;
        currentFilledFood.total_proposto = this.totalProposto;
        currentFilledFood.quantidade_proposta = this.quantidadeProposta;
        currentFilledFood.is_organic = this.selectedFood!.is_organic;
    }

    this.newMembersUploaded = newMembersUploaded;
    localStorage.removeItem('docs');

    if (!this.isEditProposal)
      this.setCurrentStepExecution(this.currentStep - 1);
  }

  openModalErrors() {
    this.modalService.open(this.contentErrors, { centered: true, size: 'lg' });
  }

  openModal(content: any) {
    this.modalService.open(content, { centered: true });
  }

  async openProposalBody() {
    this.showPage = true;

    if ($('#publicacao-abertura').is(':visible')) {
      const elm = await waitForElm('.proposal-body perfect-scrollbar');

      $(elm).addClass('panel-opened');
    }
  }

  removeCoop($event: any, showNotification: boolean = true) {
    if ($event.index >= 0)
      this.publicCallAnswer!.members.splice($event.index, 1);

    if (showNotification)
      this.notificationService.showSuccess('Cooperado removido com sucesso', 'Sucesso!');
  }

  async removeDoc(index: number, document_type_id: string) {
    // if (!(await this.notificationService.showConfirm('Deseja realmente remover este documento?')))
    //   return;

    const documentType = this.documents.find(d => d.id === document_type_id);

    if (!documentType || !documentType.id)
      return;

    documentType.file_base_64 = undefined;
    $(".upload-documents:hidden").val('');
  }

  async restart() {
    if (!(await this.notificationService.showConfirm('Deseja realmente reiniciar a proposta?')))
        return;

    this.clearCoop();
    this.onSaveImport([], false);
    let publicCallAnswer : PublicCallCategoryAnswer = Object.assign({}, JSON.parse(JSON.stringify(this.publicCallAnswer!)));
    let index = this.publicCallAnswer!.foods.findIndex(x=> x.food_id === this.selectedFoodId);

    if (index >= 0) {
        publicCallAnswer.foods.splice(index, 1);
    }

    this.documents.filter(d => d.food_id === this.selectedFoodId).map(d => d.file_base_64 = undefined);
    
    if (publicCallAnswer)
      this.updateFilteredFoods(publicCallAnswer);
  }

  selectCoop(selectedMember: any) {
    this.selectedMemberAnswer = Object.assign(new PublicCallCategoryAnswerMember(), selectedMember);

    this.selectedMemberAnswer.food_id = this.selectedFood!.food_id;
    this.selectedMemberAnswer.food_name = this.selectedFood!.food_name;
    this.selectedMemberAnswer.price = this.selectedFood!.price;
    this.selectedMemberAnswer.is_organic = this.selectedFood!.is_organic;
  }

  selectFood(currentFilledFood: any) {
    this.selectedFood = this.getObjectFromList(this.publicCall!.foods, 'food_id', this.selectedFoodId) ?? new PublicCallFood();
    this.publicCallAnswer = JSON.parse(JSON.stringify(this.publicCallAnswer ?? new PublicCallCategoryAnswer(this.publicCall!.id, this.cooperative!.id)));

    if (currentFilledFood) {
      this.selectedFood!.is_organic = currentFilledFood.is_organic;
    }

    if (!this.publicCallAnswer!.foods)
      this.publicCallAnswer!.foods = [];

    if ((currentFilledFood && (!this.publicCallAnswer!.foods || this.publicCallAnswer!.foods.length === 0)) || !this.publicCallAnswer!.foods.find(x=> x.food_id === currentFilledFood.food_id)) {
      this.publicCallAnswer!.foods.push(currentFilledFood);
    }

    const members = this.getObjectList(currentFilledFood!.members ?? []);
    this.publicCallAnswer!.members = members;

    this.setCurrentFoodDocuments();
    this.loadRequiredDocumentsList([]);
  }

  sendProposal() {
    if (!this.newMembersUploaded) { // && !this.proposalForm.pristine) {
      this.notificationService.showWarning('É obrigatório importar os cooperados', 'Alerta!')
      return;
    }

    if(this.isEditProposal && this.showUploadLink && this.documents.length > 0 && this.documents.filter(x=> !x.file_base_64).length > 0){
      this.notificationService.showWarning('Selecione todos os documentos obrigatórios', 'Alerta!')
      return;
    }

    if (this.isEditProposal) {
      this.openModal(this.contentChangeRequests);
      return;
    }

    if (!this.checkout?.validate()) {
      return;
    }

    this.publicCallAnswer!.foods.forEach(food => {
      food.city_id = this.checkout.proposalForm!.value.city_id;
      food.city_members_total = this.checkout.proposalForm!.value.city_members_total;
      food.daps_fisicas_total = this.checkout.proposalForm!.value.daps_fisicas_total;
      food.indigenous_community_total = this.checkout.proposalForm!.value.indigenous_community_total;
      food.other_family_agro_total = this.checkout.proposalForm!.value.other_family_agro_total;
      food.pnra_settlement_total = this.checkout.proposalForm!.value.pnra_settlement_total;
      food.quilombola_community_total = this.checkout.proposalForm!.value.quilombola_community_total;
    });

    this.sendProposalExecution();
  }

  sendUpdateProposal($event: any) {
    this.sendProposalExecution($event);
  }

  async sendProposalExecution(changeRequest?: any) {
    if (!(await this.notificationService.showConfirm('Deseja realmente enviar sua proposta?')))
      return;

    let publicCallAnswer = Object.assign({}, this.publicCallAnswer!);
    if (publicCallAnswer && publicCallAnswer.foods) {
      publicCallAnswer.foods = publicCallAnswer.foods.filter(x => x.members && x.members.length > 0);
    }

    if(this.isEditProposal){
      publicCallAnswer.foods = [];
      publicCallAnswer.foods.push(this.getNextFood());
      publicCallAnswer.foods[0].documents = this.documents;
    }
    else {
      publicCallAnswer?.foods.forEach(food=> {
        this.keyValueList.forEach(keyValue=> {
          if (keyValue.key === food.food_id) {
            food.documents = keyValue.value;
          }
        });
      });
    }

    this.proposalService.sendProposal(publicCallAnswer, this.isEditProposal, this.showUploadLink, changeRequest)
      .subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          this.notificationService.showSuccess(`Proposta enviada com sucesso`, 'Sucesso!');
          this.router.navigate(['/cooperativa/minhas-propostas']);
          localStorage.removeItem('docs');
        }
      },
      error: (error) => {
        console.log(error);
        this.notificationService.showWarning('Não foi possível enviar sua proposta', 'Tente novamente mais tarde');
      }
    });
  }

  setCurrentStep(step: number) {
    if (step >= this.publicCall!.foods.length + 1) {
      this.setCurrentStepCheckout();
      return;
    }

    const isStepBack = this.currentStep > step;
    const documents = this.documents.filter(d => d.file_base_64);

    const isValid = this.setCurrentStepValidation(isStepBack, documents);

    if (!isValid)
      return;
      
    this.currentStep = step;
    this.selectedFood = (step - 1) >= this.publicCall!.foods.length ? null : this.getObject(this.publicCall!.foods[(step - 1)]);
    this.selectedFoodId = this.selectedFood?.food_id ?? '';

    this.publicCallAnswer!.members = [];

    this.setCurrentStepExecution(step - 1);
  }

  setCurrentStepExecution(index: number) {
    this.setDocuments();

    // Seleciona o próximo alimento
    const nextFoodId = this.publicCall?.foods[index]?.food_id;
    let nextFilledFood = this.getObjectFromList(this.publicCallAnswer!.foods, 'food_id', nextFoodId!);

    if (!nextFilledFood)
      nextFilledFood = this.getNextFood();

    if (nextFoodId) {
      this.selectedFoodId = nextFoodId;
      this.selectFood(nextFilledFood);
    }

    this.updateFilteredFoods(this.publicCallAnswer!);
  }

  setCurrentStepValidation(isStepBack: boolean, documents: CooperativeDocument[]) : boolean {
    if (!isStepBack && this.publicCallAnswer!.members && this.publicCallAnswer!.members.length > 0 && documents.length !== this.documents.length) {
      this.notificationService.showWarning('Selecione todos os documentos obrigatórios', 'Alerta!')
      return false;
    }

    return true;
  }

  setCurrentStepCheckout() {
    const documents = this.documents.filter(d => d.file_base_64);
    const isValid = this.setCurrentStepValidation(false, documents);

    if (!isValid)
      return;

    this.setDocuments();

    this.currentStep = this.publicCall!.foods.length + 1;
  }

  setCurrentFoodDocuments() {
    this.documents.map(doc=> { doc.file_base_64 = undefined; });

    this.documents.forEach(doc=> {
      this.keyValueList.forEach(keyValue=> {
        keyValue.value.forEach((kv: CooperativeDocument)=> {
          if(kv.document_type_id === doc.document_type_id) {
            doc.file_base_64 = kv.file_base_64;
          }
        });
      });
    });
  }

  setDocuments() {
    const selectedFoodId: string = Object.assign([], this.selectedFoodId).join('');
    const documents = this.documents.filter(d => d.file_base_64);
    const newDocuments = this.getObjectList(documents);
    const isNew = this.keyValueList.filter(x=> x.key == selectedFoodId).length === 0;

    if (!newDocuments || newDocuments.length === 0)
      return;

    if(isNew) {
      this.keyValueList.push({ key: selectedFoodId, value: newDocuments });
    } else {
      this.keyValueList.find(x=> x.key == selectedFoodId)!.value = newDocuments;
    }
  }

  updateCoop() {
    const index = this.publicCallAnswer!.members.findIndex(m => m.id === this.selectedMemberAnswer.id && m.food_id === this.selectedMemberAnswer.food_id);

    this.removeCoop({ index, id: '' }, false);
    this.addCoop(false);

    this.cancelEditMode();
    this.notificationService.showSuccess('Cooperado atualizado com sucesso', 'Sucesso!');
  }

  updateFilteredFoods(publicCallAnswer: PublicCallCategoryAnswer) {
    if (publicCallAnswer && publicCallAnswer.foods) {
      this.filteredFoods = publicCallAnswer.foods.filter(food => food.members && food.members.length > 0);
    } else {
      this.filteredFoods = [];
    }
  }

  async uploadFile(e: any) {
    const files: FileList = e.target.files;

    if (files.length == 0) {
        this.notificationService.showWarning('Nenhum arquivo foi selecionado', 'Erro!');
        return;
    }

    const fileToRead = files[0];
    const fileNameSplitted = fileToRead.name.split('.');
    if (fileNameSplitted.length <= 1 || fileNameSplitted[fileNameSplitted.length - 1].toLowerCase() !== 'pdf') {
        this.notificationService.showWarning('Somente arquivos pdf são permitidos', 'Erro!');
        return;
    }

    const fileBase64 = await toBase64(fileToRead)

    if (!this.selectedFood!.id || !fileBase64) {
        this.notificationService.showWarning('Não foi possível realizar o upload do documento', 'Erro!');
        return;
    }

    const handledFileBase64 = fileBase64.replace('data:application/pdf;base64,', '');
    const document_type_id = $(".upload-documents:hidden").attr('data-id');
    const document = this.documents.find(d => d.id === document_type_id);

    if (!document) {
      this.notificationService.showWarning('Ocorreu um erro ao tentar realizar o upload do documento', 'Erro!');
      return;
    }

    document.file_base_64 = handledFileBase64;
    document.file_size = fileToRead.size.toString();
    this.clearInputFile();

    this.setDocuments();
  }

  get backPage(): string {
    return `/chamadas-publicas/${this.id}`;
  }

  get isCheckoutEnabled(): boolean {
    return (this.filteredFoods && this.filteredFoods.length > 0) || this.isReadyToSend;
  }

  get isReadyToSend(): boolean {
    if (!this.publicCallAnswer || !this.publicCallAnswer.members || this.publicCallAnswer.members.length === 0)
      return false;

    const foods = this.publicCallAnswer?.foods;
    const allMembers = foods?.flatMap((food) => food.members && food.members.map((member) => member)) || [];
    const combinedMembers = [...allMembers, ...this.publicCallAnswer!.members];
 
    return !isEmpty(this.publicCallAnswer) && !isEmpty(combinedMembers);
  }

  get membersToBeSelected(): CooperativeMember[] {
    if (!this.cooperative || !this.cooperative.members || this.cooperative.members.length === 0 || !this.publicCall || !this.publicCall.foods || !this.publicCallAnswer)
      return [];

    const totalFoods = this.publicCall.foods.filter(f => f.food_id === this.selectedFoodId).length;

    return this.cooperative.members.filter(m => this.publicCallAnswer!.members.filter(am => am.id === m.id).length < totalFoods);
  }

  get quantidadeProposta(): number {
    if (!this.publicCallAnswer || !this.publicCallAnswer.members)
      return 0;

    let total = 0;

    this.publicCallAnswer.members.forEach((item) => total += item.quantity);

    return total;
  }

  get totalProposto(): number {
    if (!this.publicCallAnswer || !this.publicCallAnswer.members)
      return 0;

    let total = 0;

    this.publicCallAnswer.members.forEach((item) => total += (item.price * item.quantity));

    return total;
  }
}
