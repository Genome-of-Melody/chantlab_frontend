import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlignedComponent } from './aligned.component';
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

describe('AlignedComponent', () => {
  let component: AlignedComponent;
  let fixture: ComponentFixture<AlignedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AlignedComponent,
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
    fixture = TestBed.createComponent(AlignedComponent);
    component = fixture.componentInstance;
    const alignment: Alignment = new Alignment(
      [
        [{type: 'clef', volpiano: Array(1), text: ''}, {type: 'word-space', volpiano: Array(1), text: ''}],
        [{type: 'syllable', volpiano: Array(1), text: 'A'}, {type: 'word-space', volpiano: Array(1), text: ''}],
        [{type: 'syllable', volpiano: Array(3), text: 'Ch'}, {type: 'syllable-space', volpiano: Array(1), text: '-'},
          {type: 'syllable', volpiano: Array(1), text: 'risto'}, {type: 'word-space', volpiano: Array(1), text: ''}],
        [{type: 'syllable', volpiano: Array(1), text: 'de'}, {type: 'word-space', volpiano: Array(1), text: ''}],
        [{type: 'syllable', volpiano: Array(1), text: 'cae'}, {type: 'syllable-space', volpiano: Array(1), text: '-'},
          {type: 'syllable', volpiano: Array(1), text: 'lo'}, {type: 'word-space', volpiano: Array(1), text: ''}],
        [{type: 'syllable', volpiano: Array(1), text: 'vo'}, {type: 'syllable-space', volpiano: Array(1), text: '-'},
          {type: 'syllable', volpiano: Array(2), text: 'ca'}, {type: 'syllable-space', volpiano: Array(1), text: '-'},
          {type: 'syllable', volpiano: Array(1), text: 'tus'}, {type: 'word-space', volpiano: Array(1), text: ''}],
        [{type: 'syllable', volpiano: Array(1), text: 'et'}, {type: 'word-space', volpiano: Array(1), text: ''}],
        [{type: 'syllable', volpiano: Array(1), text: 'in'}, {type: 'word-space', volpiano: Array(1), text: ''}],
        [{type: 'syllable', volpiano: Array(3), text: 'ter'}, {type: 'syllable-space', volpiano: Array(1), text: '-'},
          {type: 'syllable', volpiano: Array(1), text: 'ram'}, {type: 'word-space', volpiano: Array(1), text: ''}],
        [{type: 'syllable', volpiano: Array(2), text: 'pros'}, {type: 'syllable-space', volpiano: Array(1), text: '-'},
          {type: 'syllable', volpiano: Array(1), text: 'tra'}, {type: 'syllable-space', volpiano: Array(1), text: '-'},
          {type: 'syllable', volpiano: Array(2), text: 'tus'}, {type: 'word-space', volpiano: Array(1), text: ''}],
        [{type: 'syllable', volpiano: Array(1), text: 'ex'}, {type: 'word-space', volpiano: Array(1), text: ''}],
        [{type: 'syllable', volpiano: Array(1), text: 'per'}, {type: 'syllable-space', volpiano: Array(1), text: '-'},
          {type: 'syllable', volpiano: Array(1), text: 'se'}, {type: 'syllable-space', volpiano: Array(1), text: '-'},
          {type: 'syllable', volpiano: Array(1), text: 'cu'}, {type: 'syllable-space', volpiano: Array(1), text: '-'},
          {type: 'syllable', volpiano: Array(2), text: 'to'}, {type: 'syllable-space', volpiano: Array(1), text: '-'},
          {type: 'syllable', volpiano: Array(5), text: 're'}, {type: 'word-space', volpiano: Array(1), text: ''}],
        [{type: 'syllable', volpiano: Array(1), text: 'ef'}, {type: 'syllable-space', volpiano: Array(1), text: '-'},
          {type: 'syllable', volpiano: Array(2), text: 'fec'}, {type: 'syllable-space', volpiano: Array(1), text: '-'},
          {type: 'syllable', volpiano: Array(2), text: 'tus'}, {type: 'word-space', volpiano: Array(1), text: ''}],
        [{type: 'syllable', volpiano: Array(1), text: 'est'}, {type: 'word-space', volpiano: Array(1), text: ''}],
        [{type: 'syllable', volpiano: Array(1), text: 'vas'}, {type: 'word-space', volpiano: Array(1), text: ''}],
        [{type: 'syllable', volpiano: Array(2), text: 'e'}, {type: 'syllable-space', volpiano: Array(1), text: '-'},
          {type: 'syllable', volpiano: Array(2), text: 'lec'}, {type: 'syllable-space', volpiano: Array(1), text: '-'},
          {type: 'syllable', volpiano: Array(1), text: 'ti'}, {type: 'syllable-space', volpiano: Array(1), text: '-'},
          {type: 'syllable', volpiano: Array(1), text: 'o'}, {type: 'syllable-space', volpiano: Array(1), text: '-'},
          {type: 'syllable', volpiano: Array(1), text: 'nis'}],
        [{type: 'end-sequence', volpiano: Array(1), text: ''}]],
      [{
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
      }],
      ["1~g~gkk|h~g~h|g~f|gh|g~g~g~hgf|g~gh|f|f7~g~f|h|j|kl|kjklk~h|kj|hg~g~h~gf|gh|h|g|g"],
      [0],
      ['http://cantus.uwaterloo.ca/chant/399542/'],
      ['F-Pn lat. 12044, 053v, 3.'],
      null,
      null,
      "full"
      );
    component.alignment = alignment;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
