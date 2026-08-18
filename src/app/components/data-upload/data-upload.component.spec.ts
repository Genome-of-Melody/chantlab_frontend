import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataUploadComponent } from './data-upload.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { DatasetListComponent } from '../dataset-list/dataset-list.component';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('DataUploadComponent', () => {
  let component: DataUploadComponent;
  let fixture: ComponentFixture<DataUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [
        DataUploadComponent,
        DatasetListComponent
    ],
    imports: [MatCardModule,
        MatInputModule,
        MatFormFieldModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
        FormsModule],
    providers: [
        { provide: MatDialog, useValue: {} },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting()
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
