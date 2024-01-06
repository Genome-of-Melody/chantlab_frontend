import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChantNotFoundDialogComponent } from './chant-not-found-dialog.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

describe('ChantNotFoundDialogComponent', () => {
  let component: ChantNotFoundDialogComponent;
  let fixture: ComponentFixture<ChantNotFoundDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MatDialogModule ],
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
