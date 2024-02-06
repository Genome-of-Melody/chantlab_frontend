import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NameOnCreateAlignmentComponent } from './name-on-create-alignment.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('NameOnCreateAlignmentComponent', () => {
  let component: NameOnCreateAlignmentComponent;
  let fixture: ComponentFixture<NameOnCreateAlignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatDialogModule
      ],
      declarations: [ NameOnCreateAlignmentComponent ],
      providers: [
              {provide: MatDialogRef, useValue: {}},
              {provide: MAT_DIALOG_DATA, useValue: []}
            ]
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
