import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Alignment } from '../models/alignment';
import CONFIG from '../config.json';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AlignmentManagementService {
  private readonly alignmentsUrl = `${CONFIG['BACKEND_URL']}/alignments/`;
  private readonly namesSubject = new BehaviorSubject<string[]>([]);
  private readonly cache = new Map<string, Alignment>();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.refresh().subscribe();
      } else {
        this.cache.clear();
        this.namesSubject.next([]);
      }
    });
  }

  get availableAlignments(): Set<string> {
    return new Set<string>(this.namesSubject.value);
  }

  get alignmentsChanged$(): Observable<string[]> {
    return this.namesSubject.asObservable();
  }

  hasAlignment(name: string): boolean {
    return this.namesSubject.value.includes(name);
  }

  refresh(): Observable<string[]> {
    if (!this.authService.isLoggedIn()) {
      this.cache.clear();
      this.namesSubject.next([]);
      return of([]);
    }
    return this.http.get<{ alignments: { name: string }[] }>(this.alignmentsUrl).pipe(
      map(response => (response.alignments || []).map(item => item.name)),
      tap(names => this.namesSubject.next(names))
    );
  }

  storeAlignment(name: string, alignment: Alignment): void {
    if (!this.authService.isLoggedIn() || !name) {
      return;
    }
    const payload = JSON.parse(alignment.toJson());
    this.http.post(this.alignmentsUrl, { name, data: payload }).subscribe(() => {
      this.cache.set(name, alignment);
      if (!this.namesSubject.value.includes(name)) {
        this.namesSubject.next([...this.namesSubject.value, name].sort());
      }
    });
  }

  retrieveAlignment(name: string): Observable<Alignment> {
    if (this.cache.has(name)) {
      return of(this.cache.get(name));
    }
    return this.http.get<{ name: string, data: any }>(
      `${this.alignmentsUrl}${encodeURIComponent(name)}/`
    ).pipe(
      map(response => Alignment.fromJson(response.data)),
      tap(alignment => this.cache.set(name, alignment))
    );
  }

  deleteAlignment(name: string): void {
    if (!this.authService.isLoggedIn()) {
      return;
    }
    this.http.delete(`${this.alignmentsUrl}${encodeURIComponent(name)}/`).subscribe(() => {
      this.cache.delete(name);
      this.namesSubject.next(this.namesSubject.value.filter(item => item !== name));
    });
  }

  get nAlignmentsAvailable(): number {
    return this.namesSubject.value.length;
  }
}
