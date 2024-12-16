const natural = require('natural');
const stopword = require('stopword');


const tokenizer = new natural.WordTokenizer();
const language = "EN"
const defaultCategory = 'N';
const defaultCategoryCapitalized = 'NNP';

const lexicon = new natural.Lexicon(language, defaultCategory, defaultCategoryCapitalized);
const ruleSet = new natural.RuleSet('EN');
const tagger = new natural.BrillPOSTagger(lexicon, ruleSet);

function preprocessQuery(query) {
  let tokens = tokenizer.tokenize(query);

  tokens = stopword.removeStopwords(tokens);

  const taggedTokens = tagger.tag(tokens);

  const filteredTokens = taggedTokens.taggedWords.filter(token => 
    token.tag.startsWith('N') || token.tag.startsWith('JJ')
  ).map(token => token.token);

  return filteredTokens.join(" ");
}

module.exports = { preprocessQuery };


