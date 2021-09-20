import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlignedPageComponent } from './aligned-page.component';

describe('AlignedPageComponent', () => {
  let component: AlignedPageComponent;
  let fixture: ComponentFixture<AlignedPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlignedPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlignedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
