import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectEntityModalComponent } from './select-entity-modal.component';

describe('SelectEntityModalComponent', () => {
  let component: SelectEntityModalComponent;
  let fixture: ComponentFixture<SelectEntityModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectEntityModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectEntityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
