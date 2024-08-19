import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { LoaderService } from 'src/app/_services/loader.service';
import { LoginService } from './login.service';
import { MenuService } from 'src/app/navigation/menu/menu.service';
import { NotificationService } from 'src/app/_services/notification.service';

declare const $: any;

@Component({ selector: 'app-login', templateUrl: './login.component.html', styleUrls: ['./login.component.scss'] })
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('recoverPassword') recoverPassword: ElementRef;

  public loginForm: UntypedFormGroup;
  public recoverPasswordForm: UntypedFormGroup;

  public submitted = false;
  public submittedRecover = false;

  private returnUrl: string | null = null;

  constructor(
    private loaderService: LoaderService,
    private loginService: LoginService,
    private menuService: MenuService,
    private notificationService: NotificationService,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.menuService.showSearchFilter = false;

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.recoverPasswordForm = this.formBuilder.group({
      emailRecover: ['', [Validators.required, Validators.email]],
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngAfterViewInit() {
    $('#recoverPassword').on('hidden.bs.modal', () => {
      this.submittedRecover = false;
      this.recoverPasswordForm.reset();
    });
  }

  onRecoverSubmit() {
    this.submittedRecover = true;

    if (this.recoverPasswordForm.invalid) {
      return;
    }

    const userEmail = this.recoverPasswordForm.value;
    this.loaderService.loaderName = 'spinnerRecuperarSenha';
    this.loginService.sendEmailRecoverPassword(userEmail.emailRecover).subscribe(
      {
        next: (ret) => {
          if (ret && ret.sucesso) {
            this.notificationService.showSuccess('Um e-mail foi enviado com as informações para recuperação', 'Sucesso!');
            $('.btn-close-modal').trigger('click');
            return;
          }

          this.notificationService.showWarning('Não foi possível recuperar sua senha. Tente novamente mais tarde', 'Erro');
          $('.btn-close-modal').trigger('click');
        },
        error: (error) => {
          console.log(error);
        }
      }
    )
  }

  onSubmit() {
    this.loaderService.loaderName = null;
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const userLogin = this.loginForm.value;

    this.loginService.loginExecute(userLogin.email, userLogin.password, this);
  }

  onReset() {
    this.submitted = false;
    this.loginForm.reset();
  }

  get f() {
    return this.loginForm.controls;
  }

  get fp() {
    return this.recoverPasswordForm.controls;
  }
}
