import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog, MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-select-entity-modal',
  templateUrl: './select-entity-modal.component.html',
  styleUrls: ['./select-entity-modal.component.scss']
})
export class SelectEntityModalComponent implements OnInit {
  @Inject(MAT_DIALOG_DATA) public data: any
  constructor(public dialog: MatDialog, private dialogRef: MatDialogRef<SelectEntityModalComponent>) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    console.log(this.data,"data");
  }
  close() {
    this.dialog.closeAll();
  }
}
