import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorConfig } from '@kolkov/angular-editor';

import { MenuService } from 'src/app/navigation/menu/menu.service';
import { LoaderService } from 'src/app/_services/loader.service';
import { LocationService } from 'src/app/_services/location.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { AdminDocumentTypeService } from '../document-type/document-type.service';
import { AdminFoodService } from '../food/food.service';
import { AdminPublicCallService } from './public-call.service';

import { City, State } from 'src/app/_models/location.model';
import { PublicCall } from 'src/app/_models/public-call.model';

import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { SMEDocumentType } from 'src/app/_models/document-type.model';
import { SMEFood } from 'src/app/_models/food.model';
import { PublicCallDocument, PublicCallDocumentFoods } from 'src/app/_models/public-call-document.model';
import { PublicCallFood } from 'src/app/_models/public-call-food.model';

import { DateValidator } from 'src/app/_utils/validators/date.validator';
import { uuidv4 } from 'src/app/_utils/geral';

declare const focusOnFormError: any;
declare const formatDate: any;
declare const formatDateTime: any;
declare const isEmpty: any;
declare const sort_by: any;

@Component({ selector: 'admin-public-call', templateUrl: './public-call.component.html', styleUrls: ['./public-call.component.scss'] })
export class AdminPublicCallComponent implements OnInit {
  public publicCallForm!: UntypedFormGroup;

  public publicCall!: PublicCall;
  public unmodified!: PublicCall;
  public isAdd: boolean = false;
  public submitted: boolean = false;

  public citiesList: City[] = [];
  public documentsList: SMEDocumentType[] = [];
  public foodsList: SMEFood[] = [];
  public statesList: State[] = [];
  public selectedDocuments: PublicCallDocumentFoods[] = [];
  faPlus = faPlus;
  faTrash = faTrash;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '400px',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['undo', 'redo', 'strikeThrough', 'subscript', 'superscript', 'heading'],
      ['customClasses', 'textColor', 'backgroundColor', 'insertImage', 'insertVideo']
    ]
  };

  constructor(
    private documentTypeService: AdminDocumentTypeService,
    private foodService: AdminFoodService,
    private locationService: LocationService,
    private loaderService: LoaderService,
    private menuService: MenuService,
    private notificationService: NotificationService,
    private publicCallService: AdminPublicCallService,
    private formBuilder: UntypedFormBuilder,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {
    this.menuService.showSearchFilter = false;
    const id = this.route.snapshot.paramMap.get('id') ?? '';

    this.isAdd = (isEmpty(id) || id.toLowerCase() === 'nova');

    this.setFormBuilder();

    if (this.isAdd) {
      this.publicCall = new PublicCall();
      this.unmodified = Object.assign({}, this.publicCall);

      this.loadDocuments();

      this.locationService.getStatesJSON().subscribe({
        next: (retS) => {
          this.statesList = retS;
          this.loadCities();
        },
        error: (errS) => console.log(errS)
      });
    } else {
      this.publicCallService.get(id).subscribe({
        next: (ret) => {
          if (ret && ret.sucesso) {
            this.publicCall = ret.retorno;
            this.unmodified = Object.assign({}, this.publicCall);

            this.publicCallForm.patchValue({
              extra_information: this.publicCall.extra_information,
              name: this.publicCall.name,
              number: this.publicCall.number,
              process: this.publicCall.process,
              notice_url: this.publicCall.notice_url,
              public_session_url: this.publicCall.public_session_url,
              public_session_place: this.publicCall.public_session_place,
              notice_object: this.publicCall.notice_object,
              delivery_information: this.publicCall.delivery_information,
              public_session_date: new Date(this.publicCall.public_session_date) < new Date(2010, 0, 1) ? null : formatDateTime(this.publicCall.public_session_date),
              registration_start_date: new Date(this.publicCall.registration_start_date) < new Date(2010, 0, 1) ? null : formatDate(this.publicCall.registration_start_date),
              registration_end_date: new Date(this.publicCall.registration_end_date) < new Date(2010, 0, 1) ? null : formatDate(this.publicCall.registration_end_date),
              isActive: this.publicCall.is_active,
              foods: []
            });

            this.loadDocuments();

            this.locationService.getStatesJSON().subscribe({
              next: (retS) => {
                this.statesList = retS;

                if (this.publicCall.city_id) {
                  this.locationService.getCityById(this.publicCall.city_id).subscribe({
                    next: (retC) => {
                      // this.loadCities(retC.state_acronym, this.publicCall.city_id!);
                      this.loadCities();
                    }
                  })
                }
              },
              error: (errS) => {
                console.log(errS);
              }
            });
          }
        },
        error: (err) => console.log(err)
      });
    }
  }

  addProduct(food?: PublicCallFood) {
    if (!food) {
      food = new PublicCallFood();
    }

    const foodFormGroup = this.createFoodFormGroup(food);
    this.foodControls.push(foodFormGroup);

    const documents = this.getDocumentsByFood(food!.food_id);

    this.selectedDocuments.forEach(d => {
      d.foods.push({ food_id: food!.food_id, is_associated: documents.some(doc => d.document_type_id === doc.document_type_id) });
    });
  }

  buildFoodList() {
    if (this.publicCall && this.publicCall.foods && this.publicCall.foods.length > 0) {
      const sortedFoods = this.publicCall.foods.sort(sort_by([{ name: 'creation_date' }]));

      sortedFoods.forEach(food => {
        const newFood = new PublicCallFood();
        newFood.id = food.id;
        newFood.food_id = food.food_id;
        newFood.food_name = food.food_name;
        newFood.price = food.price;
        newFood.quantity = food.quantity;
        newFood.accepts_organic = food.accepts_organic;
        newFood.is_organic = food.is_organic;
        newFood.measure_unit = food.measure_unit;
        this.addProduct(newFood);
      });
    } else {
      this.addProduct(new PublicCallFood());
    }

    this.loadFoods(undefined);
  }

  changeFood(index: number, foodId: any) {
    const food = this.foodsList.find(f => f.id === foodId);
    this.foodControls.at(index).patchValue({ food_name: food?.name, measure_unit: food?.measure_unit_name });

    this.removeDocumentFromProduct(foodId);

    const documents = this.getDocumentsByFood(foodId);

    this.selectedDocuments.forEach(d => {
      d.foods.push({ food_id: foodId, is_associated: documents.some(doc => d.document_type_id === doc.document_type_id) });
    });
  }

  changeIsOrganic(index: number) {
    const formFood = this.foodControls.at(index) as FormGroup;
    const food = formFood.value;

    if (!food)
      return;

    if (food.is_organic) {
      formFood.patchValue({ accepts_organic: true });
      formFood.controls['accepts_organic'].disable();
    } else {
      formFood.controls['accepts_organic'].enable();
    }
  }

  createFoodFormGroup(food: any): FormGroup {
    return this.formBuilder.group({
      id: [food?.id, Validators.nullValidator],
      food_id: [food?.food_id, Validators.required],
      price: [food?.price, [Validators.min(0.01), Validators.required]],
      quantity: [food?.quantity, [Validators.min(0.01), Validators.required]],
      category_id: [food?.category_id, Validators.nullValidator],
      measure_unit: [food?.measure_unit, Validators.nullValidator],
      measure_unit_id: [food?.measure_unit_id, Validators.nullValidator],
      public_call_id: [food?.public_call_id, Validators.nullValidator],
      food_name: [food?.food_name, Validators.nullValidator],
      accepts_organic: [{ value: food?.accepts_organic, disabled: food?.is_organic }],
      //accepts_organic: [food?.accepts_organic],
      is_organic: [food?.is_organic, Validators.required],
      is_active: [food?.is_active, Validators.required]
    });
  }

  getDocumentsArray(): PublicCallDocument[] {
    let documents: PublicCallDocument[] = [];
    const publicCallId = this.publicCall.id === '' ? undefined : this.publicCall.id;

    this.selectedDocuments.forEach(d => {
      const isAllAssociated = d.foods.every(f => f.is_associated);

      if (isAllAssociated)
        documents.push({ document_type_id: d.document_type_id, public_call_id: publicCallId });
      else
        d.foods.filter(f => f.is_associated).forEach(f => {
          documents.push({ document_type_id: d.document_type_id, food_id: f.food_id, public_call_id: publicCallId });
        });
    });

    return documents;
  }

  getDocumentsByFood(foodId: string): PublicCallDocument[] {
    return this.publicCall.documents?.filter(d => !d.food_id || d.food_id === foodId) || [];
  }

  getFoodControlName(index: number, controlName: string): string {
    return `foods.${index}.${controlName}`;
  }

  getFoodFromFormBuilder(): PublicCallFood[] {
    if (!this.foodControls.value)
      return [];

    let foods: PublicCallFood[] = [];
    this.foodControls.value.map((food: PublicCallFood) => {
      foods.push({
          id: this.publicCall.foods && this.publicCall.foods.length > 0 ? this.publicCall.foods[0].id : '',
          public_call_id: this.publicCall.id,
          food_id: food.food_id,
          measure_unit_id: food.measure_unit_id,
          accepts_organic: food.accepts_organic,
          is_organic: food.is_organic,
          price: food.price,
          quantity: food.quantity,
          food_name: food.food_name,
          category_id: food.category_id,
          category_name: food.category_name,
          creation_date: food.creation_date,
          is_active: true,
          measure_unit: food.measure_unit
        }
      );
    });

    const sortedFoods = foods.sort(sort_by([{ name: 'creation_date' }]));
    return sortedFoods;
  }

  getFromFormBuilder(): PublicCall {
    const docForm = this.publicCallForm.value;

    const publicCall = new PublicCall();
    publicCall.id = this.publicCall.id;
    publicCall.city_id = docForm.city_id;
    publicCall.name = docForm.name;
    publicCall.number = docForm.number;
    publicCall.process = docForm.process;
    publicCall.notice_url = docForm.notice_url;
    publicCall.public_session_url = docForm.public_session_url;
    publicCall.public_session_place = docForm.public_session_place;
    publicCall.notice_object = docForm.notice_object;
    publicCall.delivery_information = docForm.delivery_information;
    publicCall.public_session_date = docForm.public_session_date ? `${docForm.public_session_date}` : docForm.public_session_date;
    publicCall.registration_start_date = docForm.registration_start_date ? `${docForm.registration_start_date}T00:00:00` : docForm.registration_start_date;
    publicCall.registration_end_date = docForm.registration_end_date ? `${docForm.registration_end_date}T00:00:00` : docForm.registration_end_date;
    publicCall.foods = this.getFoodFromFormBuilder();
    publicCall.extra_information = docForm.extra_information;
    publicCall.is_active = docForm.isActive;

    return publicCall;
  }

  async goBack(ignoreValidation: boolean) {
    if (ignoreValidation || !this.isChanged() || (await this.notificationService.showConfirm('Existem alterações não salvas. Caso continue você irá perder estas informações. Deseja continuar?'))) {
      if (this.isAdd)
        this.router.navigate([`/admin/chamadas-publicas`]);
      else
        this.router.navigate([`/admin/chamadas-publicas/${this.publicCall.id}/propostas`]);
    }
  }

  isChanged(): boolean {
    const publicCall = Object.assign({}, this.getFromFormBuilder());

    const documentIds = this.publicCall.documents.sort(sort_by([{ 'name': 'document_type_id' }])).map(d => d.document_type_id).join('');
    const unmodifiedDocumentIds = this.unmodified.documents.sort(sort_by([{ 'name': 'document_type_id' }])).map(d => d.document_type_id).join('');

    return publicCall.id !== this.unmodified.id
      || publicCall.extra_information !== this.unmodified.extra_information
      || publicCall.name !== this.unmodified.name
      || publicCall.number !== this.unmodified.number
      || publicCall.process !== this.unmodified.process
      || publicCall.notice_url !== this.unmodified.notice_url
      || publicCall.public_session_url !== this.unmodified.public_session_url
      || publicCall.public_session_place !== this.unmodified.public_session_place
      || publicCall.notice_object !== this.unmodified.notice_object
      || publicCall.delivery_information !== this.unmodified.delivery_information
      || formatDateTime(new Date(publicCall.public_session_date)) !== (this.isAdd ? '' : formatDateTime(new Date(this.unmodified.public_session_date)))
      || formatDate(new Date(publicCall.registration_start_date)) !== (this.isAdd ? '' : formatDate(new Date(this.unmodified.registration_start_date)))
      || formatDate(new Date(publicCall.registration_end_date)) !== (this.isAdd ? '' : formatDate(new Date(this.unmodified.registration_end_date)))
      || documentIds !== unmodifiedDocumentIds
      || publicCall.foods.length !== this.unmodified.foods.length
      || publicCall.foods.length > 0 && this.unmodified.foods.length > 0 && (publicCall.foods[0].food_id !== this.unmodified.foods[0].food_id)
      || publicCall.foods.length > 0 && this.unmodified.foods.length > 0 && (publicCall.foods[0].price !== this.unmodified.foods[0].price)
      || publicCall.foods.length > 0 && this.unmodified.foods.length > 0 && (publicCall.foods[0].quantity !== this.unmodified.foods[0].quantity)
      || publicCall.is_active !== this.unmodified.is_active;
  }

  isDocumentValid() : boolean {
    let foodsWithDocumentAssociated: any[] = [];
    this.selectedDocuments.forEach(d => {
      d.foods.forEach(f => {
        if (f.is_associated && foodsWithDocumentAssociated.indexOf(f.food_id) === -1) {
          foodsWithDocumentAssociated.push(f.food_id);
        }
      });
    });

    const atLeastOneSelectedDocumentPerFood = foodsWithDocumentAssociated.length === this.foodControls.controls.length;

    if (!atLeastOneSelectedDocumentPerFood) {
      this.notificationService.showWarning('Todos os alimentos devem ter ao menos um documento obrigatório associado', 'Erro');
      return false;
    }

    return true;
  }

  isFoodValid() : boolean {
    if (this.foodControls.controls.length === 0) {
      this.notificationService.showWarning('Selecione ao menos um alimento', 'Erro');
      return false;
    }

    const existingFoodIds = this.foodControls.value.map((food: PublicCallFood) => food.food_id);
    const isDuplicate = existingFoodIds.some((id: any, index: any) => existingFoodIds.indexOf(id) !== index);

    if (isDuplicate) {
      this.notificationService.showWarning('Existem alimentos duplicados', 'Erro');
      return false;
    }

    return true;
  }

  loadCities() {
    const state_acronym = 'SP';
    const city_id = 3550308;
    this.loaderService.loaderName = 'spinnerAddress';

    this.citiesList = [];

    this.locationService.getCitiesJSON(state_acronym).subscribe({
      next: (ret) => {
        this.citiesList = ret;

        if (!isEmpty(city_id)) {
          this.publicCallForm.patchValue({ state_acronym: state_acronym, city_id: city_id });
        }

        this.loaderService.loaderName = null;
      },
      error: (err) => console.log(err)
    })
  }

  loadDocuments() {
    this.documentTypeService.getAll().subscribe({
      next: (ret) => {
        this.documentsList = ret.retorno.filter((d: SMEDocumentType) => (d.application === 1 || d.application === 3) && d.is_active)
          .sort(sort_by([{ 'name': 'name' }]));

        this.selectedDocuments = this.documentsList.map(d => ({ document_type_id: d.id, document_type_name: d.name, foods: [] }));

        this.buildFoodList();
      },
      error: (err) => console.log(err)
    })
  }

  loadFoods(food?: PublicCallFood) {
    this.foodService.getAll().subscribe({
      next: (ret) => {
        this.foodsList = ret.retorno.sort(sort_by([{ 'name': 'name' }]));

        if (food) {
          this.publicCallForm.patchValue({ food_id: food.food_id, food_price: food.price, food_quantity: food.quantity, accepts_organic: food.accepts_organic, is_organic: food.is_organic });
          const foodIndex = this.foodControls.value.findIndex((f: { id: string }) => f.id === food.id);
          this.changeFood(foodIndex, food.id!);
        }
      },
      error: (err) => console.log(err)
    })
  }

  openModal(content: any) {
    this.modalService.open(content, { centered: true });
  }

  removeDocumentFromProduct(foodId: string) {
    this.selectedDocuments.forEach(d => {
      const foodIndex = d.foods.findIndex(f => f.food_id === '' || f.food_id === foodId);
      if (foodIndex !== -1) {
        d.foods.splice(foodIndex, 1);
      }
    });
  }

  removeProduct(index: number) {
    const foodId = this.foodControls.value[index]['food_id'];
    this.foodControls.removeAt(index);

    this.removeDocumentFromProduct(foodId);
  }

  resultNext(ret: any, successfulMessage: string, errorMessage: string) {
    if (ret && ret.sucesso) {
      this.notificationService.showSuccess(successfulMessage, 'Sucesso!');
      this.unmodified = Object.assign({}, this.publicCall);
      this.goBack(true);
      return;
    }

    this.notificationService.showWarning(errorMessage, 'Erro');
  }

  setFormBuilder() {
    this.publicCallForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      number: ['', [Validators.required]],
      process: ['', [Validators.required]],
      notice_url: ['', [Validators.required]],
      public_session_url: ['', [Validators.required]],
      public_session_place: ['', [Validators.required]],
      notice_object: ['', [Validators.required]],
      extra_information: [''],
      delivery_information: ['', [Validators.required]],
      state_acronym: [{ value: 'SP', disabled: true }],
      public_session_date: ['', Validators.required],
      registration_start_date: ['', Validators.required],
      registration_end_date: ['', Validators.required],
      city_id: [{ value: 0, disabled: true }, [Validators.required, Validators.min(1)]],
      foods: this.formBuilder.array([]),
      isActive: [true]
    }, {
      validators: [
        DateValidator.validateRangeDates('registration_start_date', 'registration_end_date', 0, 0, true, false),
        DateValidator.validateRangeDates('registration_end_date', 'public_session_date', 0, 0, true, true)
      ]
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.publicCallForm.invalid) {
      focusOnFormError(this.publicCallForm.controls);
      return;
    }

    if (!this.isFoodValid())
      return;

    if (!this.isDocumentValid())
      return;

    this.publicCall = Object.assign({}, this.getFromFormBuilder());
    this.publicCall.city_id = this.f['city_id'].value;

    this.publicCall.documents = this.getDocumentsArray();
    this.publicCall.foods = Object.assign([], this.foodControls.getRawValue());

    this.publicCall.public_session_date = new Date(new Date(this.publicCall.public_session_date).toISOString());
    this.publicCall.registration_start_date = new Date(new Date(this.publicCall.registration_start_date).toISOString());
    this.publicCall.registration_end_date = new Date(new Date(this.publicCall.registration_end_date).toISOString());

    if (this.isAdd) {
      this.publicCall.id = uuidv4();
      this.publicCallService.add(this.publicCall).subscribe({
        next: (ret) => this.resultNext(ret, 'Chamada Pública criada', 'Não foi possível criar esta chamada pública'),
        error: (err) => console.log(err)
      });
    } else {
      this.publicCall.foods = this.publicCall.foods.map((f: any) => {
        f.public_call_id = this.publicCall.id;

        if (f.id === '')
          f.id = uuidv4();

        return f;
      });

      this.publicCallService.update(this.publicCall).subscribe({
        next: (ret) => this.resultNext(ret, 'Chamada Pública alterada', 'Não foi possível alterar esta chamada pública'),
        error: (err) => console.log(err)
      });
    }
  }

  onReset() {
    this.submitted = false;
    this.publicCallForm.reset();
  }

  get allFoodsSelected() {
    return this.foodControls.value.every((f: any) => f.food_id !== '');
  }

  get f() {
    return this.publicCallForm.controls;
  }

  get foodControls() {
    return this.publicCallForm.get('foods') as FormArray;
  }
}
