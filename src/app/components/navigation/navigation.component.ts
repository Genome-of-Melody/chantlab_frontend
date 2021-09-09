import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  searchValue = '';

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  search(event): void {
    const incipit: string = event.target.value;
    this.searchValue = null;
    this.router.navigate(['/chants', {incipit}]);
  }

}
