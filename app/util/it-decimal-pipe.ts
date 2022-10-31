import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberit'
})
export class ItDecimalPipe implements PipeTransform {

  transform(val: number): string {
    // Format the output to display any way you want here.
    // For instance:
    if (val !== undefined && val !== null) {
      return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else {
      return '';
    }
  }
}
