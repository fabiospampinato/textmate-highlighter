
/* IMPORT */

import isShallowEqual from 'are-shallow-equal';

/* MAIN */

const isString = ( value: unknown ): value is string => {

  return typeof value === 'string';

};

const memoize = <Args extends unknown[], Return> ( fn: ( ...args: Args ) => Return ): (( ...args: Args ) => Return) => {

  const cache = new Map ();

  return ( ...args: Args ): Return => {

    const id = args[0];
    const resultCached = cache.get ( id );

    if ( resultCached !== undefined || cache.has ( id ) ) return resultCached;

    const result = fn.apply ( undefined, args );

    cache.set ( id, result );

    return result;

  };

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

export {isShallowEqual, isString, memoize, once};
