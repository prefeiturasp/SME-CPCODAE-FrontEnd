import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output, ViewChild } from '@angular/core';
import { formatCurrency } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import readXlsxFile from 'read-excel-file'

import { NotificationService } from 'src/app/_services/notification.service';
import { ProposalService } from '../proposal.service';
import { UtilsService } from 'src/app/_services/utils.service';

import { Cooperative } from 'src/app/_models/cooperative.model';
import { PublicCallCategoryAnswer, PublicCallCategoryAnswerMember } from 'src/app/_models/public-call-answer.model';
import { PublicCallFood } from 'src/app/_models/public-call-food.model';
import { Subject } from 'rxjs';
import { getAllIndexes } from 'src/app/_utils/geral';

declare const $: any;
declare const convertToNumber: any;
declare const getCsvSeparator: any;
declare const getDuplicatedLinesFromArray: any;
declare const isEmpty: any;
declare const replaceAll: any;
declare const sort_by: any;
declare const toBase64: any;
declare const uniqueByKey: any;
declare const validateCpfFormat: any;

@Component({ selector: 'app-cooperative-proposal-upload-members', templateUrl: './proposal-upload-members.component.html', styleUrls: ['./proposal-upload-members.component.scss'] })
export class ProposalUploadMembersComponent implements OnInit {
    @ViewChild('content') content: any;

    @Input() cooperative: Cooperative | null = null;
    @Input() modal: any;
    @Input() proposal: PublicCallCategoryAnswer | null = null;
    @Input() selectedFood: PublicCallFood | null = null;
    @Input() isOrganic: boolean = false;
    @Input() maximumYearSuppliedValue: number = 40000;

    @Output() onSave = new EventEmitter<PublicCallCategoryAnswerMember[]>();
    @Output() returnedCooperatedList = new Subject<any[]>();

    public errors: any[] = [];
    public selectedFiles: FileList | null = null;


    constructor(
        @Inject(LOCALE_ID) private locale: string,
        private notificationService: NotificationService,
        public proposalService: ProposalService,
        public utilsService: UtilsService,
        private modalService: NgbModal
    ) { }

    ngOnInit(): void { }

    async addFile() {
        $(".upload:hidden").val('');

        const hasMembersSelectedFood = this.proposal!.members?.length > 0;

        if (hasMembersSelectedFood && !(await this.notificationService.showConfirm('Todos os cooperados adicionados a este produto serão removidos. Deseja realmente continuar?')))
            return;

        $(".upload:hidden").attr('data-id', this.selectedFood!.id);
        $(".upload:hidden").trigger('click');
    }

    downloadExample() {
        let link = document.createElement('a');
        link.setAttribute('type', 'hidden');
        link.href = 'assets/upload-docs/importacao_cooperados_proposta.xlsx';
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    import() {
        if (isEmpty(this.selectedFiles)) {
            this.notificationService.showWarning('Nenhum arquivo foi selecionado. Realize o passo 3 antes de prosseguir', 'Erro!');
            return;
        }

        this.uploadFile(this.selectedFiles!);
        this.modal.dismiss();
    }

    saveData(newMembersList: PublicCallCategoryAnswerMember[]) {
        const hasErrors = this.errors.length > 0;

        if (hasErrors) {
            this.modalService.open(this.content, { centered: true, size: 'lg' });
            return;
        }

        this.notificationService.showSuccess('Cooperados importados com sucesso', 'Sucesso!');

        this.onSave.emit(newMembersList);
        this.modal.dismiss();
    }

    selectFile(e: any) {
        this.selectedFiles = e.target.files;
    }

    async uploadFile(files: FileList) {
        if (files.length == 0) {
            this.notificationService.showWarning('Nenhum arquivo foi selecionado', 'Erro!');
            return;
        }

        const fileToRead = files[0];
        const fileNameSplitted = fileToRead.name.split('.');
        const extension = fileNameSplitted[fileNameSplitted.length - 1].toLowerCase();

        if (fileNameSplitted.length <= 1 || (extension !== 'xlsx' && extension !== 'csv')) {
            this.notificationService.showWarning('Somente arquivos xlsx são permitidos', 'Erro!');
            return;
        }

        const fileBase64 = await toBase64(fileToRead)

        if (!this.selectedFood!.id || !fileBase64) {
            this.notificationService.showWarning('Não foi possível realizar o upload da lista de cooperados', 'Erro!');
            return;
        }

        if (extension === 'xlsx') {
            const instanceComponent = this;
            const validationXLSXFileFn = this.validationXLSXFile;

            validationXLSXFileFn(fileToRead, instanceComponent);
        } else {
            //const handledFileBase64 = fileBase64.replace('data:text/csv;base64,', '');
            const instanceComponent = this;
            const validationCSVFileFn = this.validationCSVFile;

            const fileReader = new FileReader();
            fileReader.onload = (function (e) { return validationCSVFileFn(e, instanceComponent); });
            fileReader.readAsText(fileToRead, "UTF-8");
        }
    }

    validationCSVFile(fileLoadedEvent: any, instanceComponent: any) {
        const textFromFileLoaded = fileLoadedEvent.target.result;
        const csvContent = textFromFileLoaded;

        instanceComponent.errors = [];

        const csvSeparator = getCsvSeparator(csvContent);

        if (!csvSeparator) {
            instanceComponent.errors.push({ linha: 1, mensagem: `Formato arquivo csv inválido` });
            return;
        }

        const lines = csvContent.split('\n');
        const lineArray: any[] = [];

        lines.forEach((element: any) => {
            const elementCleaned = replaceAll(replaceAll(element.trim().toUpperCase(), '\\n', ''), '\\r', '');
            const line: string[] = elementCleaned.split(csvSeparator);

            if (!isEmpty(line))
                lineArray.push(line);
        });

        instanceComponent.validateAllFileLines(lineArray, instanceComponent);
    }

    validationXLSXFile(fileToRead: File, instanceComponent: any) {
        instanceComponent.errors = [];

        readXlsxFile(fileToRead).then((lineArray) => {
            instanceComponent.validateAllFileLines(lineArray, instanceComponent);
        });
    }

    private validateAllFileLines(lineArray: any[], instanceComponent: any) {
        if (!lineArray || lineArray.length === 0)
            return;

        let ctr: number = 0;
        let arrayDapCaf: any = { dap_caf_code_list: [] };
        let validMembersToBeAdded: PublicCallCategoryAnswerMember[] = [];

        // Valida que não existem linhas duplicadas (mesma dap/caf ou mesmo cpf)
        const duplicatedLinesDapCaf = uniqueByKey(getDuplicatedLinesFromArray(lineArray, 0).map((i: any) => i[0]), 0);
        const duplicatedLinesCpf = uniqueByKey(getDuplicatedLinesFromArray(lineArray, 1).map((i: any) => i[1]), 0);
        let duplicatedLineIndexes: any[] = [];

        duplicatedLinesDapCaf.forEach((value: any) => {
            const indexes = getAllIndexes(lineArray, 0, value);
            const type = 'DAP/CAF';

            if (indexes.length > 1)
                indexes.shift();

            indexes.forEach((index: any) => {
                duplicatedLineIndexes.push({ index, type });
            });
        });

        duplicatedLinesCpf.forEach((value: any) => {
            let indexes = getAllIndexes(lineArray, 1, value);
            const type = 'CPF';

            if (indexes.length > 1)
                indexes.shift();

                indexes.forEach((index: any) => {
                    duplicatedLineIndexes.push({ index, type });
                });
        });

        duplicatedLineIndexes = duplicatedLineIndexes.sort(sort_by([ { 'name': 'index' } ]));

        // Faz um loop por todas as linhas realizando as validações
        lineArray.forEach((line: any) => {
            ctr++;
            let isValid = true;

            // Ignora a primeira linha (cabeçalho)
            if (ctr === 1) {
                return;
            }

            const currentLine = ctr;

            // Adiciona as linhas duplicadas a lista
            const duplicatedLines = duplicatedLineIndexes.filter((d: any) => ctr === d.index);

            duplicatedLines.forEach((duplicatedLine: any) => {
                instanceComponent.errors.push({ linha: duplicatedLine.index + 1, mensagem: `${duplicatedLine.type} em duplicidade` });
                return;
            });

            if (duplicatedLines.length > 0)
                return;

            // Valida que todos os campos estejam preenchidos
            if (isEmpty(line[0]) || isEmpty(line[1]) || isEmpty(line[2]) || isEmpty(line[3])) {
                instanceComponent.errors.push({ linha: currentLine, mensagem: 'Todos os campos devem ser preenchidos' });
                return;
            }

            // Valida o formato do campo cpf
            const isValidCpf = validateCpfFormat(line[1]);

            if (!isValidCpf) {
                instanceComponent.errors.push({ linha: currentLine, mensagem: 'O formato do CPF está inválido' });
                isValid = false;
            }

            // Valida o formato do campo quantidade
            const quantity = parseFloat(convertToNumber(line[2]));

            if (isNaN(quantity)) {
                instanceComponent.errors.push({ linha: currentLine, mensagem: 'O valor da coluna "quantidade" está inválido' });
                isValid = false;
            }

            // Valida o formato do campo preço
            const price = parseFloat(convertToNumber(line[3]));

            if (isNaN(price)) {
                instanceComponent.errors.push({ linha: currentLine, mensagem: 'O valor da coluna "preço" está inválido' });
                isValid = false;
            }

            // Valida que o dap ou caf está presente na lista da cooperativa
            const dap_caf_code = line[0];
            let cooperativeMember: any = undefined; //instanceComponent.cooperative?.members?.find((m: any) => m.dap_caf_code === dap_caf_code);
           
            if (dap_caf_code) {
                arrayDapCaf.dap_caf_code_list.push(dap_caf_code);
            }

            if (isEmpty(cooperativeMember)) {
                cooperativeMember = { dap_caf_code: dap_caf_code, cpf: line[1].toString() };
            }
            
            // Valida que o cooperado não tenha estourado o seu limite anual de fornecimento ((quantidade * preço) + ja_fornecido <= limite)
            const totalPrice = quantity * price;
            const total_year_supplied_value = cooperativeMember?.total_year_supplied_value ?? 0;
            const maximumAllowed = instanceComponent.maximumYearSuppliedValue - total_year_supplied_value;

            if (totalPrice > maximumAllowed) {
                instanceComponent.errors.push({ linha: ctr, mensagem: `Com este valor, este cooperado irá exceder seu limite máximo de fornecimento anual. Ele pode fornecer até ${formatCurrency(maximumAllowed, instanceComponent.locale, 'R$')}` });
                isValid = false;
            }

            // Valida que caso tenha a opção organico = Não (N/nao), o preço seja igual ao proposto
            if (instanceComponent.isOrganic || !instanceComponent.selectedFood!.is_organic) {
                if (price !== instanceComponent.selectedFood!.price) {
                    instanceComponent.errors.push({ linha: ctr, mensagem: `O preço deve ser igual ao proposto. O preço permitido é ${formatCurrency(instanceComponent.selectedFood!.price, instanceComponent.locale, 'R$')}` });
                    isValid = false;
                }
            }
            else {
                // Valida que caso tenha a opção organico = Sim (S), o preço seja, no máximo, 30% maior do que o proposto
                if (price < instanceComponent.selectedFood!.price || price > instanceComponent.selectedFood!.price * 1.3) {
                    instanceComponent.errors.push({ linha: ctr, mensagem: `O preço deve ser igual ou no máximo 30% maior do que o proposto. O preço permitido é entre ${formatCurrency(instanceComponent.selectedFood!.price, instanceComponent.locale, 'R$')} e ${formatCurrency(instanceComponent.selectedFood!.price * 1.3, instanceComponent.locale, 'R$')}` });
                    isValid = false;
                }
            }

            if (isValid) {
                const formatted_price = formatCurrency(price, instanceComponent.locale, 'R$');
                const formatted_quantity = `${quantity} ${instanceComponent.selectedFood!.measure_unit}`;
                const formatted_total = formatCurrency(price * quantity, instanceComponent.locale, 'R$');

                validMembersToBeAdded.push({
                    id: cooperativeMember.id,
                    name: cooperativeMember.name,
                    cpf: cooperativeMember.cpf,
                    dap_caf_code: cooperativeMember.dap_caf_code,
                    quantity: quantity,
                    price: price,
                    food_id: instanceComponent.selectedFoodId,
                    food_name: instanceComponent.selectedFood!.food_name,
                    formatted_price: formatted_price,
                    formatted_quantity: formatted_quantity,
                    formatted_total: formatted_total,
                    is_organic: instanceComponent.selectedFood!.is_organic
                });
            }
        });

        //const returnedListCooperated: any = instanceComponent.proposalService.validateMembersList(arrayDapCaf);

        // if(isEmpty(instanceComponent.errors)) {
        //     instanceComponent.returnedCooperatedList.next(returnedListCooperated);
        // }

        instanceComponent.saveData(validMembersToBeAdded);
    }
}
