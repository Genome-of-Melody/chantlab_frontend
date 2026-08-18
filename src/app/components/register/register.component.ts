import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class RegisterComponent {
  username = '';
  password = '';
  passwordConfirm = '';
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
    if (this.password !== this.passwordConfirm) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }
    this.submitting = true;
    this.authService.register(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/chants']),
      error: err => {
        this.submitting = false;
        this.errorMessage = err?.error?.message || 'Could not create the account.';
      }
    });
  }
}
