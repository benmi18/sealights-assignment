import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCityDialogComponent } from './add-city-dialog.component';

describe('AddCityDialogComponent', () => {
  let component: AddCityDialogComponent;
  let fixture: ComponentFixture<AddCityDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCityDialogComponent]
    });
    fixture = TestBed.createComponent(AddCityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
