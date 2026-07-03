
/* IMPORT */

import isShallowEqual from 'are-shallow-equal';
import memoize from 'lomemo';
import once from 'function-once';

/* MAIN */

const isString = ( value: unknown ): value is string => {

  return typeof value === 'string';

};

/* EXPORT */

export {isShallowEqual, isString, memoize, once};
