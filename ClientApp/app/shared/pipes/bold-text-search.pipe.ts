import { Pipe, PipeTransform } from '@angular/core';

// tslint:disable-next-line:use-pipe-transform-interface
@Pipe({
    name: 'boldtextsearch'
})
export class BoldTextSearchPipe  implements PipeTransform {
    transform(value: string, query: string) {
        if (query == null || query.trim() === '') {
            return value;
        }

        query.trim().split(' ').forEach((word, index) => {
            if (index > 0 && word.toLowerCase() == 'b')
                return;
            value = value.replace(new RegExp(word, 'i'), `<b>${word}</b>`);
        });

        return value;
    }
}