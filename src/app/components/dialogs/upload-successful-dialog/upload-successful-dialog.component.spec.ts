import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadSuccessfulDialogComponent } from './upload-successful-dialog.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

describe('UploadSuccessfulDialogComponent', () => {
  let component: UploadSuccessfulDialogComponent;
  let fixture: ComponentFixture<UploadSuccessfulDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MatDialogModule ],
      declarations: [ UploadSuccessfulDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadSuccessfulDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
