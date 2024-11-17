import sqlite3
import json

con = sqlite3.connect("database.db")
cur = con.cursor()

cur.execute('''
    SELECT 
        Races.raceId, Races.name, Races.round, Races.date, 
        Circuits.name AS circuitName, Circuits.country, 
        Circuits.location, Races.weather, Races.summary
          
    FROM 
        Races
    JOIN 
        Circuits ON Races.circuitId = Circuits.circuitId
''')

rows = cur.fetchall()
with open('./solr/documents.json', 'w', encoding='utf-8') as file:
    file.write("[\n")
    for row in rows:
        document = {
            "name": row[1]+' '+row[3][0:4],
            "round": row[2],
            "date": row[3],
            "circuit": row[4],
            "country": row[5],
            "location": row[6],
            "weather condition": row[7],
            "summary": row[8],
        }

        drivers = cur.execute('''
            SELECT 
                Drivers.forename, Drivers.surname
            FROM 
                Drivers
            JOIN 
                Results ON Drivers.driverId = Results.driverId
            WHERE
                Results.raceId = ?
        ''', (row[0],)).fetchall()
        driversName = []
        for driver in drivers:
            driversName.append(driver[0] + ' ' + driver[1])
        document["drivers"] = driversName
        json_data = json.dumps(document)
        file.write(json_data + ",\n")
    file.write("\n]")