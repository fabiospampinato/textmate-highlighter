
/* IMPORT */

import * as Highlighter from 'tokens-highlighter';
import Oniguruma from './textmate/oniguruma';
import Registry from './textmate/registry';
import Tokenizer from './textmate/tokenizer';
import type {Disposer, PromiseMaybe, AbortSignal, OptionsHighlight, OptionsHighlighter, TextMateToken} from './types';

/* MAIN */

class TextMateHighlighter<Grammar extends string = string, Theme extends string = string> {

  /* VARIABLES */

  private oniguruma: Oniguruma;
  private registry: Registry<Grammar, Theme>;
  private tokenizer: Tokenizer<Grammar, Theme>;

  /* CONSTRUCTOR */

  constructor ( options: OptionsHighlighter<Grammar, Theme> ) {

    const {getGrammar, getOniguruma, getTheme} = options;

    this.oniguruma = new Oniguruma ({ getOniguruma });
    this.registry = new Registry ({ getGrammar, getTheme, getOniguruma: () => this.oniguruma.load () });
    this.tokenizer = new Tokenizer ( this.registry );

  }

  /* API */

  highlightToAbstract = async <T> ( options: OptionsHighlight<Grammar, Theme>, highlighter: ( tokens: TextMateToken[][], options: { backgroundColor?: string } ) => PromiseMaybe<T> ): Promise<T> => {

    const lines = options.code.replace ( /^(\r?\n|\r)+|(\r?\n|\r)+$/g, '' ).split ( /\r?\n|\r/g );
    const tokens: TextMateToken[][] = new Array ( lines.length ).fill ( [] );

    await this.tokenize ( lines, options.grammar, options.theme, options.signal, ( lineTokens, lineIndex ) => {
      tokens[lineIndex] = lineTokens;
    });

    const backgroundColor = options.background || ( await this.registry.loadThemeColorsDefault ( options.theme ) ).background;
    const result = highlighter ( tokens, { backgroundColor } );

    return result;

  };

  highlightToANSI = ( options: OptionsHighlight<Grammar, Theme> ): Promise<string> => {

    return this.highlightToAbstract ( options, Highlighter.toANSI );

  };

  highlightToDOM = ( options: OptionsHighlight<Grammar, Theme> ): Promise<HTMLPreElement> => {

    return this.highlightToAbstract ( options, Highlighter.toDOM );

  };

  highlightToHighlights = ( options: OptionsHighlight<Grammar, Theme> ): Promise<[HTMLPreElement, Disposer]> => {

    return this.highlightToAbstract ( options, Highlighter.toHighlights );

  };

  highlightToHTML = ( options: OptionsHighlight<Grammar, Theme> ): Promise<string> => {

    return this.highlightToAbstract ( options, Highlighter.toHTML );

  };

  tokenize = ( lines: string[], grammar: Grammar, theme: Theme, signal?: AbortSignal, onTokens?: ( tokens: TextMateToken[], lineIndex: number ) => void ): Promise<TextMateToken[][]> => {

    return this.tokenizer.tokenize ( lines, grammar, theme, signal, onTokens );

  };

}

/* EXPORT */

export default TextMateHighlighter;
export type {OptionsHighlight, OptionsHighlighter, TextMateToken};
