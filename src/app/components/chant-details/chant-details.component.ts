import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IChantPrecomputed } from 'src/app/interfaces/chant-precomputed.interface';
import { ChantService } from 'src/app/services/chant.service';
import { CsvTranslateService } from 'src/app/services/csv-translate.service';
import { ChantNotFoundDialogComponent } from '../dialogs/chant-not-found-dialog/chant-not-found-dialog.component';
import { NoChantTextDialogComponent } from '../dialogs/no-chant-text-dialog/no-chant-text-dialog.component';
import { VolpianoUpdatedDialogComponent } from '../dialogs/volpiano-updated-dialog/volpiano-updated-dialog.component';

@Component({
  selector: 'app-chant-details',
  templateUrl: './chant-details.component.html',
  styleUrls: ['./chant-details.component.css']
})
export class ChantDetailsComponent implements OnInit, OnDestroy {

  @Input() id: number;

  chant: IChantPrecomputed;
  genre: string;
  office: string;

  volpiano: string;
  humanReadableCentury: string;

  private readonly componentDestroyed$ = new Subject();

  constructor(
    private chantService: ChantService,
    private csvTranslateService: CsvTranslateService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.chantService.getChant(this.id)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
        (data: IChantPrecomputed) => {
          this.chant = data;
          if (this.chant && !this.chant.json_volpiano) {
            const dialogRef = this.dialog.open(NoChantTextDialogComponent);
          }

          this.genre = this.csvTranslateService.getGenre(this.chant.db_source.genre_id);

          this.office = this.csvTranslateService.getOffice(this.chant.db_source.office_id);

          this.volpiano = this.chant.db_source.volpiano;

          this.humanReadableCentury = this.buildHumanReadableCentury(this.chant);
        },
        error => {
          console.log(error);
          this.router.navigateByUrl('/');
          this.dialog.open(ChantNotFoundDialogComponent);
        }
      );
  }

  updateVolpiano(): void {
    const formData = new FormData();
    formData.append('id', this.id.toString());
    formData.append('volpiano', this.volpiano);
    this.chantService.updateVolpiano(formData)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
        _ => { this.dialog.open(VolpianoUpdatedDialogComponent); }
      );
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  buildHumanReadableCentury(chant: IChantPrecomputed): string {
    const century = chant.db_source.century_code;
    if (!century) {
      return '(century unknown)';
    }
    const centuryComponents = century.split('_').slice(1);
    if (centuryComponents.length != 2) {
      return '(century malformed)';
    }
    return centuryComponents[0] + ' - ' + centuryComponents[1];
  }
}
