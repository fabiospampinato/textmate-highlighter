
/* IMPORT */

import {loadOniguruma, OnigurumaScanner, OnigurumaString} from './vendor';
import {isShallowEqual, isString, once} from '../utils';
import type {OnigScanner, OnigString} from 'vscode-oniguruma';
import type {OptionsOniguruma, TextMateOniguruma} from '../types';

/* MAIN */

//TODO: Explore ditching Oniguruma entirely and instead converting its regexes to native JS regexes

class Oniguruma {

  /* VARIABLES */

  private options: OptionsOniguruma;

  /* CONSTRUCTOR */

  constructor ( options: OptionsOniguruma ) {

    this.options = options;

  }

  /* API */

  fetch = once (async (): Promise<ArrayBuffer> => {

    const source = await this.options.getOniguruma ();

    if ( isString ( source ) ) {

      return await ( await fetch ( source ) ).arrayBuffer ();

    } else {

      return source;

    }

  });

  load = once (async (): Promise<TextMateOniguruma> => {

    const buffer = await this.fetch ();

    await loadOniguruma ( buffer );

    const cache: Record<number, Record<string, [string[], OnigScanner][]>> = [];

    return {
      createOnigScanner: ( patterns: string[] ): OnigScanner => {
        const cacheLv1 = patterns.length;
        const cacheLv2 = patterns[0] || '';
        const scannersLv1 = ( cache[cacheLv1] ||= {} );
        const scannersLv2 = ( scannersLv1[cacheLv2] ||= [] );
        const cached = scannersLv2.find ( ([ cached ]) => isShallowEqual ( patterns, cached ) ); //TODO: Optimize this more maybe
        if ( cached ) return cached[1];
        const scanner = new OnigurumaScanner ( patterns );
        scannersLv2.push ([ patterns, scanner ]);
        return scanner;
      },
      createOnigString: ( content: string ): OnigString => {
        return new OnigurumaString ( content );
      }
    };

  });

}

/* EXPORT */

export default Oniguruma;
