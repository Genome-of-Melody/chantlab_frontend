import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdxOnAddToDatasetComponent } from './idx-on-add-to-dataset.component';

describe('IdxOnAddToDatasetComponent', () => {
  let component: IdxOnAddToDatasetComponent;
  let fixture: ComponentFixture<IdxOnAddToDatasetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdxOnAddToDatasetComponent ]
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
