import { CallState } from '@shared';
import { PeriodicElementWithUuid } from './periodic-element-with-uuid.interface';

export interface MainRxStoreInterface {
  callState: CallState;
  tableData: PeriodicElementWithUuid[];
  filteredData: PeriodicElementWithUuid[];
}
