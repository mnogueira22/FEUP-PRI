import argparse
import json
import sys
from pathlib import Path

import requests

#passar boosted e q1 como args

parser = argparse.ArgumentParser(
    description="Fetch search results from Solr and output them in JSON format."
)

parser.add_argument(
        "--file",
        type=Path,
        required=True,
        help="Path to the JSON file containing the Solr query parameters.",
    )

parser.add_argument(
        "--type",
        type=Path,
        required=True,
        help="Path to the JSON file containing the Solr query parameters.",
    )


args = parser.parse_args()

with open("./solr/queries.json", "r") as f:
    query_params = json.load(f)[str(args.file)][str(args.type)]

# Construct the Solr request URL
uri = f"http://localhost:8983/solr/formula1/select"

try:
    # Send the POST request to Solr
    response = requests.post(uri, json=query_params)
    response.raise_for_status()  # Raise error if the request failed
except requests.RequestException as e:
    print(f"Error querying Solr: {e}")
    sys.exit(1)

# Fetch and print the results as JSON
results = response.json()
with open("./solr/response.json", 'w') as json_file:
    json.dump(results, json_file)
print(json.dumps(results, indent=2))


