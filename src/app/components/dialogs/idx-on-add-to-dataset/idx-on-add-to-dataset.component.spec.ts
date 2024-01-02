import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IdxOnAddToDatasetComponent } from './idx-on-add-to-dataset.component';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

describe('IdxOnAddToDatasetComponent', () => {
  let component: IdxOnAddToDatasetComponent;
  let fixture: ComponentFixture<IdxOnAddToDatasetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatRadioModule,
        FormsModule,
        MatDialogModule
      ],
      declarations: [ IdxOnAddToDatasetComponent ],
      providers: [
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: []}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdxOnAddToDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
