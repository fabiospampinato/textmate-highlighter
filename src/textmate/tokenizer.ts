
/* IMPORT */

import {makeIntervalYielder} from 'event-loop-yielder';
import Registry from './registry';
import {INITIAL} from './vendor';
import type {AbortSignal, TextMateToken} from '../types';

/* HELPERS */

const yieldToEventLoop = makeIntervalYielder ( 10 );

/* MAIN */

//TODO: Support tokenization checkpoints, if possible, so that tokenization is restarted close to where the edit happened, and perhaps even resumed after the edit happened when possible (!)

class Tokenizer<Grammar extends string, Theme extends string> {

  /* VARIABLES */

  private registry: Registry<Grammar, Theme>;

  /* CONSTRUCTOR */

  constructor ( registry: Registry<Grammar, Theme> ) {

    this.registry = registry;

  }

  /* API */

  tokenize = async ( lines: string[], grammar: Grammar, theme: Theme, signal: AbortSignal | undefined, onTokens: ( tokens: TextMateToken[], lineIndex: number ) => void ): Promise<void> => { //TODO: Optimize this //TODO: Maybe add a sync version too

    const tokenizer = await this.registry.loadGrammar ( grammar );
    const themer = await this.registry.loadTheme ( theme );
    const colors = await this.registry.loadThemeColors ( theme );
    const decorations = this.registry.loadThemeDecorations ();
    const styles = this.registry.loadThemeStyles ();
    const weights = this.registry.loadThemeWeights ();

    if ( !tokenizer ) return;
    if ( !themer ) return;

    let state = INITIAL;

    for ( let i = 0, l = lines.length; i < l; i++ ) {

      if ( i % 10 === 0 ) await yieldToEventLoop ();

      if ( signal?.aborted ) return;

      this.registry.setTheme ( themer ); // To be sure we are always tokenizing the right theme

      const line = lines[i];
      const lineLength = line.length;
      const lineResult = tokenizer.tokenizeLine2 ( line, state );
      const lineTokens: TextMateToken[] = new Array ( lineResult.tokens.length / 2 );
      const tokens = lineResult.tokens;

      for ( let ti = 0, tj = 0, tl = tokens.length; ti < tl; ti += 2, tj += 1 ) {

        if ( ti % 100 === 0 ) await yieldToEventLoop ();

        if ( signal?.aborted ) return;

        const startIndex = tokens[ti];
        const endIndex = tokens[ti + 2] || lineLength;
        const value = line.substring ( startIndex, endIndex );

        const bits = tokens[ti + 1];
        const colorBits = ( bits & 0b00000000011111111100000000000000 ) >>> 15;
        const backgroundColorBits = ( bits & 0b11111111100000000000000000000000 ) >>> 24;
        const fontBits = ( bits & 0b00000000000000000011100000000000 ) >>> 11;

        const color = colors[colorBits] || '';
        const backgroundColor = colors[backgroundColorBits] || '';
        const fontStyle = styles[fontBits] || '';
        const fontWeight = weights[fontBits] || '';
        const textDecoration = decorations[fontBits] || '';

        const token: TextMateToken = { value, startIndex, endIndex, color, backgroundColor, fontStyle, fontWeight, textDecoration };

        lineTokens[tj] = token;

      }

      state = lineResult.ruleStack;

      onTokens ( lineTokens, i );

    }

  };

}

/* EXPORT */

export default Tokenizer;
