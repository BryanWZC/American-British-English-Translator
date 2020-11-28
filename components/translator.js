const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

function flipObject(obj) {
    const newObj = {};
    for(let key in obj) {
        newObj[obj[key]] = key;
    }
    return newObj;
}

class Translator {
    constructor(text, locale) {
        this.text = text;
        this.locale = locale;
        this.translation;
        this.newWords = [];
        this.americanToBritishDict = { ...americanOnly, ...americanToBritishSpelling, ...americanToBritishTitles };
        this.britishToAmericanDict = { ...britishOnly, ...flipObject(americanToBritishSpelling), ...flipObject(americanToBritishTitles) };
    }
    translate() {
        if(typeof(this.text) === 'string' && !this.text.length) throw new Error('No text to translate');
        if(!this.text || !this.locale) throw new Error('Required field(s) missing');
        

        if(this.locale === 'american-to-british') return this.useAmericanToBritish();
        if(this.locale === 'british-to-american') return this.useBritishToAmerican();
        throw new Error('Invalid value for locale field');
    }
    useAmericanToBritish() {
        const translation = this.getTranslations();
        return translation;
    }
    useBritishToAmerican() {
        const translation = this.getTranslations();
        return translation;
    }
    getTranslations() {
        let translation = this.text;
        let newWords = [];

        ({ translation, newWords } = this.handleTime(translation, newWords));
        const dict = this.locale === 'american-to-british' ? this.americanToBritishDict : this.britishToAmericanDict;
        for(let key in dict) {
            const prev = translation;
            const lookUp = new RegExp(`(${key})([\\b\\W]{1})`, 'gi');
            translation = translation.replace(lookUp, `${dict[key]}$2`);
            
            if(translation !== prev) newWords.push(dict[key]);
        }

        this.translation = translation;
        this.newWords = newWords;

        return { translation: translation, newWords: newWords };
    }
    handleTime(translation, newWords) {
        const re = this.locale === 'american-to-british' ? /(\d+):(\d+)/g : /(\d+).(\d+)/g;
        const newRe = this.locale === 'american-to-british' ? /(\d+).(\d+)/g : /(\d+):(\d+)/g;
        const timeSeparator = this.locale === 'american-to-british' ? '.' : ':';

        translation = translation.replace(re, `$1${timeSeparator}$2`); 
        const match = translation.match(newRe);

        newWords = [...newWords, ...(match ? match : [])];
        return { translation, newWords };
    }
    highlightNewWords() {
        this.newWords.map(word => {
            const newWord = `<span class="highlight">${word}</span>`;
            const re = new RegExp(`${word}`, 'gi')
            this.translation = this.translation.replace(re, newWord);
        });
        return this.translation;
    }
}

module.exports = Translator;