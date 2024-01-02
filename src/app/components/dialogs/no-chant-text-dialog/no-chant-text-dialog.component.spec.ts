import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoChantTextDialogComponent } from './no-chant-text-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

describe('NoChantTextDialogComponent', () => {
  let component: NoChantTextDialogComponent;
  let fixture: ComponentFixture<NoChantTextDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MatDialogModule ],
      declarations: [ NoChantTextDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoChantTextDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
