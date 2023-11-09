
/* IMPORT */

import benchmark from 'benchloop';
import Shiki from 'shiki';
import HighMate from '../dist/index.js';

/* HELPERS */

const CODE = `
  shiki
  .getHighlighter({
    theme: 'nord',
    langs: ['js'],
  })
  .then(highlighter => {
    const code = highlighter.codeToHtml(\`console.log('shiki');\`, { lang: 'js' })
    document.getElementById('output').innerHTML = code
  })
`;

const ONIGURUMA = (
  'https://unpkg.com/vscode-oniguruma@2.0.1/release/onig.wasm'
);

const GRAMMARS = {
  'source.css': 'https://unpkg.com/shiki@^0.14.5/languages/css.tmLanguage.json',
  'source.js': 'https://unpkg.com/shiki@^0.14.5/languages/javascript.tmLanguage.json',
  'text.html.basic': 'https://unpkg.com/shiki@^0.14.5/languages/html.tmLanguage.json'
};

const THEMES = {
  'github-dark': 'https://unpkg.com/shiki@^0.14.5/themes/github-dark.json'
};

const highmate = new HighMate ({
  getGrammar: grammar => GRAMMARS[grammar],
  getTheme: theme => THEMES[theme],
  getOniguruma: () => ONIGURUMA
});

const shiki = await Shiki.getHighlighter ({
  theme: 'github-dark'
});

const highmateToHTML = () => {

  return highmate.highlightToHTML ({
    code: CODE,
    grammar: 'source.js',
    theme: 'github-dark'
  });

};

const shikiToHTML = () => {

  return shiki.codeToHtml ( CODE, { lang: 'html' } );

};

await highmateToHTML (); // Ensuring resources are already loaded
await shikiToHTML (); // Ensuring resources are already loaded

/* MAIN */

benchmark.config ({
  iterations: 1000
});

benchmark ({
  name: 'highmate.highlightToHTML',
  fn: () => {
    return highmateToHTML ();
  }
});

benchmark ({
  name: 'shiki.highlightToHTML',
  fn: () => {
    return shikiToHTML ();
  }
});
