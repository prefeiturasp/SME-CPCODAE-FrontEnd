import { Injectable } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
  
@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  public loaderName: string | null = null;

  constructor(private spinner: NgxSpinnerService) { }
  
  show() {
    if (this.loaderName)
      this.spinner.show(this.loaderName);
    else
      this.spinner.show();
  }

  hide() {
    if (this.loaderName)
      this.spinner.hide(this.loaderName);
    else
      this.spinner.hide();
  }
}