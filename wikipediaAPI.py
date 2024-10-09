import pandas as pd
import requests

# Gather URLs
df = pd.read_csv('collection/clean_data/races.csv')
URLs = df['url']

wikipediaApiUrl = "https://en.wikipedia.org/w/api.php"

for url in URLs:
    # Extract the title from the URL
    title = url.split("/")[-1].replace("_", " ")
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
                        file.write(str(page_data) + "\n\n\n")
                else:
                    print(f"Page for {title} not found.")
        else:
            print(f"No data found for {title}.")
    else:
        print(f"Error: {response.status_code}")
