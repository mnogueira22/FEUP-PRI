import json
import pandas
import re

with open('data.txt', 'r', encoding='utf-8') as file:
    for line in file:
        if line:
            try:
                # Parse the JSON string into a Python dictionary
                data = json.loads(line)
                # Print the title if it exists
                title = data["title"]
                text = data["text"]
                
                if (title != "70th Anniversary Grand Prix"):
                    year = int(title[0:4].strip())
                    name = title[4:].strip()
                else:
                    year = 2020
                    name = title 

                sections = ["External links", "References", "See also"]
                
                for section in sections:
                    pattern = f"== {section} ==.*?(?== |$)"  # Regex to match sections to remove
                    text = re.sub(pattern, "", text, flags=re.DOTALL) 

                races = pandas.read_csv('collection/clean_data/races.csv')

                races.loc[(races['year'] == year) & (races['name'] == name), 'summary'] = text
                races.to_csv('collection/clean_data/races.csv', index=False)

            except json.JSONDecodeError:
                print("Error while parsing")