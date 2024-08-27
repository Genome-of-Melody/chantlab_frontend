import {ChangeDetectionStrategy, Component, HostListener, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Subject} from 'rxjs';
import { PhylogenyResponse } from 'src/app/models/phylogeny';
import { PhylogenyService } from 'src/app/services/phylogeny.service';

@Component({
  selector: 'app-phylogeny',
  templateUrl: './phylogeny.component.html',
  styleUrls: ['./phylogeny.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhylogenyComponent implements OnInit, OnDestroy {


  phylogenyResponse: PhylogenyResponse;

  @Input() phylogeneticTree: string;

  private readonly componentDestroyed$ = new Subject();

  constructor(
    private phylogenyService: PhylogenyService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

}
