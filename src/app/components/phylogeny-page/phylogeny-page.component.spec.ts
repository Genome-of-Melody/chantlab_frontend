import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhylogenyPageComponent } from './phylogeny-page.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PhylogenyService } from '../../services/phylogeny.service';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('PhylogenyPageComponent', () => {
  let component: PhylogenyPageComponent;
  let fixture: ComponentFixture<PhylogenyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [PhylogenyPageComponent],
    imports: [RouterTestingModule,
        MatProgressSpinnerModule],
    providers: [
        { provide: MatDialog, useValue: {} },
        {
          provide: PhylogenyService,
          useValue: {
            newick: '(test:1)',
            mrBayesScript: '',
            nexusAlignment: '',
            nexusConTre: '',
            alignmentForPhylogeny: { alpianos: [''], ids: [0] },
          }
        },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhylogenyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
