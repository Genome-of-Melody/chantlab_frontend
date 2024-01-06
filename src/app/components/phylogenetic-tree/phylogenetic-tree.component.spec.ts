import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhylogeneticTreeComponent } from './phylogenetic-tree.component';
import { MatCardModule } from '@angular/material/card'

describe('PhylogeneticTreeComponent', () => {
  let component: PhylogeneticTreeComponent;
  let fixture: ComponentFixture<PhylogeneticTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MatCardModule ],
      declarations: [ PhylogeneticTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhylogeneticTreeComponent);
    component = fixture.componentInstance;
    component.treeString = "(1__A_Christo_de_caelo_vocatus__F-Pn_lat._12044:0.66255,((2__A_Christo_de_caelo_vocatus__US-CHNbcbl_097:0.26667,4__A_Christo_de_caelo_vocatus__A-KN_1018:0.26667):0.10118,3__A_Christo_de_caelo_vocatus__D-KA_Aug._LX:0.36784):0.29471);";
    component.newickNamesDict = new Map([
      ["A_Christo_de_caelo_vocatus__A-KN_1018", 3],
      ["A_Christo_de_caelo_vocatus__D-KA_Aug._LX", 2],
      ["A_Christo_de_caelo_vocatus__F-Pn_lat._12044", 0],
      ["A_Christo_de_caelo_vocatus__US-CHNbcbl_097", 1]
    ]);
    component.chants = [
      {
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
      },
      {
        cantus_id: "007123a",
        cao_concordances: null,
        century_code: "century_1300_1399",
        corpus_id: "chant_000668",
        differentia: null,
        drupal_path: "http://cantus.uwaterloo.ca/chant/293103/",
        feast_id: "feast_1321",
        finalis: null,
        folio: "071v",
        full_text: "A Christo de caelo vocatus et in terram prostratus ex persecutore effectus est vas electionis",
        full_text_manuscript: "A christo de celo vocatus et in terram prostratus ex persecutore efectus est vas eleccionis",
        genre_id: "genre_v",
        id: 3,
        incipit: "A Christo de caelo vocatus",
        marginalia: null,
        melody_id: null,
        mode: "1",
        notes: null,
        office_id: "office_m",
        position: "01",
        sequence: 3,
        siglum: "A-KN 1018",
        source_id: "source_265",
        volpiano: "1---dh---h--hg-hgg---g---g--g---g--gh--g---g---g---hF--gh7---gh--hijh--h---h---gH--h--h--hk--h---h--hk--h---h---hghgfed-efg---gh--fe7--ef--fghgh--gf---3",
      },
      {
        cantus_id: "007123a",
        cao_concordances: null,
        century_code: "century_1100_1199",
        corpus_id: "chant_000646",
        differentia: null,
        drupal_path: "http://cantus.uwaterloo.ca/chant/617583/",
        feast_id: "feast_1321",
        finalis: null,
        folio: "125r",
        full_text: "A Christo de caelo vocatus et in terram prostratus ex persecutore effectus est vas electionis",
        full_text_manuscript: "A xpisto de celo vocatus et in terram prostratus ex persecutore effectus est vas electionis | ~Vere",
        genre_id: "genre_v",
        id: 2,
        incipit: "A Christo de caelo vocatus",
        marginalia: null,
        melody_id: null,
        mode: "1",
        notes: null,
        office_id: "office_m",
        position: "01",
        sequence: 2,
        siglum: "D-KA Aug. LX",
        source_id: "source_414",
        volpiano: "1---h-h---hg--hg-gf7---g---g--g---g--gh--g---g---g---hG--gh---gh--hjh--h---hf---gh--h--h--hk--h---h--hk--h---h---h---hg-hg--hf--fghg--hkh-hgfe--fgh-gf7---3",
      }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
