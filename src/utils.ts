
/* IMPORT */

import isShallowEqual from 'are-shallow-equal';
import {toKebabCase} from 'kasi';

/* MAIN */

const escapeHTML = (() => {

  const replacementsRe = /[&<>"]/g;
  const replacements: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  const replaceChar = ( char: string ): string => {
    return replacements[char];
  };

  const replaceChars = ( str: string ): string => {
    return str.replace ( replacementsRe, replaceChar );
  };

  return replaceChars;

})();

const isString = ( value: unknown ): value is string => {

  return typeof value === 'string';

};

const isUndefined = ( value: unknown ): value is undefined => {

  return typeof value === 'undefined';

};

const memoize = <Args extends unknown[], Return> ( fn: ( ...args: Args ) => Return ): (( ...args: Args ) => Return) => {

  const cache = new Map ();

  return ( ...args: Args ): Return => {

    const id = args[0];
    const resultCached = cache.get ( id );

    if ( !isUndefined ( resultCached ) || cache.has ( id ) ) return resultCached;

    const result = fn.apply ( undefined, args );

    cache.set ( id, result );

    return result;

  };

};

const noop = (): void => {

  return;

};

const once = <T> ( fn: () => T ): (() => T) => {

  let called = false;
  let result: T;

  return (): T => {

    if ( !called ) {

      called = true;
      result = fn ();

    }

    return result;

  };

};

/* EXPORT */

export {escapeHTML, isShallowEqual, isString, isUndefined, memoize, noop, once, toKebabCase};
