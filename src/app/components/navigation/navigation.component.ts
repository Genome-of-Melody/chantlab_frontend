import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { IsActiveMatchOptions, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class NavigationComponent implements OnInit {

  searchValue = '';

  private readonly activeLinkMatch: IsActiveMatchOptions = {
    paths: 'subset',
    queryParams: 'ignored',
    fragment: 'ignored',
    matrixParams: 'ignored'
  };

  constructor(
    private router: Router,
    public authService: AuthService
  ) { }

  get isChantListActive(): boolean {
    return this.router.isActive('/chants', this.activeLinkMatch)
      || this.router.isActive('/align', this.activeLinkMatch);
  }

  ngOnInit(): void {
  }

  search(event): void {
    const incipit: string = event.target.value;
    this.searchValue = null;
    this.router.navigate(['/chants', {incipit}]);
  }

  logout(): void {
    this.authService.logout().subscribe(() => this.router.navigate(['/chants']));
  }

}
