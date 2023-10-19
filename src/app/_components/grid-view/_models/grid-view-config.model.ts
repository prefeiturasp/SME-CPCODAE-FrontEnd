export class GridViewConfig {
    props: any[];
    searchFilter?: string;
    filterFn?: any;
    list: any[];
    pageSize?: number;
    emptyMessage: string;
    addButtonLabel?: string;
    showButtonArea?: boolean;
    showButtonEdit?: boolean;

    constructor() {
        this.props = [];
        this.searchFilter = '';
        this.list = [];
        this.pageSize = 10;
        this.emptyMessage = 'Nenhum item foi encontrado';
        this.addButtonLabel = 'Adicionar';
        this.showButtonArea = true;
        this.showButtonEdit = true;
    }
}