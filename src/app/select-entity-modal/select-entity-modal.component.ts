import { Component, OnInit, Inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OnboardService } from '../onboard/onboard.service';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, filter } from 'rxjs/operators';


@Component({
  selector: 'app-select-entity-modal',
  templateUrl: './select-entity-modal.component.html',
  styleUrls: ['./select-entity-modal.component.scss']
})
export class SelectEntityModalComponent implements OnInit, AfterViewInit {
  @ViewChild('input', { read: ElementRef }) input: ElementRef;

  search: string = '';
  page: number = 1;
  limit: number = 100;
  entityList: Array<any> = [];
  selectedIndex: number = -1;
  totalCount: number = 0;
  enableLoader: boolean = false;
  constructor(public dialog: MatDialog, private dialogRef: MatDialogRef<SelectEntityModalComponent>,
    private onboardService: OnboardService, @Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    console.log(this.data, "data");
    console.log(this.input)

    this.getEntityList();
  }

  ngAfterViewInit() {
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(500),
        distinctUntilChanged(),
        tap((text) => {
          this.page = 1;
          this.search = this.input.nativeElement.value;
          this.entityList = [];
          this.getEntityList();
          this.enableLoader = false;
        })
      )
      .subscribe();
  }

  onSelection(value) {
    console.log(value)
    this.selectedIndex = value
    // alert(value);
  }

  getEntityList() {
    this.selectedIndex = -1;
    const param = `${this.data.highestEntity}?type=${this.data.entityType}&search=${this.search}&page=${this.page}&limit=${this.limit}`
    this.onboardService.getSubEntityList(param).subscribe((data: any) => {
      this.totalCount = data.result.count;
      // this.entityList = (data.result.data && data.result.data.length) ? this.entityList.concat(data.result.data) : this.entityList;
      this.entityList = [...this.entityList, ...data.result.data];
      this.enableLoader = this.totalCount > (this.limit*this.page)
      // (data.result.roles && data.result.roles.length) ? this.showPreview = true : this.getState();
      // this.profileRoles = data.result.roles;
      // this.getStatesValue();
      // this.showLoader = false;
    }, error => {
      // this.showLoader = false;
      // console.log(error, "error")
    })
  }


  close(action) {
    if (action === 'cancel') {
      this.dialogRef.close();
    } else {
      const obj = {
        label: this.entityList[this.selectedIndex].label,
        _id: this.entityList[this.selectedIndex]._id
      }
      this.dialogRef.close(obj)
    }
  }

  loadMore() {
    if (this.page * this.limit < this.totalCount) {
      this.page++;
      this.getEntityList();
    }
  }
}
