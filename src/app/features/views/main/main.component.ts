import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { TitleCasePipe } from '@angular/common';
import { LetDirective } from '@ngrx/component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TableApiService } from '@backend/table-api';
import { EditRecordDialogComponent } from './components/edit-record-dialog/edit-record-dialog.component';
import { SearchBoxComponent } from './components/searchbar/searchbox.component';
import { MainRxComponentStore } from './main.component.store';
import { PeriodicElementWithUuid } from './models/periodic-element-with-uuid.interface';
import { DisplayedColumns } from './constants/displayed-columns.constant';
import { ButtonIconComponent, LoadingState } from '@shared';

@Component({
  selector: 'main-view',
  standalone: true,
  imports: [
    MatTableModule,
    TitleCasePipe,
    LetDirective,
    ButtonIconComponent,
    MatDialogModule,
    SearchBoxComponent,
    MatProgressSpinnerModule,
  ],
  providers: [MainRxComponentStore, TableApiService],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {
  readonly LoadingState = LoadingState;
  readonly displayedColumns = DisplayedColumns;

  rxStore = inject(MainRxComponentStore);
  dialog = inject(MatDialog);

  // Opens dialog, transmits data between dialog and MainComponent,
  // calls component store's update data function
  editRecord(element: PeriodicElementWithUuid) {
    this.dialog
      .open(EditRecordDialogComponent, {
        data: { element },
      })
      .afterClosed()
      .subscribe((updatedElement: PeriodicElementWithUuid | undefined) => {
        if (!updatedElement) return;

        this.rxStore.updateData(updatedElement);
      });
  }

  // Calls component store's filter data function
  onSearchValueChange(searchValue: string) {
    this.rxStore.filterData(searchValue);
  }
}
