import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CooperativeService } from 'src/app/cooperative/cooperative.service';
import { NotificationService } from 'src/app/_services/notification.service';

import { Cooperative } from 'src/app/_models/cooperative.model';
import { CooperativeDocument } from 'src/app/_models/cooperative-document.model';
import { SMEDocumentType } from 'src/app/_models/document-type.model';

import { faMagnifyingGlass, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';

declare const $: any;
declare const toBase64: any;

@Component({ selector: 'app-cooperative-registration-completion-step2-add', templateUrl: './registration-completion-step2-add.component.html', styleUrls: ['./registration-completion-step2-add.component.scss'] })
export class CooperativeRegistrationCompletionStep2AddComponent implements OnInit {
  @Input() cooperative!: Cooperative;
  @Input() documentTypes: SMEDocumentType[] = [];
  @Output() onShow = new EventEmitter<CooperativeDocument>();
  
  public faIcons: any;

  constructor(
    private cooperativeService: CooperativeService,
    private notificationService: NotificationService) { 
    this.faIcons = { show: faMagnifyingGlass, trash: faTrash, upload: faUpload };
  }

  ngOnInit(): void {
  }

  addDoc(document_type_id: string) {
    $(".upload:hidden").attr('data-id', document_type_id);
    $(".upload:hidden").trigger('click');
  }

  clearInputFile() {
    $(".upload:hidden").val('');
  }

  async remove(index: number, document_type_id: string) {
    if (!(await this.notificationService.showConfirm('Deseja realmente remover este documento?')))
      return;

    const documentType = this.cooperative.documents.find(d => d.document_type_id === document_type_id);

    if (!documentType || !documentType.id)
      return;

    this.cooperativeService.removeDocument(documentType.id!, this.cooperative.id).subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          documentType.document_path = '';
          this.notificationService.showSuccess('Documento removido com sucesso', 'Sucesso!');
        }
      },
      error: (err) => console.log(err)
    });
  }

  selectFile(e: any) {
    this.uploadFile(e.target.files);
  }

  show(document_type_id: string) {
    const document = this.cooperative.documents.find(d => d.document_type_id === document_type_id);
    this.onShow.emit(document);
  }

  async uploadFile(files: FileList) {
    if (files.length == 0) {
      this.notificationService.showWarning('Nenhum arquivo foi selecionado', 'Erro!');
      return;
    }

    const fileNameSplitted = files[0].name.split('.');
    if (fileNameSplitted.length <= 1 || fileNameSplitted[fileNameSplitted.length - 1].toLowerCase() !== 'pdf') {
      this.notificationService.showWarning('Somente arquivos pdf são permitidos', 'Erro!');
      return;
    }

    const document_type_id = $(".upload:hidden").attr('data-id');
    const documentType = this.cooperative.documents.find(d => d.document_type_id === document_type_id);
    const fileBase64 = await toBase64(files[0])

    if (!documentType || !fileBase64) {
      this.notificationService.showWarning('Não foi possível realizar o upload do documento', 'Erro!');
      this.clearInputFile();
      return;
    }

    const handledFileBase64 = fileBase64.replace('data:application/pdf;base64,', '');
    const fileSize = files[0].size;
    this.clearInputFile();

    this.cooperativeService.addDocument(documentType, handledFileBase64, fileSize)
      .subscribe({
        next:  (ret) => {
          if (ret && ret.sucesso) {
            documentType.id = ret.retorno.id;
            documentType.document_path = ret.retorno.document_path;
            documentType.file_name = ret.retorno.file_name;
            this.notificationService.showSuccess('Documento adicionado com sucesso', 'Sucesso!');
          }
        },
        error: (err) => console.log(err)
      });
  }


  get filteredDocuments(): CooperativeDocument[] {
    if (!this.cooperative || !this.cooperative.documents || this.cooperative.documents.length <= 0)
      return [];

    return this.cooperative.documents.filter(d => d.document_type_name);
  }
}