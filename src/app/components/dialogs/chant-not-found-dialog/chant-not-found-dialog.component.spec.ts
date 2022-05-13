import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChantNotFoundDialogComponent } from './chant-not-found-dialog.component';

describe('ChantNotFoundDialogComponent', () => {
  let component: ChantNotFoundDialogComponent;
  let fixture: ComponentFixture<ChantNotFoundDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChantNotFoundDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChantNotFoundDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
