import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkGraphWrapperComponent } from './network-graph-wrapper.component';

describe('NetworkGraphWrapperComponent', () => {
  let component: NetworkGraphWrapperComponent;
  let fixture: ComponentFixture<NetworkGraphWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetworkGraphWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkGraphWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
