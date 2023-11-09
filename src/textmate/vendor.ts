
/* IMPORT */

import * as oniguruma from 'vscode-oniguruma';
import * as textmate from 'vscode-textmate';

/* MAIN */

//FIXME: This stuff is CJS and is interpreted differently between Vite and Node for some reason...

const INITIAL = textmate.INITIAL || textmate['default'].INITIAL;
const TMRegistry = textmate.Registry || textmate['default'].Registry;

const loadOniguruma = oniguruma.loadWASM || oniguruma['default'].loadWASM;
const OnigurumaScanner = oniguruma.OnigScanner || oniguruma['default'].OnigScanner;
const OnigurumaString = oniguruma.OnigString || oniguruma['default'].OnigString;

/* EXPORT */

export {TMRegistry, INITIAL};
export {loadOniguruma, OnigurumaScanner, OnigurumaString};
