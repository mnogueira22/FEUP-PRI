query="q2"
type="boosted"
qrels="qrels_2.txt"

python3 ./solr/query_solr.py --file $query --type $type
python3 ./solr/solr2trec.py
python3 ./solr/qrels2trec.py --file $qrels
python3 ./solr/plot_pr.py