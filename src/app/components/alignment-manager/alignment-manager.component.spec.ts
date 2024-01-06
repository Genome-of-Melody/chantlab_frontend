import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlignmentManagerComponent } from './alignment-manager.component';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { AlignmentListComponent } from './alignment-list/alignment-list.component';

describe('AlignmentManagerComponent', () => {
  let component: AlignmentManagerComponent;
  let fixture: ComponentFixture<AlignmentManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        MatCardModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        BrowserAnimationsModule
      ],
      declarations: [
        AlignmentManagerComponent,
        AlignmentListComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlignmentManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
