import argparse
import json
import sys

try:
    with open('./solr/response.json', 'r') as f:
        solr_response = json.load(f)
    # Extract the document results from the Solr response
    docs = solr_response["response"]["docs"]

    # Enumerate through the results and write them in TREC format
    with open('./solr/response_trec.txt', 'w', encoding='utf-8') as f:
        for rank, doc in enumerate(docs, start=1):
            f.write(f"0 Q0 {'_'.join(doc['name'].split(' '))} {rank} {doc['score']} 0\n")

except KeyError:
    print("Error: Invalid Solr response format. 'docs' key not found.")
    sys.exit(1)