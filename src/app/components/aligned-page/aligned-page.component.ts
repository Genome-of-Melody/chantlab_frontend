import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {ChantService} from '../../services/chant.service';
import {AlignmentService} from '../../services/alignment.service';
import {Alignment, AlignmentResponse} from '../../models/alignment';
import {AlignmentErrorDialogComponent} from '../dialogs/alignment-error-dialog/alignment-error-dialog.component';
import {IChant} from '../../interfaces/chant.interface';
import { MatDialog } from '@angular/material/dialog';
import {AlignmentManagementService} from '../../services/alignment-management.service';
import {ActivatedRoute} from '@angular/router';
import {GenerationErrorService} from '../../services/generation-error.service';

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
    styleUrls: ['./aligned-page.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
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
    private generationErrorService: GenerationErrorService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.requestedAlignmentName = this.route.snapshot.params.name;
    if (this.requestedAlignmentName === undefined) {
      this.initFromServer();
    } else {
      this.alignmentManagementService.retrieveAlignment(this.requestedAlignmentName).subscribe(
        alignment => {
          this.inputAlignment = alignment;
          this.initFromAlignment();
        },
        error => {
          console.error('Requested non-existent alignment: ' + this.requestedAlignmentName, error);
          this.generationErrorService.handleFailure('/chants');
        }
      );
    }
  }

  initFromAlignment(): void {
    this.idsToAlign = this.inputAlignment.ids;
    this.chantsToAlign = this.inputAlignment.iChants;
    this.alignedResponse = new AlignmentResponse(
      this.inputAlignment.parsedChants,
      [],
      [],
      this.inputAlignment
    );
  }

  initFromServer(): void {
    this.idsToAlign = this.alignmentService.idsToAlign;
    this.chantsToAlign = this.alignmentService.chantsToAlign;

    if (this.alignmentService.alignment === undefined) {

      const formData: FormData = new FormData();
      formData.append('idsToAlign', JSON.stringify(this.alignmentService.idsToAlign));
      formData.append('mode', this.alignmentService.getMode());
      formData.append('concatenated', JSON.stringify(this.alignmentService.concatenatedMode))
      formData.append('keepLiquescents', JSON.stringify(this.alignmentService.keepLiquescents))

      this.chantService.getAlignment(formData).subscribe({
        next: response => {
  
          console.log('AlignedPage: got response:');
          console.log(response);
  
          // Select the IChant data objects that contain incipits, cantus IDs, texts, etc.
          // The Alignment object should get the IChants, so it needs to be prepared
          // before the constructor is called.
          const alignedIChants = [];
          const successfull_ids = Array.isArray(response.success.ids) 
            ? response.success.ids.flat() 
            : response.success.ids;
          successfull_ids.forEach(alignedID => {
            const iChant = this.alignmentService.chantsToAlign.find(ch => ch.id === alignedID);
            alignedIChants.push(iChant);
          });
          // Because I think in the (near) future the IChants will ride with the request
          // and response, I think I can afford to do this. But of course it is
          // not good software design to modify your response objects!
          response.iChants = alignedIChants;
          try {
            this.alignmentService.alignment = Alignment.fromResponse(response);
          } catch (err) {
            console.error('AlignedPage: failed to store alignment', err);
            this.generationErrorService.handleFailure('/chants');
            return;
          }

          console.log(response);
          this.alignedResponse = new AlignmentResponse(
            response.chants,
            response.errors.sources,
            response.errors.ids,
            this.alignmentService.alignment
          );
          
          

          // The errors are also handled here -- the AlignedComponent is meant
          // to display the alignment, not to deal with what was *not* aligned.
          console.log(this.alignedResponse);
          const visualizedIds = new Set(this.flattenIds(this.alignmentService.alignment.ids));
          const selectedIds = this.flattenIds(this.idsToAlign);
          const issueById = new Map(
            this.alignedResponse.errorShortNames.map((_, i) => {
              const id = this.alignedResponse.errorIds[i];
              return [id, { id, label: this.chantIssueLabel(id) }] as const;
            })
          );
          const included = selectedIds
            .filter(id => visualizedIds.has(id) && issueById.has(id))
            .map(id => issueById.get(id));
          const omitted = selectedIds
            .filter(id => !visualizedIds.has(id))
            .map(id => issueById.get(id) ?? { id, label: this.chantIssueLabel(id) });

          if (included.length || omitted.length) {
            const dialogRef = this.dialog.open(AlignmentErrorDialogComponent);
            const instance = dialogRef.componentInstance;
            instance.included = included;
            instance.omitted = omitted;
          }
  
          console.log('AlignedPage: finished subscribe()');
        },
        error: err => {
          console.error('AlignedPage: alignment request failed', err);
          this.generationErrorService.handleFailure('/chants');
        }
      });
    } else {
      const alignment = this.alignmentService.alignment;
      this.idsToAlign = alignment.ids;
      this.chantsToAlign = alignment.iChants;
      this.alignedResponse = new AlignmentResponse(
        alignment.parsedChants,
        [],
        [],
        alignment
      );
    }


    console.log('AlignedPage: onInit() done.');
  }

  private flattenIds(ids: unknown): number[] {
    if (typeof ids === 'number') {
      return [ids];
    }
    if (!Array.isArray(ids)) {
      return [];
    }
    return ids.flat(Infinity).filter((id): id is number => typeof id === 'number');
  }

  private chantIssueLabel(id: number): string {
    const chant = this.chantsToAlign?.find(ch => ch.id === id);
    const incipit = chant?.incipit?.trim();
    if (incipit) {
      return this.shortIncipit(incipit);
    }
    return chant?.cantus_id || String(id);
  }

  private shortIncipit(incipit: string, maxLength = 42): string {
    if (incipit.length <= maxLength) {
      return incipit;
    }
    const slice = incipit.slice(0, maxLength - 1);
    const lastSpace = slice.lastIndexOf(' ');
    const shortened = lastSpace > 20 ? slice.slice(0, lastSpace) : slice;
    return shortened.trimEnd() + '…';
  }

}
