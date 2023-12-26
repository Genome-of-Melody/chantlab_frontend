import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlignedComponent } from './aligned.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';

describe('AlignedComponent', () => {
  let component: AlignedComponent;
  let fixture: ComponentFixture<AlignedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlignedComponent ],
      imports: [HttpClientTestingModule],
      providers: [
        {provide: MatDialog, useValue: {}}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
