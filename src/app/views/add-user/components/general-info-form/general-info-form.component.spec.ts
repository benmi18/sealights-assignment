import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralInfoFormComponent } from './general-info-form.component';

describe('GeneralInfoFormComponent', () => {
  let component: GeneralInfoFormComponent;
  let fixture: ComponentFixture<GeneralInfoFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneralInfoFormComponent]
    });
    fixture = TestBed.createComponent(GeneralInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
