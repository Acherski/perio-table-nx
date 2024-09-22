import { map, Observable, take } from 'rxjs';
import { PeriodicElementWithUuid } from '../models/periodic-element-with-uuid.interface';

// Checking if any of the fields include searching criteria
const checkIfElementMeetsRequirements = (
  element: PeriodicElementWithUuid,
  req: string
): boolean => {
  if (
    element.position.toString().includes(req) ||
    element.name.toLowerCase().includes(req.toLowerCase()) ||
    element.weight.toString().includes(req) ||
    element.symbol.toLowerCase().includes(req.toLowerCase())
  ) {
    return true;
  }
  return false;
};

// Utility function, returns filtered table
export const filterTableUtil = (
  elementArray: PeriodicElementWithUuid[],
  searchValue: string
): PeriodicElementWithUuid[] => {
  const resultArray: PeriodicElementWithUuid[] = [];

  elementArray.map((element) => {
    if (checkIfElementMeetsRequirements(element, searchValue)) {
      resultArray.push(element);
    }
  });

  return resultArray;
};
