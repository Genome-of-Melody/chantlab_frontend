import {Component, Input, OnInit} from '@angular/core';
import {ChantService} from '../../services/chant.service';
import {AlignmentService} from '../../services/alignment.service';
import {Alignment, AlignmentResponse} from '../../models/alignment';
import {AlignmentErrorDialogComponent} from '../dialogs/alignment-error-dialog/alignment-error-dialog.component';
import {IChant} from '../../interfaces/chant.interface';
import {MatDialog} from '@angular/material/dialog';
import {AlignmentManagementService} from '../../services/alignment-management.service';
import {ActivatedRoute} from '@angular/router';
import RuntimeError = WebAssembly.RuntimeError;

/**
 * The AlignedPageComponent is a level of indirection between the app's
 * routing to /aligned in order to request an alignment from the back-end,
 * and the display of an alignment object itself. This display part will
 * be handled by the AlignedComponent, where most of the functionality will
 * reside. Here we just refactor out the mechanism that requests the new
 * alignment based on the data present in the AlignmentService upon navigating
 * to the /aligned URL in the app. The aligned data then gets passed
 * into the AlignedComponent as an Input() variable.
 */
@Component({
  selector: 'app-aligned-page',
  templateUrl: './aligned-page.component.html',
  styleUrls: ['./aligned-page.component.css']
})
export class AlignedPageComponent implements OnInit {

  idsToAlign: number[];
  chantsToAlign: IChant[];
  alignmentMode: string;

  alignedResponse: AlignmentResponse;

  inputAlignment: Alignment = undefined;
  requestedAlignmentName: string = undefined;

  constructor(
    private chantService: ChantService,
    private alignmentService: AlignmentService,
    private alignmentManagementService: AlignmentManagementService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.requestedAlignmentName = this.route.snapshot.params.name;
    if (this.requestedAlignmentName === undefined) {
      this.initFromServer();
    } else {
      if (!this.alignmentManagementService.hasAlignment(this.requestedAlignmentName)) {
        console.log('Available alignments:');
        console.log(this.alignmentManagementService.availableAlignments);
        console.error('Requested non-existent alignment: ' + this.requestedAlignmentName);
        throw new RuntimeError();
      }
      this.inputAlignment = this.alignmentManagementService.retrieveAlignment(this.requestedAlignmentName)
      this.initFromAlignment();
    }
  }

  initFromAlignment(): void {
    this.idsToAlign = this.inputAlignment.ids;
    this.chantsToAlign = this.inputAlignment.iChants;
    this.alignedResponse = new AlignmentResponse(
      this.inputAlignment.parsedChants,
      [],
      this.inputAlignment
    );
  }

  initFromServer(): void {
    this.idsToAlign = this.alignmentService.idsToAlign;
    this.chantsToAlign = this.alignmentService.chantsToAlign;

    const formData: FormData = new FormData();
    formData.append('idsToAlign', JSON.stringify(this.alignmentService.idsToAlign));
    formData.append('mode', this.alignmentService.getMode());

    this.chantService.getAlignment(formData).subscribe(
      response => {

        console.log('AlignedPage: got response:');
        console.log(response);

        // Select the IChant data objects that contain incipits, cantus IDs, texts, etc.
        // The Alignment object should get the IChants, so it needs to be prepared
        // before the constructor is called.
        const alignedIChants = [];
        response.success.ids.forEach(alignedID => {
          const iChant = this.alignmentService.chantsToAlign.find(ch => ch.id === alignedID);
          alignedIChants.push(iChant);
        });
        // Because I think in the (near) future the IChants will ride with the request
        // and response, I think I can afford to do this. But of course it is
        // not good software design to modify your response objects!
        response.iChants = alignedIChants;

        this.alignedResponse = new AlignmentResponse(
          response.chants,
          response.errors,
          Alignment.fromResponse(response)
        );

        // The errors are also handled here -- the AlignedComponent is meant
        // to display the alignment, not to deal with what was *not* aligned.
        if (this.alignedResponse.errorShortNames.length > 0) {
          const dialogRef = this.dialog.open(AlignmentErrorDialogComponent);
          const instance = dialogRef.componentInstance;
          instance.sources = this.alignedResponse.errorShortNames;
        }

        console.log('AlignedPage: finished subscribe()');
      }
    );

    console.log('AlignedPage: onInit() done.');
  }

}
