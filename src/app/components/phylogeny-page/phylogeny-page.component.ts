import {Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {AlignmentManagementService} from '../../services/alignment-management.service';
import {ActivatedRoute} from '@angular/router';
import RuntimeError = WebAssembly.RuntimeError;
import { PhylogenyResponse } from 'src/app/models/phylogeny';
import { PhylogenyService } from 'src/app/services/phylogeny.service';
import { Alignment } from 'src/app/models/alignment';
import { ChantService } from 'src/app/services/chant.service';




@Component({
  selector: 'app-phylogeny-page',
  templateUrl: './phylogeny-page.component.html',
  styleUrls: ['./phylogeny-page.component.css']
})
export class PhylogenyPageComponent implements OnInit {

  phylogenyResponse: PhylogenyResponse;
  phylogeneticTree: string;
  alignmentForPhylogeny: Alignment;


  constructor(
    private phylogenyService: PhylogenyService,
    private chantService: ChantService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.alignmentForPhylogeny = this.phylogenyService.alignmentForPhylogeny;

    if (this.phylogenyService.phylogeneticTree === undefined || this.phylogenyService.phylogeneticTree === null) {

      const formData: FormData = new FormData();
      formData.append('parsedChants', JSON.stringify(this.alignmentForPhylogeny.parsedChants))
      formData.append('ids', JSON.stringify(this.alignmentForPhylogeny.ids));

      this.chantService.mrbayesVolpiano(formData).subscribe(
        response => {
  
          console.log('PhylogenyPage: got response:');
          console.log(response);

          this.phylogenyService.phylogeneticTree = response.phylogeneticTree
          this.phylogeneticTree = this.phylogenyService.phylogeneticTree
          this.phylogenyResponse = new PhylogenyResponse(
            this.phylogeneticTree
          )

          console.log('PhylogenyPage: finished subscribe()');
        }
      );
    } else {
      this.phylogeneticTree = this.phylogenyService.phylogeneticTree
      this.phylogenyResponse = new PhylogenyResponse(
        this.phylogeneticTree
      )
    }
    console.log('PhylogenyPage: onInit() done.');
  }

}
