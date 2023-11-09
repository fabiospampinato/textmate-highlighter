
/* IMPORT */

import type {OnigScanner, OnigString} from 'vscode-oniguruma';
import type {IGrammar, IRawGrammar, IRawTheme} from 'vscode-textmate';

/* HELPERS */

type Disposer = () => void;

type FunctionMaybe<T> = (() => T) | T;

type PromiseMaybe<T> = Promise<T> | T;

/* MAIN */

type AbortSignal = {
  aborted: boolean
};

type OptionsHighlight<Grammar extends string = string, Theme extends string = string> = {
  code: string,
  grammar: Grammar,
  theme: Theme,
  background?: string,
  signal?: AbortSignal
};

type OptionsHighMate<Grammar extends string = string, Theme extends string = string> = {
  getGrammar: ( grammar: Grammar ) => PromiseMaybe<TextMateGrammarRaw | string>,
  getOniguruma: () => PromiseMaybe<ArrayBuffer | string>,
  getTheme: ( theme: Theme ) => PromiseMaybe<TextMateThemeRaw | string>
};

type OptionsOniguruma = {
  getOniguruma: () => PromiseMaybe<ArrayBuffer | string>
};

type OptionsRegistry<Grammar extends string, Theme extends string> = {
  getGrammar: ( grammar: Grammar ) => PromiseMaybe<TextMateGrammarRaw | string>,
  getOniguruma: () => Promise<TextMateOniguruma>,
  getTheme: ( theme: Theme ) => PromiseMaybe<TextMateThemeRaw | string>
};

type TextMateGrammar = IGrammar;

type TextMateGrammarRaw = IRawGrammar;

type TextMateOniguruma = {
  createOnigScanner: ( patterns: string[] ) => OnigScanner,
  createOnigString: ( content: string ) => OnigString
};

type TextMateRegistry<Grammar extends string> = {
  getColorMap: () => string[],
  loadGrammar: ( grammar: Grammar ) => Promise<TextMateGrammar | null>,
  setTheme: ( theme: TextMateThemeRaw ) => void
};

type TextMateThemeRaw = IRawTheme & {
  colors?: Record<string, string>,
  tokenColors?: any,
  settings?: any
};

type TextMateToken = {
  /* POSITION */
  startIndex: number,
  endIndex: number,
  /* STYLE */
  color: string,
  backgroundColor: string,
  fontStyle: string,
  textDecoration: string
};

/* EXPORT */

export type {Disposer, FunctionMaybe, PromiseMaybe};
export type {AbortSignal, OptionsHighlight, OptionsHighMate, OptionsOniguruma, OptionsRegistry, TextMateGrammar, TextMateGrammarRaw, TextMateOniguruma, TextMateRegistry, TextMateThemeRaw, TextMateToken};
