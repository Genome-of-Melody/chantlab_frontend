import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChantFetchComponent } from './chant-fetch.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ChantDetailsComponent } from '../chant-details/chant-details.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

describe('ChantFetchComponent', () => {
  let component: ChantFetchComponent;
  let fixture: ComponentFixture<ChantFetchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatDialogModule
      ],
      declarations: [
        ChantFetchComponent,
        ChantDetailsComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChantFetchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
