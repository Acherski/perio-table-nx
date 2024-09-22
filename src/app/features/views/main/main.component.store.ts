import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { createTableDataWithUuids } from './utils/create-data-with-uuid.util';
import { PeriodicElementWithUuid } from './models/periodic-element-with-uuid.interface';
import { filterTableUtil } from './utils/filter-table.util';
import {
  convertApiTextResponseToJson,
  TableApiService,
} from '@backend/table-api';
import { LoadingState, SnackBarService } from '@shared';
import { MainRxStoreInterface } from './models/main-component-store.interface';

@Injectable()
export class MainRxComponentStore extends RxState<MainRxStoreInterface> {
  constructor(
    private tableApiService: TableApiService,
    private snackBarService: SnackBarService
  ) {
    super();
    this.set({
      callState: LoadingState.INIT,
      tableData: [],
      filteredData: [],
    });
    this.fetchData();
  }

  fetchData() {
    this.set({ callState: LoadingState.INIT });
    this.tableApiService
      .loadList()
      .pipe(
        switchMap((data) => {
          const apiTextResponseAsJson = convertApiTextResponseToJson(data);
          const dataWithUuid = createTableDataWithUuids(apiTextResponseAsJson);
          this.set({
            tableData: dataWithUuid,
            filteredData: dataWithUuid,
            callState: LoadingState.LOADED,
          });
          return of(null);
        }),
        catchError((error) => {
          this.set('callState', error);
          if (error.message) {
            this.snackBarService.showErrorMessage(error.message);
          }
          return throwError(() => new Error(error));
        })
      )
      .subscribe();
  }

  filterData(searchValue: string) {
    if (searchValue) {
      const filteredData = filterTableUtil(this.get('tableData'), searchValue);
      this.set({ filteredData: filteredData });
    } else {
      this.set({ filteredData: this.get('tableData') });
    }
  }

  updateData(updatedElement: PeriodicElementWithUuid) {
    const updatedTableData: PeriodicElementWithUuid[] = [
      ...this.get('tableData'),
    ];
    const elementIndex = updatedTableData.findIndex(
      (element) => element.uuid === updatedElement.uuid
    );
    updatedTableData[elementIndex] = updatedElement;

    this.set({
      tableData: updatedTableData,
      filteredData: updatedTableData,
    });

    this.snackBarService.showSuccessMessage('Record updated successfully');
  }
}
