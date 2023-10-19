import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ChangePasswordService } from './change-password.service';
import { MenuService } from 'src/app/navigation/menu/menu.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { UtilsService } from 'src/app/_services/utils.service';

import { ConfirmedValidator } from 'src/app/_utils/validators/confirmed-validator';
import { User } from 'src/app/_models/user.model';

@Component({ selector: 'app-change-password', templateUrl: './change-password.component.html', styleUrls: ['./change-password.component.scss'] })
export class ChangePasswordComponent implements OnInit {
  public changePasswordForm: UntypedFormGroup;

  public submitted = false;
  public loggedUser: User | null = null;

  constructor(
    private changePasswordService: ChangePasswordService,
    private menuService: MenuService,
    private notificationService: NotificationService,
    private utilsService: UtilsService,
    private formBuilder: UntypedFormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loggedUser = this.utilsService.localStorageUtils.getUser();
    this.menuService.showSearchFilter = false;

    this.changePasswordForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    }, { 
      validator: ConfirmedValidator('password', 'confirmPassword')
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.changePasswordForm.invalid) {
      return;
    }

    const userChangePassword = this.changePasswordForm.value;

    this.changePasswordService.changePassword(this.loggedUser!.email, userChangePassword.password).subscribe(
      {
        next: (ret) => {
          if (ret && ret.sucesso) {
            this.notificationService.showSuccess(`Senha alterada com sucesso`, 'Sucesso!');
            this.router.navigate(['/']);
            return;
          }

          this.notificationService.showWarning('Houve um erro ao tentar alterar sua senha', 'Erro!');
          
          this.submitted = false;
        },
        error: (error) => {
          this.submitted = false;
          console.log(error);
        }
      }
    );
  }

  onReset() {
    this.submitted = false;
    this.changePasswordForm.reset();
  }

  get f() {
    return this.changePasswordForm.controls;
  }
}
