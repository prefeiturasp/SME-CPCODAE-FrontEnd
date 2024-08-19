import { Component, Input } from '@angular/core';

import { PublicCallDocumentFoods } from 'src/app/_models/public-call-document.model';

declare const $: any;

@Component({ selector: 'app-public-call-food-document-modal', templateUrl: './public-call-food-document-modal.component.html', styleUrls: ['./public-call-food-document-modal.component.scss'] })
export class AdminPublicCallFoodDocumentModalComponent {
  @Input() modal: any;
  @Input() foodId!: string;
  @Input() foodName!: string;

  public selectedDocuments: any[] = [];
  private _documentsList: PublicCallDocumentFoods[] = [];
  @Input() get documentsList(): PublicCallDocumentFoods[]
  {
    return this._documentsList;
  }
  set documentsList(value: PublicCallDocumentFoods[]) {
    this._documentsList = value;
    this.selectedDocuments = $.extend(true, [], value);;

    this.selectedDocuments.map(d => {
      d.is_associated = d.foods.filter((f: any) => f.food_id === this.foodId).some((f: any) => f.is_associated);
      return d;
    });
    
    setTimeout(() => this.setAllSelected(), 10);
  }

  constructor() { }

  save() {
    this.documentsList.forEach(d => {
      const isAssociated = $(`.document[document-id="${d.document_type_id}"]`).is(':checked');
      d.foods.find(f => f.food_id === this.foodId)!.is_associated = isAssociated;
    });

    this.modal.dismiss('Save click');
  }

  setAllSelected() {
    const isAllSelected = $(".document").length === $(".document:checked").length;
    $('.document-all').prop('checked', isAllSelected)
  }

  toggleSelectedDocuments() {
    const isSelected = $('.document-all').is(':checked');
    $('.document').prop('checked', isSelected);
  }
}
