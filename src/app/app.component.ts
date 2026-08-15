import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';
import { ChantService } from './services/chant.service';
import { Title } from '@angular/platform-browser';

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
    private chantService: ChantService
  ) { }

  private readonly componentDestroyed$ = new Subject<void>();

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.chantService.loadData().subscribe();
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next(undefined);
    this.componentDestroyed$.complete();
  }

}
