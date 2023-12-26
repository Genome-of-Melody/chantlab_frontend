import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChantFetchComponent } from './chant-fetch.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ChantFetchComponent', () => {
  let component: ChantFetchComponent;
  let fixture: ComponentFixture<ChantFetchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ ChantFetchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChantFetchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
