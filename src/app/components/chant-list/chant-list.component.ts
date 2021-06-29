import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { IChant } from 'src/app/interfaces/chant.interface';
import { AlignmentService } from 'src/app/services/alignment.service';
import { ChantFacadeService } from 'src/app/services/chant-facade.service';
import { CsvTranslateService } from 'src/app/services/csv-translate.service';
import { NotEnoughToAlingDialogComponent } from '../dialogs/not-enough-to-aling-dialog/not-enough-to-aling-dialog.component';

@Component({
  selector: 'app-chant-list',
  templateUrl: './chant-list.component.html',
  styleUrls: ['./chant-list.component.css']
})
export class ChantListComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  allChants: IChant[];
  chants: IChant[];
  currentChant?: IChant;
  currentIndex = -1;
  selected: boolean[];
  selectedAll: boolean;

  pageIndex: number;
  pageSize: number;
  dataLength: number;

  constructor(
    private router: Router,
    private chantFacadeService: ChantFacadeService,
    private alignmentService: AlignmentService,
    private csvTranslateService: CsvTranslateService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.retrieveChants();
    this.changePage(null);
  }

  retrieveChants(): void {
    this.chantFacadeService.getList().subscribe(
      (data: IChant[]) => {
        this.paginator.firstPage();
        this.allChants = data;
        this.selected = [];
        if (data) {
          this.dataLength = data.length;
          for (var i=0; i < data.length; i++) {
            this.selected.push(false);
          }
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  changePage(event: PageEvent): void {
    this.pageIndex = event ? event.pageIndex : 0;
    this.pageSize = event ? event.pageSize : 50;
    this.chantFacadeService.getList().subscribe(
      (data: IChant[]) => {
        var start = this.pageIndex * this.pageSize;
        var end = (this.pageIndex + 1) * this.pageSize;
        if (data) {
          this.chants = data.slice(start, end);
        }
      },
      error => {
        console.log(error);
      }
    );
    // var start = this.pageIndex * this.pageSize;
    // var end = (this.pageIndex + 1) * this.pageSize;
    // this.pageChants = this.allChants.slice(start, end);
    // console.log(this.pageChants);
  }

  // refreshList(): void {
  //   this.retrieveChants();
  //   this.currentChant = undefined;
  //   this.currentIndex = -1;
  // }

  // setActiveChant(chant: Chant, index: number): void {
  //   this.currentChant = chant;
  //   this.currentIndex = index;
  // }

  // removeAllChants(): void {
  //   this.chantService.deleteAll()
  //     .subscribe(
  //       response => {
  //         console.log(response);
  //         this.refreshList();
  //       },
  //       error => {
  //         console.log(error);
  //       });
  // }

  // searchIncipit(): void {
  //   this.chantService.findByIncipit(this.incipit)
  //     .subscribe(
  //       data => {
  //         this.chants = data;
  //         console.log(data);
  //       },
  //       error => {
  //         console.log(error);
  //       });
  // }

  // checkboxChanged(idx: number): void {
  //   // console.log(this.chants[idx].id);
  //   // console.log(checked);
  //   // this.selected[idx] = checked;
  // }

  selectAll(): void {
    for (var i=0; i<this.selected.length; i++) {
      this.selected[i] = this.selectedAll;
    }
  }

  getSelected(): number[] {
    var checkboxChecked: number[] = [];
    for (var i = 0; i < this.selected.length; i++) {
      if (this.selected[i]) {
        checkboxChecked.push(this.allChants[i].id);
      }
    }

    return checkboxChecked;
  }

  align(mode: string): void {
    // get list of selected chants
    let selected = this.getSelected();
    if (selected.length < 2) {
      const dialogRef = this.dialog.open(NotEnoughToAlingDialogComponent);
      return;
    }

    let result = this.alignmentService.setMode(mode);
    if (result === 1) {
      // show error
      return;
    }

    this.alignmentService.idsToAlign = selected;
    this.router.navigate(['/align']);
  }

  alignMelody(): void {
    if (this.getSelected()) {
      this.router.navigate(['/align']);
    }
  }

  alignText(): void {
    if (this.getSelected()) {
      this.router.navigate(['/align-text']);
    }
  }

  getGenreName(genreId: string): string {
    let genreName;
    this.csvTranslateService.getGenre(genreId).subscribe(
      data => genreName = data
    );
    return genreName;
  }
}
