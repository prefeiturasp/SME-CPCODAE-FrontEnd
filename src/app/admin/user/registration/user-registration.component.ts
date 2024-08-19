import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { AdminCooperativeService } from '../../cooperative/cooperative.service';
import { AdminUserService } from '../user.service';
import { MenuService } from 'src/app/navigation/menu/menu.service';
import { NotificationService } from 'src/app/_services/notification.service';

import { Cooperative } from 'src/app/_models/cooperative.model';
import { User } from 'src/app/_models/user.model';

declare const isEmpty: any;
declare const textTransformCapitalize: any;

@Component({ selector: 'admin-user-registration', templateUrl: './user-registration.component.html', styleUrls: ['./user-registration.component.scss'] })
export class AdminUserRegistrationComponent implements OnInit {
  public userForm: UntypedFormGroup;

  public cooperative: Cooperative;
  public user: User;
  public unmodified: User;
  public isAdd: boolean = false;
  public isAdmin: boolean = false;
  public submitted: boolean = false;

  constructor(
    private cooperativeService: AdminCooperativeService,
    private menuService: MenuService,
    private notificationService: NotificationService,
    private userService: AdminUserService,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {
    this.menuService.showSearchFilter = false;
    const id = this.route.snapshot.paramMap.get('id') ?? '';

    this.isAdd = (isEmpty(id) || id.toLowerCase() === 'novo');

    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      roleGroup: new FormGroup({
        role: new FormControl({ value: '', disabled: false }, [Validators.required])
      }),
      isActive: [true]
    });

    if (this.isAdd) {
      this.user = new User();
      this.unmodified = Object.assign({}, this.user);
    } else {
      this.userService.get(id).subscribe({
        next: (ret) => {
          if (ret && ret.sucesso) {
            this.user = ret.retorno;
            this.unmodified = Object.assign({}, this.user);

            this.isAdmin = this.user.roles.includes('admin') || this.user.roles.includes('logistica');
            const currentRole = this.getRoleByName(this.user.roles[0]);

            this.userForm.patchValue({
              name: this.user.name,
              email: this.user.email,
              roleGroup: {
                role: currentRole
              },
              isActive: this.user.is_active
            });

            if (!this.isAdmin) {
              this.f['roleGroup'].disable();

              this.cooperativeService.getByUserId(this.user.id).subscribe({
                next: (retC) => {
                  if (retC && retC.sucesso) {
                    this.cooperative = retC.retorno;
                  }
                },
                error: (errC) => console.log(errC)
              });
            }
          }
        },
        error: (err) => console.log(err)
      });
    }
  }

  getRoleById(roleId: string) : string {
    switch (roleId) {
      case '1':
        return 'admin';
      case '2':
        return 'logistica'
      case '3':
        return 'cooperativa'
    }

    return 'admin';
  }

  getRoleByName(role: string) : string {
    switch (role.toLowerCase()) {
      case 'admin':
        return '1';
      case 'logistica':
        return '2';
      case 'cooperativa':
        return '3';
    }

    return '';
  }

  async goBack() {
    if (!this.isChanged() || !(await this.notificationService.showConfirm('Existem alterações não salvas. Caso continue você irá perder estas informações. Deseja continuar?')))
      this.router.navigate(['/admin/usuario']);
  }

  isChanged() : boolean {
    return this.user.id !== this.unmodified.id
      || this.user.name !== this.unmodified.name
      || this.user.email !== this.unmodified.email
      || this.user.roles !== this.unmodified.roles
      || this.user.is_active !== this.unmodified.is_active;
  }

  resultNext(ret: any, successfulMessage: string, errorMessage: string) {
    if (ret && ret.sucesso) {
      this.notificationService.showSuccess(successfulMessage, 'Sucesso!');
      this.unmodified = Object.assign({}, this.user);
      this.goBack();
      return;
    }

    this.notificationService.showWarning(errorMessage, 'Erro');
  }

  onSubmit() {
    this.submitted = true;

    if (this.userForm.invalid) {
      return;
    }

    const userForm = this.userForm.value;
 
    this.user.name = textTransformCapitalize(userForm.name.trim());
    this.user.email = userForm.email.trim().toLowerCase();

    if (this.isAdd) {
      this.user.role = this.getRoleById(this.f['roleGroup'].value.role);

      this.userService.add(this.user).subscribe({
        next: (ret) => this.resultNext(ret, 'Usuário criado', 'Não foi possível criar este usuário'),
        error: (err) => console.log(err)
      });
    } else {
      this.user.is_active = userForm.isActive;

      this.userService.update(this.user).subscribe({
        next: (ret) => this.resultNext(ret, 'Usuário alterado', 'Não foi possível alterar este usuário'),
        error: (err) => console.log(err)
      });
    }
  }

  onReset() {
    this.submitted = false;
    this.userForm.reset();
  }

  get f() {
    return this.userForm.controls;
  }
}
