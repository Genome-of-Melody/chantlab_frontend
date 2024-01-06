import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChantDetailDialogComponent } from './chant-detail-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ChantDetailsComponent } from '../../chant-details/chant-details.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';


describe('ChantDetailDialogComponent', () => {
  let component: ChantDetailDialogComponent;
  let fixture: ComponentFixture<ChantDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        HttpClientTestingModule,
        RouterModule.forRoot([])
      ],
      declarations: [
        ChantDetailDialogComponent,
        ChantDetailsComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChantDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
