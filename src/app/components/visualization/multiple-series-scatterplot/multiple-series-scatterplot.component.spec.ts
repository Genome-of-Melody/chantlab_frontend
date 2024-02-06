import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MultipleSeriesScatterplotComponent } from './multiple-series-scatterplot.component';
import { RouterModule } from '@angular/router';

describe('MultipleSeriesScatterplotComponent', () => {
  let component: MultipleSeriesScatterplotComponent;
  let fixture: ComponentFixture<MultipleSeriesScatterplotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RouterModule.forRoot([]) ],
      declarations: [ MultipleSeriesScatterplotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleSeriesScatterplotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
