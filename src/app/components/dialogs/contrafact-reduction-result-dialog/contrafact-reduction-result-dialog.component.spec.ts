import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContrafactReductionResultDialogComponent } from './contrafact-reduction-result-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

describe('ContrafactReductionResultDialogComponent', () => {
  let component: ContrafactReductionResultDialogComponent;
  let fixture: ComponentFixture<ContrafactReductionResultDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MatDialogModule ],
      declarations: [ ContrafactReductionResultDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContrafactReductionResultDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
