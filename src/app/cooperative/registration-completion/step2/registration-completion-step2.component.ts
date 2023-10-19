import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CooperativeService } from '../../cooperative.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { UtilsService } from 'src/app/_services/utils.service';

import { Cooperative } from 'src/app/_models/cooperative.model';
import { CooperativeDocument } from 'src/app/_models/cooperative-document.model';
import { SMEDocumentType } from 'src/app/_models/document-type.model';

declare const isEmpty: any;

@Component({ selector: 'app-cooperative-registration-completion-step2', templateUrl: './registration-completion-step2.component.html', styleUrls: ['./registration-completion-step2.component.scss'] })
export class CooperativeRegistrationCompletionStep2Component implements OnInit {
  public active: number = 1;
  public cooperative!: Cooperative;
  public documentTypes!: SMEDocumentType[];
  public selectedDocument: CooperativeDocument | undefined;

  constructor(
    private cooperativeService: CooperativeService,
    private notificationService: NotificationService,
    private utilsService: UtilsService,
    private route: ActivatedRoute,
    private router: Router) {
    const currentState: any = this.router.getCurrentNavigation()?.extras?.state;

    if (currentState) {
      this.cooperative = currentState.cooperative;
    }
  }

  ngOnInit(): void {
    if (!this.cooperative) {
      const id = this.route.snapshot.paramMap.get('id') ?? '';

      this.cooperativeService.get(id).subscribe({
        next: (ret) => {
          if (ret && ret.sucesso) {
            this.cooperative = ret.retorno;
            this.loadDocuments();
          } else {
            this.notificationService.showWarning('Não foi possível carregar os dados desta cooperativa', 'Erro!');
          }
        },
        error: (err) => {
          console.log(err);
        }
      });

      return;
    }

    this.loadDocuments();
  }

  completeRegistration() {
    const hasAllDocuments = this.cooperative.documents && this.cooperative.documents.filter(d => d.document_path).length === this.documentTypes.length;

    if (!hasAllDocuments) {
      this.notificationService.showWarning('É preciso adicionar todos os documentos', 'Erro!');
      return;
    }

    this.cooperativeService.saveStep3(this.cooperative.id).subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          this.notificationService.showSuccess('Cadastro concluído com sucesso', 'Sucesso!');
          this.utilsService.localStorageUtils.saveCooperative(ret.retorno);
          
          this.cooperativeService.cooperativeChanged.emit(ret.retorno);
          this.router.navigate([`/cooperativa`]);
        } else {
          this.notificationService.showWarning('Não foi possível atualizar os dados desta cooperativa', 'Erro!');
        }
      },
      error: (err) => console.log(err)
    })
  }

  getDocumentList(): CooperativeDocument[] {
    if (!this.documentTypes)
      return [];

    const documents = this.documentTypes.map(dt => {
      const cooperativeDocument = this.cooperative.documents?.find(d => d.document_type_id === dt.id && d.is_current)

      return ({
        id: cooperativeDocument?.id,
        creation_date: cooperativeDocument?.creation_date,
        cooperative_id: this.cooperative.id,
        document_type_id: dt.id,
        public_call_id: cooperativeDocument?.public_call_id,
        document_type_name: dt.name,
        document_path: cooperativeDocument?.document_path,
        file_name: cooperativeDocument?.file_name,
        file_size: cooperativeDocument?.file_size,
        is_current: true
      });
    });

    return documents;
  }

  goBack() {
    this.router.navigate([`/cooperativa/complete-seu-registro/passo-1/${this.cooperative.id}`], { state: { cooperative: this.cooperative } });
  }

  loadDocuments() {
    this.selectedDocument = undefined;

    this.cooperativeService.getCooperativeDocumentTypes().subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          this.documentTypes = ret.retorno;
          this.cooperative.documents = this.getDocumentList();

          if (this.cooperative.documents.some(d => d.id)) {
            this.selectedDocument = this.cooperative.documents.filter(d => d.id)[0];
          }

        } else {
          this.notificationService.showWarning('Não foi possível carregar a lista de tipos de documento', 'Erro!');
        }
      },
      error: (err) => console.log(err)
    })
  }

  selectDocument($event: CooperativeDocument) {
    this.selectedDocument = $event;
    this.active = 2;
  }

  get documentName(): string {
    if (isEmpty(this.selectedDocument) || isEmpty(this.selectedDocument!.document_path))
      return '';

    return ` - ${this.selectedDocument!.document_type_name!}`;
  }

  get pdfSrc(): string {
    if (isEmpty(this.selectedDocument) || isEmpty(this.selectedDocument!.document_path))
      return '';

    return this.selectedDocument!.document_path!;
  }
}