#!/usr/bin/env python3

import sys
import argparse
from pathlib import Path

parser = argparse.ArgumentParser(
    description="Fetch search results from Solr and output them in JSON format."
)

parser.add_argument(
        "--file",
        type=Path,
        required=True,
        help="Path to the JSON file containing the Solr query parameters.",
    )

args = parser.parse_args()

with open('./solr/qrels/'+str(args.file), 'r') as f:
    qrels = f.readlines()

with open('./solr/qrels_trec.txt', 'w') as f:
    for line in qrels:
        doc_id = line.strip()
        f.write(f"0 0 {'_'.join(doc_id.split(' '))} 1\n")
