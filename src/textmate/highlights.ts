
/* IMPORT */

import {memoize, once, toKebabCase} from '../utils';

/* POLYFILL-ISH */

declare module globalThis {
  var Highlight: typeof Set<Range> | undefined;
  var CSS: { highlights?: Map<string, Set<Range>> } | undefined;
}

const Highlight = globalThis.Highlight || Set<Range>;
const HighlightsRegistry = globalThis.CSS?.highlights || new Map ();
const HighlightsSupported = !!globalThis.CSS?.highlights;

/* MAIN */

const Highlights = {

  /* API */

  getStyle: once ((): HTMLStyleElement => {

    const style = document.createElement ( 'style' );

    style.setAttribute ( 'type', 'text/css' );
    style.setAttribute ( 'data-highmate', '' );

    document.head.append ( style );

    return style;

  }),

  getHighlights: (() => {

    let highlightsCounter = 0;

    return memoize (( identifier: string, styles: Record<string, string> ): Set<Range> => {

      const highlight = new Highlight ();
      const highlightName = `highmate-${highlightsCounter++}`;

      HighlightsRegistry.set ( highlightName, highlight );

      const highlightsStyle = Highlights.getStyle ();
      const highlightRule = `::highlight(${highlightName}) { ${Object.entries ( styles ).map ( ([ key, value ]) => `${toKebabCase ( key )}: ${value};` )}} \n`;

      highlightsStyle.innerText += highlightRule;

      return highlight;

    });

  })(),

  isSupported: (): boolean => {

    return HighlightsSupported;

  }

};

/* EXPORT */

export default Highlights;
