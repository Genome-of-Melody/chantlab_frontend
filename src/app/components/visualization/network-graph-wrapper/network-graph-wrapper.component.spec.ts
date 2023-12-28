import { ComponentFixture, TestBed } from '@angular/core/testing';
import {IChant} from '../../../interfaces/chant.interface';
import { NetworkGraphWrapperComponent } from './network-graph-wrapper.component';

describe('NetworkGraphWrapperComponent', () => {
  let component: NetworkGraphWrapperComponent;
  let fixture: ComponentFixture<NetworkGraphWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetworkGraphWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkGraphWrapperComponent);
    component = fixture.componentInstance;
    component.distanceMatrix = new Map([
      ["A Christo de caelo vocatus / F-Pn lat. 12044 / 0", new Map([
       ["A Christo de caelo vocatus / F-Pn lat. 12044 / 0", 0]
      ])]]);
      const sampleChant: IChant = {
      cantus_id: "001188",
      cao_concordances: null,
      century_code: "century_1100_1199",
      corpus_id: "chant_000622",
      differentia: "1",
      drupal_path: "http://cantus.uwaterloo.ca/chant/399542/",
      feast_id: "feast_0287",
      finalis: null,
      folio: "053v",
      full_text: "A Christo de caelo vocatus et in terram prostratus ex persecutore effectus est vas electionis",
      full_text_manuscript: "A xpisto de caelo vocatus et in terram prostratus ex persequutore effectus est vas electionis",
      genre_id: "genre_a",
      id: 0,
      incipit: "A Christo de caelo vocatus",
      marginalia: null,
      melody_id: null,
      mode: "8",
      notes: null,
      office_id: "office_m",
      position: "3.",
      sequence: 5,
      siglum: "F-Pn lat. 12044",
      source_id: "source_014",
      volpiano: "1---g---g-kk--h---g---h--g---f--gh--g---g---g---hgf--g---gh--f--f7---g---f--h--j--kl--kj-klk---h--kj--hg---g---h---gf--gh--h--g--g---4"
    };
    component.chants = new Map([
      ["A Christo de caelo vocatus / F-Pn lat. 12044 / 0", sampleChant]
    ]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
