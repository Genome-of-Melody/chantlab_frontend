import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolpianoUpdatedDialogComponent } from './volpiano-updated-dialog.component';

describe('VolpianoUpdatedDialogComponent', () => {
  let component: VolpianoUpdatedDialogComponent;
  let fixture: ComponentFixture<VolpianoUpdatedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VolpianoUpdatedDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VolpianoUpdatedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
