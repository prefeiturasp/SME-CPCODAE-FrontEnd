import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { LocalStorageUtils } from 'src/app/_utils/localstorage';
import { LoaderService } from '../loader.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private loaderService: LoaderService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Adiciona o header de autenticação nas chamadas

    const localStorageUtils = new LocalStorageUtils();

    // Obtém o token do usuário logado
    const user = localStorageUtils.getUser();

    if (user && user.token) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json;charset=utf-8' },
      });
    }

    if (request.url.indexOf('/json') < 0)
      this.loaderService.show();

    return next.handle(request).pipe(
      map(
        (event) => {
          if (event instanceof HttpResponse && event.url!.indexOf('/json') < 0) {
            //event = event.clone({body: this.modifyBody(event.body)});
            this.loaderService.hide();
          }
          return event;
        }
      )
    );
  }
}
