# Makefile

# Default target

all: clean collect process analyze

# Clean Data	

clean:
	rm -f collection/clean_data/*.csv
	rm -f collection/original_data/*.csv

# Collect Data

collect:
	python3 collection/kaggleScript.py
	python3 wikipediaAPI.py
	python3 addSummaryScript.py
	jupyter nbconvert --execute --to notebook --inplace collection/clean_data.ipynb

# Process Data

process:
	python3 sqlSchemaScript.py
	python3 sqlPopulateScript.py

# Analyze Data

analyze:
	jupyter nbconvert --execute --to notebook --inplace statistics.ipynb