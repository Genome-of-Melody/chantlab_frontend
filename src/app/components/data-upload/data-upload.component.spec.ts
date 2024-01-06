import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataUploadComponent } from './data-upload.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
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
