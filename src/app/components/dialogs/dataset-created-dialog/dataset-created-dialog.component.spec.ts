import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatasetCreatedDialogComponent } from './dataset-created-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

describe('DatasetCreatedDialogComponent', () => {
  let component: DatasetCreatedDialogComponent;
  let fixture: ComponentFixture<DatasetCreatedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MatDialogModule ],
      declarations: [ DatasetCreatedDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetCreatedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
