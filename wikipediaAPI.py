import pandas
import requests

# Gather URLS
df = pandas.read_csv('archive/races.csv')
URLs = df['url']

wikipediaApiUrl = "https://en.wikipedia.org/w/api.php"

for url in URLs:
    title = url.split("/")[-1].replace("_", " ")
    print(title)
    params = {
        "action": "query",                      
        "format": "json",                        
        "titles": title,                         
        "prop": "text",
        "formatversion": 2                                     
    }

    response = requests.get(wikipediaApiUrl, params=params)

    if response.status_code == 200:
        data = response.json()
        with open('data.txt','a') as file:
            file.write(str(data) + "\n")
        
    else:
        print(f"Error: {response.status_code}")