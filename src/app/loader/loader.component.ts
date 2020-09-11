import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
@Input() show;
  constructor() { }

  ngOnInit(): void {
    console.log(this.show,"show in loader");
  }

}
