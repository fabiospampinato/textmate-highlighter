
/* IMPORT */

import {TMRegistry} from './vendor';
import {isString, memoize, once} from '../utils';
import type {OptionsRegistry, TextMateGrammar, TextMateGrammarRaw, TextMateRegistry, TextMateThemeRaw} from '../types';

/* MAIN */

class Registry<Grammar extends string, Theme extends string> {

  /* VARIABLES */

  private options: OptionsRegistry<Grammar, Theme>;
  private registry: TextMateRegistry<Grammar>;
  private theme: TextMateThemeRaw | undefined;

  /* CONSTRUCTOR */

  constructor ( options: OptionsRegistry<Grammar, Theme> ) {

    this.options = options;

    this.registry = new TMRegistry ({
      onigLib: options.getOniguruma (),
      loadGrammar: this.fetchGrammar
    });

  }

  /* API */

  fetchGrammar = memoize (async ( name: Grammar ): Promise<TextMateGrammarRaw | undefined> => {

    const source = await this.options.getGrammar ( name );

    if ( isString ( source ) ) {

      return await ( await fetch ( source ) ).json ();

    } else if ( source ) {

      return source;

    } else {

      console.warn ( `Missing grammar: "${name}"` );

    }

  });

  fetchTheme = memoize (async ( name: Theme ): Promise<TextMateThemeRaw | undefined> => {

    const source = await this.options.getTheme ( name );

    if ( isString ( source ) ) {

      return await ( await fetch ( source ) ).json ();

    } else if ( source ) {

      return source;

    } else {

      console.warn ( `Missing theme: "${name}"` );

    }

  });

  loadGrammar = memoize (async ( name: Grammar ): Promise<TextMateGrammar | undefined> => {

    return await this.registry.loadGrammar ( name ) || undefined;

  });

  loadTheme = memoize (async ( name: Theme ): Promise<TextMateThemeRaw | undefined> => {

    const theme = await this.fetchTheme ( name );

    if ( !theme ) return;

    const themeNormalized = this.normalizeTheme ( theme );

    return themeNormalized;

  });

  loadThemeColors = memoize (async ( name: Theme ): Promise<string[]> => {

    const theme = await this.loadTheme ( name );

    if ( !theme ) return [];

    this.registry.setTheme ( theme );

    const colors = this.registry.getColorMap ();

    return colors;

  });

  loadThemeColorsDefault = memoize (async ( name: Theme ): Promise<{ background: string, foreground: string }> => {

    const theme = await this.fetchTheme ( name );
    const background = theme?.colors?.['editor.background'] || theme?.colors?.['background'] || '#000000';
    const foreground = theme?.colors?.['editor.foreground'] || theme?.colors?.['foreground'] || '#ffffff'

    return { background, foreground };

  });

  loadThemeDecorations = once ((): string[] => {

    return ['', '', '', '', 'underline'];

  });

  loadThemeStyles = once ((): string[] => {

    return ['', 'italic', 'bold', '', ''];

  });

  normalizeTheme = memoize (async ( theme?: TextMateThemeRaw ): Promise<TextMateThemeRaw> => {

    theme ||= {
      name: 'Fallback',
      settings: []
    };

    theme.settings ||= theme.tokenColors || [];

    theme.settings.unshift?.({
      settings: {
        background: theme.colors?.['editor.background'] || theme.colors?.['background'] || '#000000',
        foreground: theme.colors?.['editor.foreground'] || theme.colors?.['foreground'] || '#ffffff'
      }
    });

    return theme;

  });

  setTheme = ( theme: TextMateThemeRaw ): void => {

    if ( this.theme === theme ) return;

    this.theme = theme;

    this.registry.setTheme ( theme );

  };

}

/* EXPORT */

export default Registry;
