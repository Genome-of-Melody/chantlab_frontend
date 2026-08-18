import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChantListWrapperComponent } from './chant-list-wrapper.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ChantListComponent } from '../chant-list/chant-list.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { SearchFilterComponent } from '../search-filter/search-filter.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('ChantListWrapperComponent', () => {
  let component: ChantListWrapperComponent;
  let fixture: ComponentFixture<ChantListWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [
        ChantListComponent,
        ChantListWrapperComponent,
        SearchFilterComponent
    ],
    imports: [RouterTestingModule,
        MatDialogModule,
        MatPaginatorModule,
        MatCheckboxModule,
        MatIconModule,
        FormsModule,
        BrowserAnimationsModule],
    providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChantListWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
