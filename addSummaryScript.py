import json
import pandas

with open('data.txt', 'r', encoding='utf-8') as file:
    for line in file:
        if line:
            try:
                # Parse the JSON string into a Python dictionary
                data = json.loads(line)
                # Print the title if it exists
                title = data["title"]
                
                year = int(title[0:4].strip())
                name = title[4:].strip()

                races = pandas.read_csv('collection/clean_data/races.csv')

                races.loc[(races['year'] == year) & (races['name'] == name), 'summary'] = data["text"]
                races.to_csv('collection/clean_data/races.csv', index=False)

            except json.JSONDecodeError:
                print("Error while parsing")