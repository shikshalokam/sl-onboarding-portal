import { Component, OnInit } from '@angular/core';
import { OnboardService } from './onboard.service';
import { MatDialog } from '@angular/material/dialog';
import { SelectEntityModalComponent } from '../select-entity-modal/select-entity-modal.component';
@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.scss']
})
export class OnboardComponent implements OnInit {
  states;
  roles;
  list=[
    {
      name:'a1',
      _id:'12'
    },{
      name:'a2',
      _id:'13'
    },{
      name:'a3',
      _id:'13'
    },{
      name:'a4',
      _id:'14'
    },{
      name:'a5',
      _id:'15'
    },{
      name:'a6',
      _id:'16'
    },{
      name:'a7',
      _id:'17'
    },{
      name:'a8',
      _id:'18'
    },{
      name:'a1',
      _id:'12'
    },{
      name:'a1',
      _id:'12'
    },{
      name:'a1',
      _id:'12'
    },{
      name:'a1',
      _id:'12'
    }
  ]
  showLoader: boolean = false;
  constructor(public onboardService: OnboardService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getProfileData();
  }
  openDialog(event) {
    const dialogRef = this.dialog.open(SelectEntityModalComponent,{
      data: {
        data: this.list
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  onFocusEvent(event) {
    this.openDialog(event)
  }
  getsubEntity(event) {
    console.log(event, "event");
  }
  getRoles(event) {
    this.getRolesEntity(event.value)
  }
  getProfileData() {
    this.showLoader = true;
    this.onboardService.getProfileData().subscribe((data: any) => {
      if (!data.roles) {
        this.getState();
      }
      this.showLoader = false;
    }, error => {
      this.showLoader = false;
      console.log(error, "error")
    })
  }
  getState() {
    this.showLoader = true;
    this.onboardService.getState().subscribe((data: any) => {
      this.states = data.result && data.result.length ? data.result : [];
      this.showLoader = false;
    }, error => {
      this.showLoader = false;
      console.log(error, "error")
    })
  }
  getRolesEntity(id) {
    this.showLoader = true;
    this.onboardService.getRole(id).subscribe((data: any) => {
      this.roles = data.result && data.result.length ? data.result : [];
      this.showLoader = false;
    }, error => {
      this.showLoader = false;
      console.log(error, "error")
    })
  }

}
