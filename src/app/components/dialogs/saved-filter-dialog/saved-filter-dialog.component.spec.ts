import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SavedFilterDialogComponent } from './saved-filter-dialog.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

describe('SavedFilterDialogComponent', () => {
  let component: SavedFilterDialogComponent;
  let fixture: ComponentFixture<SavedFilterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MatDialogModule ],
      declarations: [ SavedFilterDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
