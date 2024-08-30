import {AfterViewInit, ChangeDetectionStrategy, Component, HostListener, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Subject} from 'rxjs';
import { PhylogenyResponse } from 'src/app/models/phylogeny';
import { DownloadService } from 'src/app/services/download.service';
import { PhylogenyService } from 'src/app/services/phylogeny.service';

@Component({
  selector: 'app-phylogeny',
  templateUrl: './phylogeny.component.html',
  styleUrls: ['./phylogeny.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhylogenyComponent implements OnInit, OnDestroy {



  uploadInstructions: boolean;

  @Input() phylogeny: PhylogenyResponse;

  private readonly componentDestroyed$ = new Subject();

  constructor(
    private phylogenyService: PhylogenyService,
    private downloadService: DownloadService,
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

  downloadNewick() {
    const blob = new Blob([this.phylogeny.newick], {type: 'text'});
    this.downloadService.download(blob, 'phylogenetic_tree.txt');
  }

  downloadNexusConTre() {
    const blob = new Blob([this.phylogeny.nexusConTre], {type: 'text'});
    this.downloadService.download(blob, 'chantlab.nexus.con.tre');
  }
  
  downloadMBScript() {
    const blob = new Blob([this.phylogeny.mbScript], {type: 'text'});
    this.downloadService.download(blob, 'chantlab.mb');
  }

  downloadNexusAlignment() {
    const blob = new Blob([this.phylogeny.nexusAlignment], {type: 'text'});
    this.downloadService.download(blob, 'chantlab.nexus');
  }

  displayHelp(){
    this.uploadInstructions = !this.uploadInstructions;
  }

  get showNewickHelpColor(): string {
    if (this.uploadInstructions) { return 'accent'; }
    return 'primary';
  }

}
