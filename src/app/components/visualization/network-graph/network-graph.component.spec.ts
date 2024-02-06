import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkGraphComponent } from './network-graph.component';

describe('NetworkGraphComponent', () => {
  let component: NetworkGraphComponent;
  let fixture: ComponentFixture<NetworkGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetworkGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkGraphComponent);
    component = fixture.componentInstance;
    component.distanceMatrix = new Map([
      ["A Christo de caelo vocatus / F-Pn lat. 12044 / 0",
        new Map([
          ["A Christo de caelo vocatus / F-Pn lat. 12044 / 0", 0],
          ["A Christo de caelo vocatus / D-KA Aug. LX / 2", 0.5631067961165048],
          ["A Christo de caelo vocatus / A-KN 1018 / 3", 0.5480769230769231]
        ])],
      ["A Christo de caelo vocatus / D-KA Aug. LX / 2",
        new Map([
          ["A Christo de caelo vocatus / F-Pn lat. 12044 / 0", 0.5631067961165048],
          ["A Christo de caelo vocatus / D-KA Aug. LX / 2", 0],
          ["A Christo de caelo vocatus / A-KN 1018 / 3", 0.411214953271028]
        ])],
      ["A Christo de caelo vocatus / A-KN 1018 / 3",
        new Map([
          ["A Christo de caelo vocatus / F-Pn lat. 12044 / 0", 0.5480769230769231],
          ["A Christo de caelo vocatus / D-KA Aug. LX / 2", 0.411214953271028],
          ["A Christo de caelo vocatus / A-KN 1018 / 3", 0]
        ])]
    ]);
    component.chants = new Map([
      ["A Christo de caelo vocatus / F-Pn lat. 12044 / 0", {
        cantus_id: "001188",
        cao_concordances: null,
        century_code: "century_1100_1199",
        corpus_id: "chant_000622",
        dataset_idx: 0,
        dataset_name: "CantusCorpus v0.2",
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
        volpiano: "1---g---g-kk--h---g---h--g---f--gh--g---g---g---hgf--g---gh--f--f7---g---f--h--j--kl--kj-klk---h--kj--hg---g---h---gf--gh--h--g--g---4",
      }],
      ["A Christo de caelo vocatus / D-KA Aug. LX / 2", {
        cantus_id: "007123a",
        cao_concordances: null,
        century_code: "century_1100_1199",
        corpus_id: "chant_000646",
        dataset_idx: 0,
        dataset_name: "CantusCorpus v0.2",
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
      }],
      ["A Christo de caelo vocatus / A-KN 1018 / 3", {
        cantus_id: "007123a",
        cao_concordances: null,
        century_code: "century_1300_1399",
        corpus_id: "chant_000668",
        dataset_idx: 0,
        dataset_name: "CantusCorpus v0.2",
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
      }]
    ]);
    component.linkMaximumDistanceThreshold = 0.5;
    component.networkType = "manuscripts";
    component.colorScheme = new Map([
      ["F-Pn lat. 12044", "rgb(240, 112, 74)"],
      ["D-KA Aug. LX", "rgb(105, 189, 169)"],
      ["A-KN 1018", "rgb(254, 221, 141)"]
    ]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
