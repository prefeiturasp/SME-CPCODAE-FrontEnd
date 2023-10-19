import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PublicCall } from 'src/app/_models/public-call.model';

import { SettingsService } from 'src/app/_services/settings.service';

@Injectable({ providedIn: 'root', })
export class AdminPublicCallService {
    private domain: string = 'chamadas-publicas';

    constructor(private settingsService: SettingsService) { }

    add(publicCall: PublicCall) {
        return this.settingsService.executePost(this.domain, publicCall);
    }

    buy(public_call_id: string, selectedCooperatives: any[], deliveries: any[]): Observable<any> {
        const url = `${this.domain}/${public_call_id}/buy`;
        return this.settingsService.executePost(url, { selectedCooperatives, deliveries });
    }

    changeRequest(public_call_id: string, cooperative_id: string, food_id: string, title: string, message: string, response_date: Date,
        requires_new_upload: boolean, refused_documents: string[]): Observable<any> {
        const body = { public_call_id, cooperative_id, food_id, title, message, response_date, requires_new_upload, refused_documents };
        const url = `${this.domain}/${public_call_id}/change-request/${cooperative_id}/${food_id}`;
        return this.settingsService.executePost(url, body);
    }

    changeStatus(public_call_id: string, status_id: number): Observable<any> {
        const url = `${this.domain}/${public_call_id}/change-status/${status_id}`;
        return this.settingsService.executePatch(url, { });
    }

    confirmDeliveryPost(public_call_answer_id: string, delivered_date: Date, delivered_quantity: number): Observable<any> {
        const url = `${this.domain}/add-delivery/${public_call_answer_id}`;
        const body = { delivered_date, delivered_quantity };
        return this.settingsService.executePost(url, body);
    }

    confirmDeliveryPut(id: string, delivered_date: Date, delivered_quantity: number): Observable<any> {
        const url = `${this.domain}/confirm-delivery/${id}`;
        const body = { delivered_date, delivered_quantity };
        return this.settingsService.executePut(url, body);
    }

    delete(id: string): Observable<any> {
        const url = `${this.domain}/${id}`;
        return this.settingsService.executeDelete(url);
    }

    downloadValidationReport(public_call_answer_id: string): Observable<any> {
        const url = `${this.domain}/validation-report/${public_call_answer_id}`;
        return this.settingsService.executeGet(url);
    }

    get(id: string): Observable<any> {
        const url = `${this.domain}/${id}`;
        return this.settingsService.executeGet(url);
    }

    getAll(): Observable<any> {
        return this.settingsService.executeGet(this.domain);
    }

    getAllDashboard(): Observable<any> {
        const url = `${this.domain}/dashboard`;
        return this.settingsService.executeGet(url);
    }

    getAllChangeRequestHistory(public_call_id: string): Observable<any> {
        const url = `${this.domain}/${public_call_id}/change-request/history`;
        return this.settingsService.executeGet(url);
    }

    getAllCooperativesAvailableToBeChosen(id: string): Observable<any> {
        const url = `${this.domain}/${id}/cooperatives`;
        return this.settingsService.executeGet(url);
    }

    getAllCooperativesDeliveryInfo(id: string): Observable<any> {
        const url = `${this.domain}/${id}/delivery-info`;
        return this.settingsService.executeGet(url);
    }

    getAllDocumentsFromCooperative(public_call_id: string): Observable<any> {
        const url = `${this.domain}/${public_call_id}/attachments`;
        return this.settingsService.executeGet(url);
    }

    getCooperativeAllCurrentZippedDocuments(public_call_id: string, cooperative_id: string): Observable<any> {
        const url = `${this.domain}/${public_call_id}/attachments/${cooperative_id}/zip`;
        return this.settingsService.executeGet(url);
    }

    getDocumentFileBase64(document_id: string): Observable<any> {
        const url = `${this.domain}/attachments/${document_id}/pdf`;
        return this.settingsService.executeGet(url);
    }

    removeDelivery(id: string): Observable<any> {
        const url = `${this.domain}/delete-delivery/${id}`;
        return this.settingsService.executeDelete(url);
    }

    setDocumentAsReviewed(id: string, is_reviewed: boolean): Observable<any> {
        const url = `${this.domain}/review-document/${id}`;
        const body = { is_reviewed };
        return this.settingsService.executePatch(url, body);
    }

    suspend(id: string): Observable<any> {
        const url = `${this.domain}/suspend/${id}`;
        return this.settingsService.executeDelete(url);
    }

    update(publicCall: PublicCall) {
        return this.settingsService.executePut(this.domain, publicCall);
    }

    validateMembers(public_call_answer_id: string, file_base_64: string) {
        const url = `${this.domain}/validate-members/${public_call_answer_id}`;
        const body = { file_base_64 };
        return this.settingsService.executePost(url, body);
    }
}
