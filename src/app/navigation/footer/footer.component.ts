import { Component } from '@angular/core';

@Component({ selector: 'app-footer', templateUrl: './footer.component.html', styleUrls: ['./footer.component.scss' ] })

export class FooterComponent
{
  curr_year: number;

  constructor()
  {
    this.curr_year = (new Date()).getFullYear();
  }
}
