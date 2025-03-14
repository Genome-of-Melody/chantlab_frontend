import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotEnoughToAlignDialogComponent } from './not-enough-to-aling-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

describe('NotEnoughToAlignDialogComponent', () => {
  let component: NotEnoughToAlignDialogComponent;
  let fixture: ComponentFixture<NotEnoughToAlignDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MatDialogModule ],
      declarations: [ NotEnoughToAlignDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotEnoughToAlignDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
