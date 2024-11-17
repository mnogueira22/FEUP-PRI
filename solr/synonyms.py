import nltk
from nltk.corpus import wordnet
from nltk.tokenize import word_tokenize
from nltk import pos_tag
import pandas as pd

# Ensure you have the NLTK data
nltk.download('wordnet', quiet=True)
nltk.download('omw-1.4', quiet=True)
nltk.download('punkt', quiet=True)
nltk.download('averaged_perceptron_tagger', quiet=True)

# Tokenize the text into words

documents = pd.read_json("solr/documents.json")

text = ' '.join(documents["summary"].dropna())

words = set(word_tokenize(text.lower()))

# Dictionary to store synonyms for each word
synonyms_dict = {}

for word in words:
    # Get the part of speech (POS) tag for the word
    pos = pos_tag([word])[0][1]
    
    # Check if the word is a noun (NN, NNS, NNP, NNPS)
    if pos.startswith('NN'):
        synonyms = set()
        for syn in wordnet.synsets(word):
            for lemma in syn.lemmas():
                synonyms.add(lemma.name())
        if synonyms:
            synonyms_dict[word] = sorted(synonyms)

# Write the synonyms to the file in the desired format
with open('./solr/synonyms.txt', 'w') as file:
    for word, synonyms in synonyms_dict.items():
        file.write(', '.join(synonyms) + '\n')
