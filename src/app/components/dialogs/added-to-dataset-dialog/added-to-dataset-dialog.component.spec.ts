import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddedToDatasetDialogComponent } from './added-to-dataset-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

describe('AddedToDatasetDialogComponent', () => {
  let component: AddedToDatasetDialogComponent;
  let fixture: ComponentFixture<AddedToDatasetDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MatDialogModule ],
      declarations: [ AddedToDatasetDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddedToDatasetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
