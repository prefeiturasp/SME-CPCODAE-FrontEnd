import { Component, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { AdminPublicCallService } from 'src/app/admin/public-call/public-call.service';
import { NotificationService } from 'src/app/_services/notification.service';

import { CooperativeDeliveryInfo } from 'src/app/_models/cooperative-delivery-info.model';
import { CooperativeDocument, CooperativeDocumentGroupedDate } from 'src/app/_models/cooperative-document.model';
import { PublicCallFood } from 'src/app/_models/public-call-food.model';

import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { LocalStorageUtils } from 'src/app/_utils/localstorage';

declare const $: any;
declare const downloadFile: any;
declare const getDateWithoutTime: any;
declare const slugify: any;
declare const sort_by: any;
declare const toBase64: any;

@Component({ selector: 'public-call-attachment-modal', templateUrl: './public-call-attachment-modal.component.html', styleUrls: ['./public-call-attachment-modal.component.scss'] })
export class PublicCallAttachmentModalComponent {
    @Input() modal: any;
    @Input() public_call_id: string = '';
    @Input() cooperative!: CooperativeDeliveryInfo;
    @Input() food!: PublicCallFood;
    @Input() hasErrosCooperated: boolean = false;
    @Input() qtdErrosCooperated: any;
    @Input() isCardType: boolean = true;
    @Output() dataDocuments = new Subject();

    public documentsCurrent: CooperativeDocument[] = [];
    public documentsHistory: CooperativeDocumentGroupedDate[] = [];
    private _documents: CooperativeDocument[] = [];
    private localStorageUtils: LocalStorageUtils;

    public faIcons: any;

    @Input() 
    get documents(): CooperativeDocument[] {
      if (!this._documents)
        return [];

      return this._documents.filter(cr => cr.cooperative_id === this.cooperative.cooperative_id && (!cr.food_id || cr.food_id === this.food.food_id));
    };
    set documents(value: CooperativeDocument[]) {
      this._documents = value.filter(cr => cr.cooperative_id === this.cooperative.cooperative_id && (!cr.food_id || cr.food_id === this.food.food_id));
      this.documentsCurrent = this._documents.filter(d => d.is_current).sort(sort_by([{ 'name': 'file_name'}]));
      this.buildHistory(this._documents.filter(d => !d.is_current));
    }

    constructor(
      private adminPublicCallService: AdminPublicCallService,
      private notificationService: NotificationService) {
        this.faIcons = { info: faInfoCircle };
        this.localStorageUtils = new LocalStorageUtils();
      }

    buildHistory(documents: CooperativeDocument[]) {
      const groupsByDate = documents.reduce((groups: CooperativeDocumentGroupedDate[], document) => {

        const documentOriginalDate = new Date(document.creation_date!);
        const date = getDateWithoutTime(documentOriginalDate);
        const group = groups.find(g => getDateWithoutTime(g.creation_date).toISOString() === date.toISOString());

        if (!group)
          groups.push( { creation_date: date, documents: [ document ] });
        else
          group.documents.push(document);

        return groups;
      }, []);

      this.documentsHistory = groupsByDate;
      const hasDocsFiles = localStorage.getItem('docs');
      if(hasDocsFiles) {
        this.documentsCurrent = JSON.parse(hasDocsFiles);
      }
    }

    async changeDocument(event: any) {
      for(let i = 0; i <= event.target.files.length - 1; i++) {
        const fileBase64 = await toBase64(event.target.files[i]);
        const handledFileBase64 = fileBase64.replace('data:application/pdf;base64,', '');

        this.documentsCurrent.push({
            id: '',
            file_base_64: handledFileBase64,
            file_name: event.target.files[i]?.name,
            file_size: event.target.files[i]?.size,
            creation_date: new Date(),
            is_current: true
        });

        localStorage.setItem('docs', JSON.stringify(this.documentsCurrent));
      }
    }

    downloadAll() {
      this.adminPublicCallService.getCooperativeAllCurrentZippedDocuments(this.public_call_id, this.cooperative.cooperative_id).subscribe({
        next: (ret) => {
          if (ret && ret.sucesso) {
            const file_base_64 = ret.retorno;

            const url = 'data:application/pdf; base64,' + file_base_64;
            const filename = `${slugify(this.cooperative.name)}.pdf`;
            downloadFile(url, filename);
            this.notificationService.showSuccess('Download realizado com sucesso', 'Sucesso!');
          }
        },
        error: (error) => {
            console.log(error);
            this.notificationService.showWarning('Não foi possível fazer este download', 'Tente novamente mais tarde');
        }
      });
    }

    onDownload(id: string) {
      this.adminPublicCallService.getDocumentFileBase64(id).subscribe({
        next: (ret) => {
          if (ret && ret.sucesso) {
            const file_base_64 = ret.retorno;

            const url = 'data:application/pdf; base64,' + file_base_64;
            const filename = `${slugify(this.cooperative.name)}.pdf`;
            downloadFile(url, filename);
            this.notificationService.showSuccess('Download realizado com sucesso', 'Sucesso!');
          }
        },
        error: (error) => {
            console.log(error);
            this.notificationService.showWarning('Não foi possível fazer este download', 'Tente novamente mais tarde');
        }
      });
    }

    removeDocument(i:any) {
      this.documentsCurrent.splice(i, 1);
      $(".upload:hidden").val('');
    }

    sendData() {
      this.dataDocuments.next(this.documentsCurrent);
    }

    setAsReviewed($event: any, document_id: string) {
      const isReviewed = $($event.target).is(':checked');
      
      this.adminPublicCallService.setDocumentAsReviewed(document_id, isReviewed).subscribe({
        next: (ret) => {
          if (ret && ret.sucesso) {
            this.notificationService.showSuccess(`Documento ${isReviewed ? '' : 'des'}marcado como revisado`, 'Sucesso!');

            const user = this.localStorageUtils.getUser();
            let document = this.documents.find(d => d.id === document_id);
            document!.reviewed_date = isReviewed ? new Date() : undefined;
            document!.reviewer_name = isReviewed ? user?.name : undefined;
          }
        },
        error: (error) => {
            console.log(error);
            this.notificationService.showWarning('Não foi possível marcar este documento como revisado', 'Tente novamente mais tarde');
        }
      });
    }
}
