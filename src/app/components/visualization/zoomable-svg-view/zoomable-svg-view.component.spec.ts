import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomableSvgViewComponent } from './zoomable-svg-view.component';

describe('ZoomableSvgViewComponent', () => {
  let component: ZoomableSvgViewComponent;
  let fixture: ComponentFixture<ZoomableSvgViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoomableSvgViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoomableSvgViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
