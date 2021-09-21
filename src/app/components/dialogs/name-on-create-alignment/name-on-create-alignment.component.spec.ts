import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameOnCreateAlignmentComponent } from './name-on-create-alignment.component';

describe('NameOnCreateAlignmentComponent', () => {
  let component: NameOnCreateAlignmentComponent;
  let fixture: ComponentFixture<NameOnCreateAlignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NameOnCreateAlignmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NameOnCreateAlignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
