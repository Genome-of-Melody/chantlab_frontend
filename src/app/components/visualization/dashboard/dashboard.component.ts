import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IScatterData } from 'src/app/interfaces/scatter-data.interface';
import { IStackedHistogram } from 'src/app/interfaces/stacked-histogram.interface';
import { ChantService } from 'src/app/services/chant.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DashboardComponent implements OnInit, OnDestroy {

  melodyStackedHistData: IStackedHistogram[];
  melodyStackedHistTitle = 'Melody Length by Genre';
  melodyStackedHistGroupName = 'dataset';
  melodyStackedHistXName = 'Number of neumes';
  melodyStackedHistYName = 'Number of data';
  melodyStackedHistFigureID = 'melody-stacked-hist';

  textStackedHistData: IStackedHistogram[];
  textStackedHistTitle = 'Text Length by Genre';
  textStackedHistGroupName = 'dataset';
  textStackedHistXName = 'Number of words';
  textStackedHistYName = 'Number of data';
  textStackedHistFigureID = 'text-stacked-hist';

  multiScatterData: IScatterData[];
  multiScatterTitle = 'Comparison of melody length and text length';
  multiScatterXName = 'Melody length (number of neumes)';
  multiScatterYName = 'Text length (number of words)';
  isLoading = false;

  private readonly componentDestroyed$ = new Subject<void>();

  constructor(
    private chantService: ChantService
  ) { }

  ngOnInit(): void {
    this.chantService.isLoading()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(loading => this.isLoading = loading);
    this.chantService.getList()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
        (all_data: any) => {
          if (all_data === null || all_data.length === 0) {
            this.melodyStackedHistData = [];
            this.textStackedHistData = [];
            this.multiScatterData = [];
            return;
          }
          const data = all_data.slice(0, 10000);
          this.melodyStackedHistData = data
            .filter(chant => chant.volpiano)
            .map(chant => ({
              value: chant.volpiano.split('---').length,
              group: chant.dataset_name
            }));
          this.textStackedHistData = data
            .filter(chant => chant.full_text)
            .map(chant => ({
              value: chant.full_text.split(' ').length,
              group: chant.dataset_name
            }));
          this.multiScatterData = data
            .filter(chant => chant.volpiano && chant.full_text)
            .map(chant => ({
              x: chant.volpiano.split('-').join('').length,
              y: chant.full_text.split(' ').length,
              group: chant.dataset_name,
              id: chant.id
            }));
        }
      );
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next(undefined);
    this.componentDestroyed$.complete();
  }

}
