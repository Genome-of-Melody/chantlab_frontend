import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlignedPageComponent } from './aligned-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';

describe('AlignedPageComponent', () => {
  let component: AlignedPageComponent;
  let fixture: ComponentFixture<AlignedPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatProgressSpinnerModule
      ],
      declarations: [ AlignedPageComponent ],
      providers: [
        {provide: MatDialog, useValue: {}}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlignedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
