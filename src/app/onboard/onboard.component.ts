import { Component, OnInit } from '@angular/core';
import { OnboardService } from './onboard.service';
import { MatDialog } from '@angular/material/dialog';
import { SelectEntityModalComponent } from '../select-entity-modal/select-entity-modal.component';
import { KeycloakService } from 'keycloak-angular';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.scss']
})
export class OnboardComponent implements OnInit {
  states;
  roles;
  showPreview: boolean = false;
  userName: string;
  profileRoles: any;
  userState: string;
  formObj: {
    state: "",
    role: ""
  }
  entityTypeForm = [];
  dynamicForm = [];


  selectedState;
  selectedRole;
  formGroup: FormGroup;
  showLoader: boolean = false;
  constructor(public onboardService: OnboardService,
    public dialog: MatDialog, private keycloak: KeycloakService,
    public fb: FormBuilder) { }

  ngOnInit(): void {
    this.getProfileData();
    this.userName = this.keycloak.getUsername();
  }

  openDialog(index, entityType, event) {
    event.target.blur();
    const formValue = this.formGroup.value;
    console.log(index)
    console.log(JSON.stringify(formValue));
    let highestEntity;
    for (const element of Object.keys(formValue)) {
      if (formValue[element] && (element !== 'role') && element !== entityType) {
        highestEntity = formValue[element]
      } else if (element === entityType) {
        break
      }
    }
    const dialogRef = this.dialog.open(SelectEntityModalComponent, {
      height: '100vh',
      width: '100vw',
      data: {
        entityType: entityType,
        highestEntity: highestEntity
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result) {
        this.dynamicForm[index].options = [result];
        const obj = {}
        obj[entityType] = result._id;
        // this.formGroup.controls[entityType].patchValue(result._id);
        // let obj = {}
        for (let i = index + 1; i < this.dynamicForm.length; i++) {
          obj[this.dynamicForm[i]['field']] = "";
          this.dynamicForm[i]['options'] = []
          console.log(this.formGroup.value)
        }
        console.log(obj)
        this.formGroup.patchValue(obj);
      }

    });
  }

  getsubEntity(event) {
    console.log(event, "event");
  }

  getProfileData() {
    this.showLoader = true;
    this.onboardService.getProfileData().subscribe((data: any) => {
      if(data.result.roles && data.result.roles.length){
        this.showPreview = true;
        this.profileRoles = data.result.roles;
        this.getStatesValue();
      } else {
        this.getState()
      }
      this.showLoader = false;
      // (data.result.roles && data.result.roles.length) ? this.showPreview = true : this.getState();
      // this.profileRoles = data.result.roles;
      // this.getStatesValue();
      // this.showLoader = false;
    }, error => {
      this.showLoader = false;
      console.log(error, "error")
    })
  }

  getStatesValue() {
    for (const role of this.profileRoles) {
      for (const entity of role.entities) {
        if (entity.entityType === 'state') {
          this.userState = entity.name;
        }
        for (const subEntity of entity.relatedEntities) {
          if (subEntity.entityType === 'state') {
            this.userState = subEntity.metaInformation.name;
          }
        }
      }

    }
  }
  getState() {
    // this.showLoader = true;
    this.onboardService.getState().subscribe((data: any) => {
      this.states = data.result && data.result.count ? data.result.data : [];
      // this.formGroup.addControl('state', new FormControl('',  Validators.required))
      this.dynamicForm.push(
        {
          "field": "state",
          "label": "State",
          "value": "",
          "options": data.result.data,
          "visible": true,
          "editable": true,
          "input": "text",
          "validation": {
            "required": true
          }
        }
      )
      this.formGroup = this.fb.group(
        {
          state: ['', [Validators.required]]
        }
      );

      this.formGroup.get("state").valueChanges.subscribe(selectedState => {
        // this.formGroup.removeControl('role');
        // this.getRolesForState(selectedState);
        if (!this.formGroup.get('role')) {
          this.getRolesForState(selectedState);
        }
        else {
          this.formGroup.removeControl('role');
          this.dynamicForm.length = 2;
          this.getRolesForState(selectedState);
        }
      })
      // this.showLoader = false;
    }, error => {
      // this.showLoader = false;
      console.log(error, "error")
    })
  }

  checkIfAlreadyInDynamicJson(key, options): boolean {
    for (const element of this.dynamicForm) {
      if (key === element.field) {
        element.options = options;
        return true
      }
    }
    return false
  }

  getRolesForState(id) {
    // this.showLoader = true;
    this.onboardService.getRole(id).subscribe((data: any) => {
      this.roles = data.result && data.result.length ? data.result : [];
      // this.showLoader = false;
      if (!this.checkIfAlreadyInDynamicJson('role', this.roles)) {
        this.dynamicForm.push(
          {
            "field": "role",
            "label": "Role",
            "value": "",
            "options": this.roles,
            "visible": true,
            "editable": true,
            "input": "text",
            "validation": {
              "required": true
            }
          }
        )
      }

      this.formGroup.addControl('role', new FormControl('', [Validators.required]));
      this.formGroup.get("role").valueChanges.subscribe(selectedState => {
        this.resetSubEntitiesForm();
        //removing all elements of array other than role and state
        this.dynamicForm.length = 2
        this.getSubEntitiesForm(selectedState);

      })
    }, error => {
      // this.showLoader = false;
      console.log(error, "error")
    })
  }

  resetSubEntitiesForm() {
    for (const element of this.entityTypeForm) {
      this.formGroup.get(element.field) ? this.formGroup.removeControl(element.field) : null;
      let index = 0;
    }
  }

  getSubEntitiesForm(roleId) {
    const url = `${this.formGroup.get('state').value}?roleId=${this.formGroup.get('role').value}`
    this.onboardService.getSubEntityForm(url).subscribe((data: any) => {
      this.entityTypeForm = data.result;
      for (const element of this.entityTypeForm) {
        element.input = "special-select";
        const validation = element.validation.required ? new FormControl('', Validators.required) : new FormControl('', []);
        this.formGroup.addControl(element.field, validation)
      }
      this.dynamicForm = this.dynamicForm.concat(this.entityTypeForm)
      console.log(this.dynamicForm)
    }, error => {
      this.showLoader = false;
      console.log(error, "error")
    })
  }

  removeChip(index) {
    let obj = {}
    for (let i = index; i < this.dynamicForm.length; i++) {
      obj[this.dynamicForm[i]['field']] = "";
      this.dynamicForm[i]['options'] = []
      console.log(this.formGroup.value)
    }
    this.formGroup.patchValue(obj);
  }

  submitForm() {
    console.log(this.formGroup.value);
    const formValue = this.formGroup.value;
    const keyEntity = []
    for (const field of this.dynamicForm) {
      if (field.validation.required && field.input === 'special-select') {
        keyEntity.push(field.field)
      }
    }
    const entities = [];
    for (const entity of keyEntity) {
      entities.push(formValue[entity])
    }
    const payload = {
      stateId: formValue.state,
      roles: [
        {
          _id: formValue.role,
          entities: entities
        }
      ]
    }
    console.log(payload)
    this.showLoader = true;
    const url = ""
    this.onboardService.profileUpdate(payload).subscribe((data: any) => {
      // this.showLoader = false;
      this.getProfileData();
    }, error => {
      this.showLoader = false;
      console.log(error, "error")
    })
  }

}
