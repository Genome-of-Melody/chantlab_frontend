import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotEnoughToRemoveDialogComponent } from './not-enough-to-remove-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

describe('NotEnoughToRemoveDialogComponent', () => {
  let component: NotEnoughToRemoveDialogComponent;
  let fixture: ComponentFixture<NotEnoughToRemoveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MatDialogModule ],
      declarations: [ NotEnoughToRemoveDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotEnoughToRemoveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
