import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataUploadComponent } from './data-upload.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { DatasetListComponent } from '../dataset-list/dataset-list.component';
import { FormsModule } from '@angular/forms';

describe('DataUploadComponent', () => {
  let component: DataUploadComponent;
  let fixture: ComponentFixture<DataUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatCardModule,
        MatInputModule,
        MatFormFieldModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
        FormsModule
      ],
      declarations: [
        DataUploadComponent,
        DatasetListComponent
      ],
      providers: [
        {provide: MatDialog, useValue: {}}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
