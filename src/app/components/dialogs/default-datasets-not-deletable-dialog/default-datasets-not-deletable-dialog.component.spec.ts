import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DefaultDatasetsNotDeletableDialogComponent } from './default-datasets-not-deletable-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

describe('DefaultDatasetsNotDeletableDialogComponent', () => {
  let component: DefaultDatasetsNotDeletableDialogComponent;
  let fixture: ComponentFixture<DefaultDatasetsNotDeletableDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MatDialogModule ],
      declarations: [ DefaultDatasetsNotDeletableDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultDatasetsNotDeletableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
