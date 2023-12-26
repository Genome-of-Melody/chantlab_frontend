import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlignmentManagerComponent } from './alignment-manager.component';
import { RouterModule } from '@angular/router';

describe('AlignmentManagerComponent', () => {
  let component: AlignmentManagerComponent;
  let fixture: ComponentFixture<AlignmentManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RouterModule.forRoot([]) ],
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
