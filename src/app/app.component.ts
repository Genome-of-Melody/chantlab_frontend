import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { ChantService } from './services/chant.service';
import { Title } from '@angular/platform-browser';
import { AuthService } from './services/auth.service';
import { DataSourceListService } from './services/data-source-list.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  title: string = "chantlab";
  constructor(
    private titleService: Title,
    private chantService: ChantService,
    private authService: AuthService,
    private dataSourceListService: DataSourceListService
  ) { }

  private readonly componentDestroyed$ = new Subject<void>();

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.authService.restoreSession().subscribe();
    this.authService.currentUser$
      .pipe(
        map(user => user?.id ?? null),
        distinctUntilChanged(),
        takeUntil(this.componentDestroyed$)
      )
      .subscribe(() => this.dataSourceListService.refreshSources());
    this.chantService.loadData().subscribe();
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next(undefined);
    this.componentDestroyed$.complete();
  }

}
