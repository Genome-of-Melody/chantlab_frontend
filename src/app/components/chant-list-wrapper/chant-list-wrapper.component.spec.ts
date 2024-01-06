import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChantListWrapperComponent } from './chant-list-wrapper.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ChantListComponent } from '../chant-list/chant-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { SearchFilterComponent } from '../search-filter/search-filter.component';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { FormsModule } from '@angular/forms';

describe('ChantListWrapperComponent', () => {
  let component: ChantListWrapperComponent;
  let fixture: ComponentFixture<ChantListWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatPaginatorModule,
        MatCheckboxModule,
        MatIconModule,
        FormsModule,
        BrowserAnimationsModule
      ],
      declarations: [
        ChantListComponent,
        ChantListWrapperComponent,
        SearchFilterComponent
      ]
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
