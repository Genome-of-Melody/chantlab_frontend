import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlignmentManagerComponent } from './alignment-manager.component';

describe('AlignmentManagerComponent', () => {
  let component: AlignmentManagerComponent;
  let fixture: ComponentFixture<AlignmentManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlignmentManagerComponent ]
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
