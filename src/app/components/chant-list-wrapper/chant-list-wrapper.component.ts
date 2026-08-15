import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { IncipitService } from 'src/app/services/incipit.service';

@Component({
    selector: 'app-chant-list-wrapper',
    templateUrl: './chant-list-wrapper.component.html',
    styleUrls: ['./chant-list-wrapper.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ChantListWrapperComponent implements OnInit, OnDestroy {

  private readonly componentDestroyed$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private incipitService: IncipitService
  ) { }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.componentDestroyed$),
      tap(params => {
        let incipit = params['incipit'];
        this.incipitService.setIncipit(incipit);
      }))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next(undefined);
    this.componentDestroyed$.complete();
  }

}
