import pandas as pd
import requests
import json
import urllib.parse

# Gather URLs
df = pd.read_csv('collection/original_data/races.csv')
URLs = df.loc[df['name'] == 'São Paulo Grand Prix','url']

wikipediaApiUrl = "https://en.wikipedia.org/w/api.php"

for url in URLs:
    # Extract the title from the URL
    title = urllib.parse.unquote(url.split("/")[-1].replace("_", " "))

    if title.endswith("Brazilian Grand Prix"):
        year = title.replace(" Brazilian Grand Prix", "")  # Remove the suffix
        title = f"{year} São Paulo Grand Prix"

    print(f"Fetching data for: {title}")
    
    params = {
        "action": "query",                      
        "format": "json",                       
        "titles": title,                        
        "prop": "extracts",
        "explaintext": True,                   
        "formatversion": 2                     
    }

    response = requests.get(wikipediaApiUrl, params=params)

    if response.status_code == 200:
        data = response.json()
        pages = data.get("query", {}).get("pages", [])
        if pages:
            for page in pages:
                if 'missing'not in page:# Check if the page exists
                    with open('data.txt', 'a', encoding='utf-8') as file:
                        page_data = {
                        "title": title,
                        "text": page.get('extract', 'No content found')
                        }

                        json_data = json.dumps(page_data)
                        file.write(json_data + "\n")
                else:
                    print(f"Page for {title} not found.")
        else:
            print(f"No data found for {title}.")
    else:
        print(f"Error: {response.status_code}")