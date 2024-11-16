#!/usr/bin/env python3

import argparse
import json
import sys
from pathlib import Path

import requests

query = "lotus after 2010"

query_params = {
    "query": query,
    "fields": "id, weather_condition",
    "limit": 20,
    "params": {
        "defType": "edismax",
        "q.op": "OR",
        "qf": "id circuit country^2 location weather_condition summary^5 drivers",
        "pf": "summary^10"
    }
}

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
print(json.dumps(results, indent=2))


