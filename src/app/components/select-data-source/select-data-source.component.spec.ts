import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectDataSourceComponent } from './select-data-source.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('SelectDataSourceComponent', () => {
  let component: SelectDataSourceComponent;
  let fixture: ComponentFixture<SelectDataSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [SelectDataSourceComponent],
    imports: [],
    providers: [{ provide: MatDialog, useValue: {} }, provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDataSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
