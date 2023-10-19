import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { LoaderService } from '../loader.service';
import { LoginService } from '../../authorization/login/login.service';
import { NotificationService } from '../notification.service';

@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {
  constructor(
    private loaderService: LoaderService,
    private loginService: LoginService,
    private notificationService: NotificationService
  ) {}

  intercept(request: HttpRequest<any>, newRequest: HttpHandler): Observable<any> {
    return newRequest.handle(request).pipe(
      catchError((err) => {
        this.loaderService.hide();
        
        if (err.status === 401) {
          // Se erro 401, desloga e redireciona para a tela de login
          this.loginService.logout();

          return of(err.message);
        }

        const error = err.error || err;
        let errorMessage = error.mensagens && error.mensagens.length > 0 ? error.mensagens[0] : err.statusText;

        if (err.status === 0 || err.status === 500 ) {
          errorMessage = 'Ocorreu um erro desconhecido';
          this.notificationService.showError(errorMessage, 'Erro!');
        } else if (err.status === 400) {
          this.notificationService.showWarning(errorMessage, 'Erro!');
        }

        return throwError(() => error);
      })
    );
  }
}
