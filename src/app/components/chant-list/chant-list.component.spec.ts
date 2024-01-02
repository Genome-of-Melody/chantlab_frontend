import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChantListComponent } from './chant-list.component';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { SearchFilterComponent } from '../search-filter/search-filter.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

describe('ChantListComponent', () => {
  let component: ChantListComponent;
  let fixture: ComponentFixture<ChantListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        MatCheckboxModule,
        MatPaginatorModule,
        BrowserAnimationsModule,
        MatIconModule,
        FormsModule
      ],
      declarations: [
        ChantListComponent,
        SearchFilterComponent
      ],
      providers: [
        {provide: MatDialog, useValue: {}}
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
