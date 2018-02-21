import { Injectable } from '@angular/core';

@Injectable()
export class UrlPrepareService {
  replaceSpecialCharacter(inputString: string): string {
    if (!inputString) {
      return inputString;
    }

    inputString = inputString
      .toLowerCase()
      .split(' ')
      .join('-')
      .replace(/\\/g, '-');
    const reg = '[^a-zA-Z0-9-]';
    inputString = inputString.replace(new RegExp(reg, 'ig'), '-');
    inputString = encodeURIComponent(inputString);
    return inputString;
  }
}
