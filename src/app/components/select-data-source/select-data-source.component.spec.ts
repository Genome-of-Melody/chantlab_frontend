import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectDataSourceComponent } from './select-data-source.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

describe('SelectDataSourceComponent', () => {
  let component: SelectDataSourceComponent;
  let fixture: ComponentFixture<SelectDataSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ SelectDataSourceComponent ],
      providers: [{provide: MatDialog, useValue: {}}]
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
