import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChantListComponent } from './chant-list.component';
import { RouterModule } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { SearchFilterComponent } from '../search-filter/search-filter.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('ChantListComponent', () => {
  let component: ChantListComponent;
  let fixture: ComponentFixture<ChantListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [
        ChantListComponent,
        SearchFilterComponent
    ],
    imports: [RouterModule.forRoot([]),
        MatCheckboxModule,
        MatPaginatorModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatProgressSpinnerModule,
        FormsModule],
    providers: [
        { provide: MatDialog, useValue: {} },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChantListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
