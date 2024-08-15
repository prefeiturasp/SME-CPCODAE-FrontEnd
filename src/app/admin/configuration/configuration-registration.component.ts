import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { ConfigurationService } from 'src/app/_services/configuration.service';
import { MenuService } from 'src/app/navigation/menu/menu.service';
import { NotificationService } from 'src/app/_services/notification.service';

import { SMEConfiguration } from 'src/app/_models/configuration.model';

declare const isEmpty: any;

@Component({ selector: 'admin-configuration-registration', templateUrl: './configuration-registration.component.html', styleUrls: ['./configuration-registration.component.scss'] })
export class AdminConfigurationRegistrationComponent implements OnInit {
  public configurationForm!: UntypedFormGroup;

  public configurations: SMEConfiguration[] = [];
  public unmodified!: SMEConfiguration[];
  public submitted: boolean = false;

  constructor(
    private configurationService: ConfigurationService,
    private menuService: MenuService,
    private notificationService: NotificationService,
    private formBuilder: UntypedFormBuilder,
    private router: Router) {
  }

  ngOnInit(): void {
    this.menuService.showSearchFilter = false;

    this.configurationForm = this.formBuilder.group({
      configurations: this.formBuilder.array([])
    });

    this.configurationService.getAll().subscribe({
      next: (ret) => {
        if (ret && ret.sucesso) {
          this.configurations = ret.retorno;
          this.unmodified = Object.assign([], this.configurations);

          this.initForm();
        }
      },
      error: (err) => console.log(err)
    });
  }

  async goBack() {
    if (!this.isChanged() || !(await this.notificationService.showConfirm('Existem alterações não salvas. Caso continue você irá perder estas informações. Deseja continuar?')))
      this.router.navigate(['/admin/configuracoes']);
  }

  initForm() {
    const formArray = this.configurationForm.get('configurations') as FormArray;
    this.configurations.forEach(config => {
      formArray.push(this.formBuilder.group({
        id: [config.id, Validators.required],
        name: [config.name, Validators.required],
        value: [config.value, Validators.required]
      }));
    });
  }

  isChanged() : boolean {
    for (let i = 0; i < this.configurations.length; i++) {
      if (this.configurations[i].id !== this.unmodified[i].id
        || this.configurations[i].name !== this.unmodified[i].name
        || this.configurations[i].value !== this.unmodified[i].value
        || this.configurations[i].is_active !== this.unmodified[i].is_active)
        return false;
    }

    return true;
  }

  resultNext(ret: any, successfulMessage: string, errorMessage: string) {
    if (ret && ret.sucesso) {
      this.notificationService.showSuccess(successfulMessage, 'Sucesso!');

      let index = this.unmodified.findIndex(u => u.id === ret.retorno.id);
      this.unmodified[index] = Object.assign({}, ret.retorno);

      this.goBack();
      return;
    }

    this.notificationService.showWarning(errorMessage, 'Erro');
  }

  onSubmit() {
    this.submitted = true;

    if (this.configurationForm.invalid) {
      return;
    }

    const docForm = this.configurationForm.value.configurations[0];
    const configuration = this.configurations[0];
    configuration.id = docForm.id;
    configuration.name = docForm.name;
    configuration.value = docForm.value;

    this.configurationService.update(configuration).subscribe({
      next: (ret) => this.resultNext(ret, 'Configuração alterada', 'Não foi possível alterar esta configuração'),
      error: (err) => console.log(err)
    });
  }

  onReset() {
    this.submitted = false;
    this.configurationForm.reset();
  }

  get configurationsFormArray() {
    return this.configurationForm.get('configurations') as FormArray;
  }

  get maximumYearSupplyConfiguration() {
    return this.configurationsFormArray.at(0) as FormGroup;
  }
}
