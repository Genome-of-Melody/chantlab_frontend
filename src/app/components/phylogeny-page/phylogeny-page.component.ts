import {Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {AlignmentManagementService} from '../../services/alignment-management.service';
import {ActivatedRoute} from '@angular/router';
import RuntimeError = WebAssembly.RuntimeError;
import { PhylogenyResponse } from 'src/app/models/phylogeny';
import { PhylogenyService } from 'src/app/services/phylogeny.service';
import { Alignment } from 'src/app/models/alignment';
import { ChantService } from 'src/app/services/chant.service';
import { SettingsService } from 'src/app/services/settings.service';
import { AlignmentErrorDialogComponent } from '../dialogs/alignment-error-dialog/alignment-error-dialog.component';
import { PhylogenyErrorDialogComponent } from '../dialogs/phylogeny-error-dialog/phylogeny-error-dialog.component';




@Component({
  selector: 'app-phylogeny-page',
  templateUrl: './phylogeny-page.component.html',
  styleUrls: ['./phylogeny-page.component.css']
})
export class PhylogenyPageComponent implements OnInit {

  phylogenyResponse: PhylogenyResponse;
  alignmentForPhylogeny: Alignment;
  newick: string;
  mb_script: string;
  nexus_alignment: string;
  nexus_con_tre: string;


  constructor(
    private phylogenyService: PhylogenyService,
    private chantService: ChantService,
    private settingsService: SettingsService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.alignmentForPhylogeny = this.phylogenyService.alignmentForPhylogeny;

    if (this.phylogenyService.newick === undefined || this.phylogenyService.newick === null) {

      const formData: FormData = new FormData();
      formData.append('alpianos', JSON.stringify(this.alignmentForPhylogeny.alpianos));
      formData.append('ids', JSON.stringify(this.alignmentForPhylogeny.ids));
      formData.append('alignment_names', JSON.stringify(this.phylogenyService.sequenceNames));
      formData.append('numberOfGenerations', JSON.stringify(this.settingsService.phylogenySettingsService.mrbayesGenerations));

      this.chantService.mrbayesVolpiano(formData).subscribe(
        response => {
  
          console.log('PhylogenyPage: got response:');
          console.log(response);

          this.phylogenyService.newick = response.newick
          this.phylogenyService.mrBayesScript = response.mbScript
          this.phylogenyService.nexusAlignment = response.nexusAlignment
          this.phylogenyService.nexusConTre = response.nexusConTre


          this.newick = this.phylogenyService.newick
          this.mb_script = this.phylogenyService.mrBayesScript
          this.nexus_alignment = this.phylogenyService.nexusAlignment
          this.nexus_con_tre = this.phylogenyService.nexusConTre
          this.phylogenyResponse = new PhylogenyResponse(
            this.newick,
            this.mb_script,
            this.nexus_alignment,
            this.nexus_con_tre
          )

          if (response.error.length > 0) {
            const dialogRef = this.dialog.open(PhylogenyErrorDialogComponent);
            const instance = dialogRef.componentInstance;
            instance.error_message = response.error
          }

          console.log('PhylogenyPage: finished subscribe()');
        }
      );
    } else {
      this.newick = this.phylogenyService.newick
      this.mb_script = this.phylogenyService.mrBayesScript
      this.nexus_alignment = this.phylogenyService.nexusAlignment
      this.nexus_con_tre = this.phylogenyService.nexusConTre
      this.phylogenyResponse = new PhylogenyResponse(
        this.newick,
        this.mb_script,
        this.nexus_alignment,
        this.nexus_con_tre
      )
    }
    console.log('PhylogenyPage: onInit() done.');
  }

}
