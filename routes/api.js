'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  
  app.route('/api/translate')
    .post((req, res) => {
      try {
        const { text, locale } = req.body;
        const translator = new Translator(text, locale);
        translator.translate();
        const translation = translator.highlightNewWords().replace(/\'/g, '');
        let result = { text: text, translation: translation };

        if(translation === text) result = { text: text, translation: 'Everything looks good to me!' } 
          res.json(result);
      } catch (error) {
        res.json({ error: error.message });
      }
    });
};
