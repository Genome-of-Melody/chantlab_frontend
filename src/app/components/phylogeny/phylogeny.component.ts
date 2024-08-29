import {AfterViewInit, ChangeDetectionStrategy, Component, HostListener, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
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



  @Input() phylogeny: PhylogenyResponse;

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


  copyToClipboard() {
    const textarea = document.getElementById('phylogenetic-textarea') as HTMLTextAreaElement;
    if (textarea) {
      textarea.select();
      try {
        document.execCommand('copy');
        console.log('Text copied to clipboard');
      } catch (err) {
        console.error('Failed to copy text to clipboard', err);
      }
    }
  }

}
