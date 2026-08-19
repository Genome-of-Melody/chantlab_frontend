import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SnapshotExportFailedDialogComponent } from './snapshot-export-failed-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

describe('SnapshotExportFailedDialogComponent', () => {
  let component: SnapshotExportFailedDialogComponent;
  let fixture: ComponentFixture<SnapshotExportFailedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MatDialogModule ],
      declarations: [ SnapshotExportFailedDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnapshotExportFailedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
