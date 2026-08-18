import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlignmentListComponent } from './alignment-list.component';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';

describe('AlignmentListComponent', () => {
  let component: AlignmentListComponent;
  let fixture: ComponentFixture<AlignmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlignmentListComponent ],
      imports: [FormsModule, MatRadioModule],
      providers: [
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlignmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
