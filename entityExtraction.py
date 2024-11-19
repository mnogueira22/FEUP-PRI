import nltk
from nltk import word_tokenize, pos_tag, ne_chunk
from nltk.chunk import tree2conlltags
from collections import Counter
import string
import pandas as pd

# Download necessary NLTK resources
nltk.download('punkt')        # For tokenization
nltk.download('maxent_ne_chunker') # For Named Entity Chunking
nltk.download('words')        # For word list (used in entity recognition)
nltk.download('stopwords')    # For stopword list

from nltk.corpus import stopwords

# Load your documents
documents = pd.read_json("solr/documents.json")

# Function to extract named entities from a text
def extract_entities(text):
    tokens = word_tokenize(text)
    tags = pos_tag(tokens)
    chunked = ne_chunk(tags)  # Create a tree of entities

    # Extract named entities from the tree
    entities = []
    for chunk in chunked:
        if hasattr(chunk, 'label'):  # Check if the chunk is a named entity
            if chunk.label() in ['PERSON', 'GPE', 'ORGANIZATION']:
                entities.append(' '.join(c[0] for c in chunk))  # Get the named entity words
    return entities

# Function to filter out stopwords and punctuation
def filter_entities(entities):
    stop_words = set(stopwords.words('english'))  # NLTK stopwords list
    filtered_entities = [
        word for word in entities
        if word.lower() not in stop_words and word not in string.punctuation
    ]
    return filtered_entities

# Extract and filter entities from all race summaries
all_entities = []

# Loop through all the summaries in the documents DataFrame
for summary in documents["summary"].dropna():
    entities = extract_entities(summary)
    filtered_entities = filter_entities(entities)
    all_entities.extend(filtered_entities)

# Count the frequency of each entity
entity_counts = Counter(all_entities)

# Print the top 10 most common entities
print("Top 10 Named Entities (People, Locations, Companies):")
for entity, count in entity_counts.most_common(10):
    print(f"{entity}: {count}")