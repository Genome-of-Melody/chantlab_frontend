import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VolpianoUpdatedDialogComponent } from './volpiano-updated-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

describe('VolpianoUpdatedDialogComponent', () => {
  let component: VolpianoUpdatedDialogComponent;
  let fixture: ComponentFixture<VolpianoUpdatedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MatDialogModule ],
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
