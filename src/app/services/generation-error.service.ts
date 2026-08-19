import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GenerationFailedDialogComponent } from '../components/dialogs/generation-failed-dialog/generation-failed-dialog.component';

/**
 * Stops stuck "Generation in progress..." UI by navigating away from the
 * failed view and showing a shared error dialog (dialog lives on the overlay,
 * so it remains visible after navigation — including phylogeny → alignment).
 */
@Injectable({
  providedIn: 'root'
})
export class GenerationErrorService {

  constructor(
    private dialog: MatDialog,
    private router: Router
  ) { }

  showFailure(): void {
    this.dialog.open(GenerationFailedDialogComponent);
  }

  handleFailure(navigateTo: string | any[]): void {
    const commands = Array.isArray(navigateTo) ? navigateTo : [navigateTo];
    this.router.navigate(commands).then(() => {
      this.showFailure();
    });
  }
}
