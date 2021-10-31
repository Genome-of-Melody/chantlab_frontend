import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddedToDatasetDialogComponent } from './added-to-dataset-dialog.component';

describe('AddedToDatasetDialogComponent', () => {
  let component: AddedToDatasetDialogComponent;
  let fixture: ComponentFixture<AddedToDatasetDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
