docker run -p 8983:8983 --name meic_solr -v ${PWD}:/data -d solr:9 solr-precreate formula1
sleep 2
Invoke-WebRequest -Uri "http://localhost:8983/solr/formula1/schema" -Method POST -Headers @{"Content-Type"="application/json"} -Body (Get-Content -Path "./solr/schema.json" -Raw)
##curl -X POST -H 'Content-type:application/json' --data-binary "@./schema.json" http://localhost:8983/solr/formula1/schema
sleep 2
docker exec meic_solr bin/solr post -c formula1 /data/solr/documents.json
##DELETE
#docker exec meic_solr bin/solr delete -c formula1
##CREATE
#docker exec meic_solr bin/solr create -c formula1