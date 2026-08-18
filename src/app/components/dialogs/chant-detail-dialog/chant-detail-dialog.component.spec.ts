import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChantDetailDialogComponent } from './chant-detail-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ChantDetailsComponent } from '../../chant-details/chant-details.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';


describe('ChantDetailDialogComponent', () => {
  let component: ChantDetailDialogComponent;
  let fixture: ComponentFixture<ChantDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [
        ChantDetailDialogComponent,
        ChantDetailsComponent
    ],
    imports: [MatDialogModule,
        RouterModule.forRoot([])],
    providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
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
