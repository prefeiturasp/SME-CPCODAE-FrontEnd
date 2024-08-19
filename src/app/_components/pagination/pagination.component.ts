import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({ selector: 'app-pagination', templateUrl: './pagination.component.html', styleUrls: ['./pagination.component.scss'] })
export class PaginationComponent {
  private _totalItems: number = 0;
  private _totalVisiblePages: number = 7;

  public showFirst3Dots: boolean = false;
  public showLast3Dots: boolean = false;
  public totalPages: number = 0;

  @Input() currentPage: number = 1;
  @Input() pageSize: number | undefined = 10;

  @Input() set totalItems(value: number) {
    this._totalItems = value;
    
    this.totalPages = Math.ceil(this._totalItems / this.pageSize!);
    this.buildPageItems();
  }
  get totalItems(): number {
    return this._totalItems;
  }

  @Output() changePage = new EventEmitter<number>();

  public pageItems: number[] = [];

  constructor() {
  }

  buildPageItems() {
    this.pageItems = [];

    const startEndIndex = this.buildPageItemsGetStartEndIndex();

    const startIndex = startEndIndex.startIndex;
    const endIndex = startEndIndex.endIndex;
    
    for (let i = startIndex; i <= endIndex; i++) {
      this.pageItems.push(i);
    }
  }

  buildPageItemsGetStartEndIndex() : any {
    const pagesBeforeAfter = Math.floor(this._totalVisiblePages / 2) - 1;
    this.showFirst3Dots = this.currentPage - pagesBeforeAfter > 2;
    this.showLast3Dots = this.currentPage + pagesBeforeAfter < this.totalPages - 1;

    // Caso tenha menos páginas que o total de páginas visiveis, exibe todas
    if (this.totalPages <= this._totalVisiblePages)
      return { startIndex: 2, endIndex: this.totalPages - 1 };

    // Enquanto ainda não está mostrando os primeiros ...
    if (!this.showFirst3Dots)
    return { startIndex: 2, endIndex: this._totalVisiblePages - 1 };

    // Se está mostrando os primeiros ... e os últimos ...
    if (this.showLast3Dots)
      return { startIndex: this.currentPage - pagesBeforeAfter, endIndex: this.currentPage + pagesBeforeAfter };

    const firstLastPage = this.totalPages - (this._totalVisiblePages - 2);
    const startIndex = this.currentPage - pagesBeforeAfter > firstLastPage ? firstLastPage : this.currentPage - pagesBeforeAfter;
    const endIndex = this.currentPage + pagesBeforeAfter > this.totalPages - 1 ? this.totalPages - 1 : this.currentPage + pagesBeforeAfter;
    return { startIndex: startIndex, endIndex: endIndex };
  }

  downCurrentPage() {
    this.currentPage--;

    if (this.currentPage < 1)
      this.currentPage = 1;

    this.buildPageItems();
    this.changePage.emit(this.currentPage);
  }

  goToPage(page: number) {
    this.currentPage = page;

    this.buildPageItems();
    this.changePage.emit(this.currentPage);
  }

  upCurrentPage() {
    this.currentPage++;

    if (this.currentPage > this.totalPages)
      this.currentPage = this.totalPages;

    this.buildPageItems();
    this.changePage.emit(this.currentPage);
  }

  get showPagination(): boolean {
    return this.totalPages > 1;
  }
}
