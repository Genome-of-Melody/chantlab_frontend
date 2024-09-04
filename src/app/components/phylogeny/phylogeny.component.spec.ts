import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { Alignment } from '../../models/alignment';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NetworkGraphWrapperComponent } from '../visualization/network-graph-wrapper/network-graph-wrapper.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PhylogenyComponent } from './phylogeny.component';

describe('PhylogenyComponent', () => {
  let component: PhylogenyComponent;
  let fixture: ComponentFixture<PhylogenyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PhylogenyComponent,
        NetworkGraphWrapperComponent
      ],
      imports: [
        HttpClientTestingModule,
        MatCheckboxModule,
        MatButtonToggleModule,
        FormsModule,
        BrowserModule,
        MatButtonModule,
        ScrollingModule
      ],
      providers: [
        {provide: MatDialog, useValue: {}}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhylogenyComponent);
    component = fixture.componentInstance;
    const phylogeneticTree: string = "(1__A_Christo_de_caelo_vocatus__F-Pn_lat._12044:0.66255,((2__A_Christo_de_caelo_vocatus__US-CHNbcbl_097:0.26667,4__A_Christo_de_caelo_vocatus__A-KN_1018:0.26667):0.10118,3__A_Christo_de_caelo_vocatus__D-KA_Aug._LX:0.36784):0.29471)"

    component.phylogeneticTree = phylogeneticTree;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
