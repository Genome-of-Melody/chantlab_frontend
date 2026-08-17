import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  submitting = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  submit(): void {
    this.errorMessage = '';
    if (!this.username || !this.password) {
      this.errorMessage = 'Enter a username and password.';
      return;
    }
    this.submitting = true;
    this.authService.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/chants']),
      error: err => {
        this.submitting = false;
        this.errorMessage = err?.error?.message || 'Could not log in.';
      }
    });
  }
}
