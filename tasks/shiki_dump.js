
/* IMPORT */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import Package from 'paketo';
import readdir from 'tiny-readdir';

/* CONSTANTS */

const SHIKI_PATH = path.join ( process.cwd (), 'node_modules', 'shiki' );
const SHIKI_LANGUAGES_PATH = path.join ( SHIKI_PATH, 'languages' );
const SHIKI_THEMES_PATH = path.join ( SHIKI_PATH, 'themes' );
const SHIKI_VERSION = Package.devDependencies.shiki;

/* HELPERS */

const getLanguages = async () => {

  const {files} = await readdir ( SHIKI_LANGUAGES_PATH );
  const languages = {};

  for ( const file of files ) {

    const language = JSON.parse ( fs.readFileSync ( file, 'utf8' ) );
    const languageName = language.scopeName;
    const languageUrl = `https://unpkg.com/shiki@${SHIKI_VERSION}/languages/${path.basename ( file )}`;

    languages[languageName] = languageUrl;

  }

  return languages;

};

const getThemes = async () => {

  const {files} = await readdir ( SHIKI_THEMES_PATH );
  const themes = {};

  for ( const file of files ) {

    const themeName = path.basename ( file, '.json' );
    const themeUrl = `https://unpkg.com/shiki@${SHIKI_VERSION}/themes/${path.basename ( file )}`;

    themes[themeName] = themeUrl;

  }

  return themes;

};

/* MAIN */

const dump = async () => {

  const languages = await getLanguages ();
  const themes = await getThemes ();

  console.log ( JSON.stringify ( languages, undefined, 2 ) );
  console.log ( JSON.stringify ( themes, undefined, 2 ) );

};

/* RUNNING */

dump ();
