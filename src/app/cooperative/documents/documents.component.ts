import { Component, OnInit } from '@angular/core';

import { CooperativeService } from '../cooperative.service';
import { LoginService } from 'src/app/authorization/login/login.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { UtilsService } from 'src/app/_services/utils.service';

import { Cooperative } from 'src/app/_models/cooperative.model';
import { CooperativeDocument } from 'src/app/_models/cooperative-document.model';
import { SMEDocumentType } from 'src/app/_models/document-type.model';

declare const isEmpty: any;
declare const sort_by: any;

@Component({ selector: 'app-cooperative-documents', templateUrl: './documents.component.html', styleUrls: ['./documents.component.scss'] })
export class CooperativeDocumentsComponent implements OnInit {
    public cooperative!: Cooperative;
    public documentTypes: SMEDocumentType[] = [];
    public selectedDocument: CooperativeDocument | undefined;

    constructor(
        private cooperativeService: CooperativeService,
        private loginService: LoginService,
        private notificationService: NotificationService,
        private utilsService: UtilsService
    ) { }

    ngOnInit(): void {
        const cooperative = this.utilsService.localStorageUtils.getCooperative();

        if (isEmpty(cooperative)) {
            this.loginService.logout(true);
            return;
        }

        this.cooperativeService.get(cooperative!.id).subscribe({
            next: (ret) => {
                if (ret && ret.sucesso) {
                    this.cooperative = ret.retorno;

                    const currentDocuments = this.cooperative?.documents.filter(d => d.is_current && !d.public_call_id);
                    this.cooperative!.documents = Object.assign([], currentDocuments);

                    this.loadDocuments();
                }
            },
            error: (err) => console.log(err)
        });
    }

    loadDocuments() {
        this.selectedDocument = undefined;

        this.cooperativeService.getCooperativeDocumentTypes().subscribe({
            next: (ret) => {
                if (ret && ret.sucesso) {
                    this.documentTypes = ret.retorno;

                    if (!this.cooperative || !this.cooperative.documents)
                        this.cooperative!.documents = [];

                    this.documentTypes.forEach(dt => {
                        let document = this.cooperative!.documents.find(d => d.document_type_id === dt.id && d.is_current);

                        if (isEmpty(document)) {
                            this.cooperative!.documents.push({
                                cooperative_id: this.cooperative!.id,
                                document_type_id: dt.id,
                                document_type_name: dt.name
                            })
                        } else {
                            document!.document_type_name = dt.name;
                        }
                    });

                    this.cooperative.documents.sort(sort_by([{ name: 'document_type_name' }]));

                    if (this.cooperative!.documents.some(d => d.id)) {
                        this.selectedDocument = this.cooperative!.documents.filter(d => d.id)[0];
                    }

                } else {
                    this.notificationService.showWarning('Não foi possível carregar a lista de tipos de documento', 'Erro!');
                }
            },
            error: (err) => console.log(err)
        })
    }

    selectDocument($event: CooperativeDocument) {
        var link = document.createElement('a');
        link.href = $event.document_path!;
        link.download = `${$event.document_type_name!}.pdf`;
        link.dispatchEvent(new MouseEvent('click'));
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