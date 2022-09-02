import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CssFieldComponent } from './css-field.component';

describe('CssFieldComponent', () => {
  let component: CssFieldComponent;
  let fixture: ComponentFixture<CssFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CssFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CssFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
