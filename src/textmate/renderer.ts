
/* IMPORT */

import Highlights from './highlights';
import {escapeHTML, noop} from '../utils';
import type {Disposer, TextMateToken} from '../types';

/* MAIN */

// The background color is explicitly ignored, since themes don't seem to generally use it properly, or at all

const Renderer = {

  /* API */

  toDOM: ( lines: string[], tokens: TextMateToken[][], background: string = 'transparent' ): HTMLPreElement => {

    const output = document.createElement ( 'pre' );

    output.classList.add ( 'highmate' );
    output.style.backgroundColor = background;

    for ( let li = 0, ll = lines.length; li < ll; li++ ) {

      const line = lines[li];
      const lineTokens = tokens[li];

      for ( let ti = 0, tl = lineTokens.length; ti < tl; ti++ ) {

        const token = lineTokens[ti];
        const {startIndex, endIndex} = token;
        const {color, fontStyle, textDecoration} = token;
        const value = line.slice ( startIndex, endIndex );

        if ( !value ) continue;

        const node = document.createElement ( 'span' );

        node.innerText = value;

        if ( color ) node.style.color = color;
        if ( fontStyle ) node.style.fontStyle = fontStyle;
        if ( textDecoration ) node.style.textDecoration = textDecoration;

        output.appendChild ( node );

      }

      if ( li < ll - 1 ) {

        output.appendChild ( document.createTextNode ( '\n' ) );

      }

    }

    return output;

  },

  toHighlights: ( lines: string[], tokens: TextMateToken[][], background: string = 'transparent' ): [HTMLPreElement, Disposer] => {

    const output = document.createElement ( 'pre' );

    output.classList.add ( 'highmate' );
    output.style.backgroundColor = background;

    const text = document.createTextNode ( lines.join ( '\n' ) );

    output.appendChild ( text );

    if ( !Highlights.isSupported () ) return [output, noop];

    const disposers: Disposer[] = [];
    const dispose = () => disposers.forEach ( dispose => dispose () );

    for ( let s = 0, li = 0, ll = lines.length; li < ll; li++ ) {

      const line = lines[li];
      const lineTokens = tokens[li];

      for ( let ti = 0, tl = lineTokens.length; ti < tl; ti++ ) {

        const token = lineTokens[ti];
        const {startIndex, endIndex} = token;
        const {color, fontStyle, textDecoration} = token;

        const highlightId = `${color}-${fontStyle}-${textDecoration}`;
        const highlights = Highlights.getHighlights ( highlightId, { color, fontStyle, textDecoration } );
        const range = new Range ();

        range.setStart ( text, s + startIndex );
        range.setEnd ( text, s + endIndex );
        highlights.add ( range );
        disposers.push ( () => highlights.delete ( range ) );

      }

      s += line.length + 1;

    }

    return [output, dispose];

  },

  toHTML: ( lines: string[], tokens: TextMateToken[][], background: string = 'transparent' ): string => {

    let output = `<pre class="highmate" style="background-color:${background}">`;

    for ( let li = 0, ll = lines.length; li < ll; li++ ) {

      const line = lines[li];
      const lineTokens = tokens[li];

      for ( let ti = 0, tl = lineTokens.length; ti < tl; ti++ ) {

        const token = lineTokens[ti];
        const {startIndex, endIndex} = token;
        const {color, fontStyle, textDecoration} = token;

        const styleColor = color ? `color:${color}` : '';
        const styleFontStyle = fontStyle ? `;font-style:${fontStyle}` : '';
        const styleTextDecoration = textDecoration ? `;text-decoration:${textDecoration}` : '';
        const value = escapeHTML ( line.slice ( startIndex, endIndex ) );

        if ( !value ) continue;

        output += `<span style="${styleColor}${styleFontStyle}${styleTextDecoration}">${value}</span>`;

      }

      if ( li < ll - 1 ) {

        output += '\n';

      }

    }

    output += '</pre>';

    return output;

  }

};

/* EXPORT */

export default Renderer;
