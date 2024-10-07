import pandas
import requests

# Gather URLS
df = pandas.read_csv('archive/races.csv')
URLs = df['url']

wikipediaApiUrl = "https://en.wikipedia.org/w/api.php"


title = URLs[0].split("/")[-1].replace("_", " ")

params = {
        "action": "query",                      
        "format": "json",                        
        "titles": title,                         
        "prop": "extracts",                                          
        "explaintext": True,                      
    }

response = requests.get(wikipediaApiUrl, params=params)

if response.status_code == 200:
    data = response.json()
    with open('dataText.txt','w') as file:
        file.write(str(data))   
else:
    print(f"Error: {response.status_code}")

# for url in URLs:
#     title = url.split("/")[-1].replace("_", " ")

#     params = {
#         "action": "query",                      
#         "format": "json",                        
#         "titles": title,                         
#         "prop": "extracts",                     
#         "exintro": True,                        
#         "explaintext": True,                      
#     }

#     response = requests.get(wikipediaApiUrl, params=params)

#     if response.status_code == 200:
#         data = response.json()
#         print(data)
        
#     else:
#         print(f"Error: {response.status_code}")