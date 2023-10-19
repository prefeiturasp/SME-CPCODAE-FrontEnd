import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'
  
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  constructor(private toastr: ToastrService) { }
  
  showSuccess(message: string, title: string){
      this.toastr.success(message, title, {closeButton: true});
  }
  
  showError(message: string, title: string){
      this.toastr.error(message, title, {closeButton: true});
  }
  
  showInfo(message: string, title: string){
      this.toastr.info(message, title, {closeButton: true});
  }
  
  showWarning(message: string, title: string){
      this.toastr.warning(message, title, {closeButton: true});
  }

  showConfirm(message: string, title: string = 'Atenção!'): Promise<boolean> {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then((result) => { return result.isConfirmed });
  }
}