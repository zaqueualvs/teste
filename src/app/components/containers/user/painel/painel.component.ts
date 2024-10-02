import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatToolbarModule} from "@angular/material/toolbar";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatButton, MatIconButton} from "@angular/material/button";
import {User} from "../../../model/user";
import {MatFormFieldModule} from "@angular/material/form-field";
import {
  FormArray, FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from "@angular/forms";
import {editFormValidators} from "../../../shared/forms/edit-form-validators.util";
import {MatInput} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {AsyncPipe, DatePipe, NgStyle} from "@angular/common";
import {MatOption, MatSelect, MatSelectChange} from "@angular/material/select";
import {Category} from "../../../model/category";
import {PublicService} from "../../../services/public/public.service";
import {Observable} from "rxjs";
import {
  MatAccordion,
  MatExpansionModule,
  MatExpansionPanelDescription,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {DialogEducationComponent} from "../dialog-education/dialog-education.component";
import {MatDialog} from "@angular/material/dialog";
import {Education} from "../../../model/education";
import {ProfessionalExperience} from "../../../model/professional-experience";
import {DialogExperienceComponent} from "../dialog-experience/dialog-experience.component";
import {UserService} from "../../../services/user/user.service";
import {AuthService} from "../../../services/auth/auth.service";
import {DialogRechargeComponent} from "../dialog-recharge/dialog-recharge.component";

@Component({
  selector: 'app-painel',
  standalone: true,
  imports: [
    MatCardModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatButton,
    MatFormFieldModule,
    MatInput,
    ReactiveFormsModule,
    MatIcon,
    NgStyle,
    MatIconButton,
    MatSelect,
    MatOption,
    AsyncPipe,
    MatAccordion,
    MatExpansionModule,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    DatePipe,
    RouterLink
  ],
  templateUrl: './painel.component.html',
  styleUrl: './painel.component.scss'
})
export class PainelComponent implements OnInit, OnDestroy {
  user: User | null = null;
  categories$: Observable<Category[]> | null = null;
  form!: FormGroup;
  //readonly passwordConfirm = new FormControl('', Validators.required);
  errorMessageEmail = signal('');
  errorMessagePassword = signal('');
  errorMessagePhone = signal('');
  errorMessageName = signal('');
  readonly dialog = inject(MatDialog);


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: NonNullableFormBuilder,
    private publicService: PublicService,
    private userService: UserService,
    private authService : AuthService
  ) {
  }

  ngOnInit(): void {
    this.user = this.route.snapshot.data['user'];
    this.form = this.formBuilder.group({
      ...editFormValidators(this.user, this.formBuilder),
      categories: [this.user?.categories?.map(category => category.id) || []],
    });
    this.categories$ = this.publicService.listAllCategories();
    console.log(this.form.value);
  }
  ngOnDestroy(): void {
    this.authService.cleanToken();
  }

  setFileData(event: Event): void {
    const eventTarget: HTMLInputElement | null = event.target as HTMLInputElement | null;
    if (eventTarget?.files?.[0]) {
      const file: File = eventTarget.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        this.form.get('photo')?.setValue(reader.result as string);
      });
      reader.readAsDataURL(file);
    }
  }

  getShowMessage() {
    return this.form.get('show')?.value ? 'Perfil em exibição' : 'Perfil oculto';
  }

  t() {
    console.log(this.form.value);
  }

  openDialogEducation(education: Education | null): void {
    const educations = this.form.get('resume.educations') as FormArray;
    const dialogRef = this.dialog.open(DialogEducationComponent, {data: education});
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        const index = educations.controls.findIndex((ctrl) => ctrl.value === education);
        this.addEducation(result, educations, index);
      }
    });
  }

  openDialogExperience(experience: ProfessionalExperience | null): void {
    const experiences = this.form.get('resume.professionalExperiences') as FormArray;
    const dialogRef = this.dialog.open(DialogExperienceComponent, {data: experience});
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        const index = experiences.controls.findIndex((ctrl) => ctrl.value === experience);
        this.addExperience(result, experiences, index);
      }
    });
  }
  openDialogRecharge(){
    this.dialog.open(DialogRechargeComponent, {})
  }

  updateUser() {
    if (this.form.valid) {
      this.userService.updateUser(this.form.value).subscribe();
      window.location.reload();
    }
  }

  private addEducation(education: any, formArray: FormArray, index: number) {
    if (index === -1) {
      formArray.push(this.educationToForm(education));
    } else {
      formArray.at(index).patchValue(education);
    }
  }

  private educationToForm(education: any) {
    return this.formBuilder.group({
      id: [education?.id],
      status: this.formBuilder.group({
        cod: [education?.status?.cod],
        description: [education?.status.description],
      }),
      academicDegree: this.formBuilder.group({
        cod: [education?.academicDegree?.cod],
        description: [education?.academicDegree.description],
      }),
      course: [education?.course],
      institution: [education?.institution],
      description: [education?.description],
    })
  }

  private addExperience(experience: any, formArray: FormArray, index: number) {
    if (index === -1) {
      formArray.push(this.experienceToForm(experience));
    } else {
      formArray.at(index).patchValue(experience);
    }
  }

  private experienceToForm(experience: ProfessionalExperience) {
    return this.formBuilder.group({
      id: [experience.id],
      position: [experience.position],
      company: [experience.company],
      description: [experience.description],
      startDate: [experience.startDate],
      endDate: [experience.endDate],
      isCurrent: [experience.isCurrent],
    })
  }
}
