import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

import { PublicCallStatusEnum } from 'src/app/_enums/public-call-status-enum';
import { PublicCall } from 'src/app/_models/public-call.model';

import { AdminPublicCallService } from '../public-call/public-call.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { AdminReportTypeEnum } from 'src/app/_enums/admin-report-type.enum';

declare const formatDate_yyyyMMddHHmmss: any;

@Component({ selector: 'admin-dashboard', templateUrl: './dashboard.component.html', styleUrls: ['./dashboard.component.scss'] })
export class AdminDashboardComponent implements OnInit {
  public PublicCallStatusEnum: any = PublicCallStatusEnum;
  public publicCalls: PublicCall[] = [];
  public availableStatus: number[] = [
    PublicCallStatusEnum.emAndamento.id,
    PublicCallStatusEnum.aprovada.id,
    PublicCallStatusEnum.homologada.id,
    PublicCallStatusEnum.contratada.id,
    PublicCallStatusEnum.cronogramaExecutado.id,
    PublicCallStatusEnum.suspensa.id,
    PublicCallStatusEnum.cancelada.id
  ];
  
  constructor(public publicCallService: AdminPublicCallService, private notificationService: NotificationService, private router: Router) { }

  ngOnInit(): void {
    this.publicCallService.getAllDashboard().subscribe({
      next: (ret) => {
        if (ret && ret.sucesso && ret.retorno.length > 0) {
          this.publicCalls = ret.retorno;
        }
      },
      error: (err) => console.log(err)
    })
  }

  generateReport($event: any) {
    const type: AdminReportTypeEnum = $event.type;
    
    this.publicCallService.getAllReport($event).subscribe({
      next: (res) => {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(res.retorno);
        
        const range = XLSX.utils.decode_range(ws['!ref']!); // Obter o intervalo de células da planilha

        for(let rowNum = range.s.r + 1; rowNum <= range.e.r; rowNum++) {
          for(let colNum = range.s.c; colNum <= range.e.c; colNum++) {
            const cellAddress = {c: colNum, r: rowNum}; // Coluna, linha `rowNum`
            const cellRef = XLSX.utils.encode_cell(cellAddress);

            if(!ws[cellRef]) // Se a célula não existir, pule
              continue;

            if (type === AdminReportTypeEnum.Chamadas) {
              // Aplicando a formatação baseada na coluna
              if(colNum === 2 || colNum === 9 || colNum === 15) { // Colunas C, J e P são numéricas (índices começam de 0)
                // A formatação numérica pode ser deixada como padrão ou aplicada conforme necessário
              } else if(colNum === 3 || colNum === 4 || colNum === 11 || colNum === 12) { // Colunas D, E, L, M são moeda
                ws[cellRef].z = '"R$"#,##0.00';
              } else if(colNum >= 16 && colNum <= 20) { // Colunas Q, R, S, T e U são porcentagem
                ws[cellRef].z = '0.00%';
              }
            }
          }
        }
    
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
        /* save to file */
        const hoje = formatDate_yyyyMMddHHmmss(new Date());
        const typeName = AdminReportTypeEnum[type].toString().toLowerCase();
        const fileName = `relatorio_${typeName}_${hoje}.xlsx`;
        XLSX.writeFile(wb, fileName);
      },
      error: (error) => {
        console.log(error);
        this.notificationService.showWarning('Não foi possível gerar este relatório', 'Tente novamente mais tarde');
      }
    });
  }

  goToAdd($event: any) {
    this.router.navigate([`/admin/chamadas-publicas/nova`]);
  }

  goToDetail($event: any) {
    const publicCall = this.publicCalls.find(p => p.id === $event.id);

    this.router.navigate([`/admin/chamadas-publicas/${$event.id}/propostas`], { state: { publicCall } });
  }
}
