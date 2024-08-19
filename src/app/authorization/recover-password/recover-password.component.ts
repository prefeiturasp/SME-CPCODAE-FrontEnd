import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { LoginService } from '../login/login.service';
import { MenuService } from 'src/app/navigation/menu/menu.service';
import { RecoverPasswordService } from './recover-password.service';

import { ConfirmedValidator } from 'src/app/_utils/validators/confirmed-validator';

@Component({ selector: 'app-recover-password', templateUrl: './recover-password.component.html', styleUrls: ['./recover-password.component.scss'] })
export class RecoverPasswordComponent implements OnInit {
  public recoverPasswordForm: UntypedFormGroup;

  public submitted = false;
  private token: string = '';

  constructor(
    private loginService: LoginService,
    private menuService: MenuService,
    private recoverPasswordService: RecoverPasswordService,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') ?? '';

    this.menuService.showSearchFilter = false;

    this.recoverPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    }, { 
      validator: ConfirmedValidator('password', 'confirmPassword')
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.recoverPasswordForm.invalid) {
      return;
    }

    const userRecoverPassword = this.recoverPasswordForm.value;

    this.recoverPasswordService.recoverPassword(userRecoverPassword.email, userRecoverPassword.password, this.token).subscribe(
      {
        next: (ret) => {
          if (ret && ret.sucesso) {
            this.loginService.loginExecute(userRecoverPassword.email, userRecoverPassword.password, this);
          }

          this.submitted = false;
        },
        error: (error) => {
          console.log(error);
          this.submitted = false;
        }
      }
    );
  }

  onReset() {
    this.submitted = false;
    this.recoverPasswordForm.reset();
  }

  get f() {
    return this.recoverPasswordForm.controls;
  }
}
