import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { NotificationService } from 'src/app/_services/notification.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { AdminUserService } from 'src/app/admin/user/user.service';
import { LoginService } from 'src/app/authorization/login/login.service';
import { MenuService } from 'src/app/navigation/menu/menu.service';

import { User } from 'src/app/_models/user.model';
import { ConfirmedValidator } from 'src/app/_utils/validators/confirmed-validator';

declare const isEmpty: any;

@Component({ selector: 'app-cooperative-profile', templateUrl: './profile.component.html', styleUrls: ['./profile.component.scss'] })
export class ProfileComponent implements OnInit {
    public profileForm: UntypedFormGroup;

    public user: User;
    public unmodified: User;
    public submitted: boolean = false;

    constructor(
        private loginService: LoginService,
        private menuService: MenuService,
        private notificationService: NotificationService,
        private userService: AdminUserService,
        private utilsService: UtilsService,
        private formBuilder: UntypedFormBuilder) {
    }

    ngOnInit(): void {
        this.menuService.showSearchFilter = false;

        const user = this.utilsService.localStorageUtils.getUser();

        if (isEmpty(user)) {
            this.loginService.logout(true);
            return;
        }

        this.profileForm = this.formBuilder.group({
            name: ['', [Validators.required]],
            email: ['', [Validators.email]],
            confirmEmail: ['', [Validators.email]]
        }, {
          validator: ConfirmedValidator('email', 'confirmEmail')
        });

        this.userService.get(user!.id).subscribe({
            next: (ret) => {
                if (ret && ret.sucesso) {
                    this.user = ret.retorno;
                    this.unmodified = Object.assign({}, this.user);

                    this.profileForm.patchValue({ name: this.user.name, email: this.user.email });
                }
            },
            error: (err) => console.log(err)
        });
    }

    isChanged(): boolean {
        return this.user.id !== this.unmodified.id
            || this.user.name !== this.unmodified.name;
    }

    resultNext(ret: any, successfulMessage: string, errorMessage: string) {
        if (ret && ret.sucesso) {
            this.notificationService.showSuccess(successfulMessage, 'Sucesso!');
            this.unmodified = Object.assign({}, this.user);

            this.utilsService.localStorageUtils.saveUserKeepToken(ret.retorno);
            this.loginService.userLoginChanged.emit(ret.retorno);
            return;
        }

        this.notificationService.showWarning(errorMessage, 'Erro');
    }

    setFormBuilder() {

      this.profileForm = this.formBuilder.group({
          name: [this.user.name, [Validators.required]],
          email: [this.user.email, [Validators.email]],
          confirmEmail: ['', [Validators.email]]
      }, {
        validator: ConfirmedValidator('email', 'confirmEmail')
      });
    }

    onSubmit() {
        this.submitted = true;

        if (this.profileForm.invalid) {
            return;
        }

        const docForm = this.profileForm.value;
        this.user.name = docForm.name;
        this.user.is_active = true;

        if(docForm.email && docForm.email === docForm.email) {
          this.user.email = docForm.email;
        }

        this.userService.update(this.user).subscribe({
            next: (ret) => this.resultNext(ret, 'Dados alterados com sucesso', 'Não foi possível alterar seus dados'),
            error: (err) => console.log(err)
        });
    }

    onReset() {
        this.submitted = false;
        this.profileForm.reset();
    }

    get f() {
        return this.profileForm.controls;
    }
}

