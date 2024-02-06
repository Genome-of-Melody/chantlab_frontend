import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ChantService } from './services/chant.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title: string = "chantlab";
  constructor(
    private titleService: Title,
    private chantService: ChantService
  ) { }

  private readonly componentDestroyed$ = new Subject();

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.chantService.loadData().subscribe();
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

}
