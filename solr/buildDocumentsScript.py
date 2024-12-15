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
                Drivers.driverID, Drivers.forename, Drivers.surname
            FROM 
                Drivers
            JOIN 
                Results ON Drivers.driverId = Results.driverId
            WHERE
                Results.raceId = ?
        ''', (row[0],)).fetchall()
        driversWithRank = []
        for driver in drivers:
            driverID = driver[0]
            driverName = driver[1] + ' ' + driver[2]
            
            num_races = cur.execute('''
                SELECT COUNT(*) 
                FROM Results 
                WHERE driverID = ?
            ''', (driverID,)).fetchone()[0]

            num_championships = cur.execute('''
                SELECT COUNT(*) 
                FROM DriverChampionship 
                WHERE driverID = ? AND position = 1
            ''', (driverID,)).fetchone()[0]

            num_wins = cur.execute('''
                SELECT COUNT(*) 
                FROM Results 
                WHERE driverID = ? AND position = 1
            ''', (driverID,)).fetchone()[0]

            num_podiums = cur.execute('''
                SELECT COUNT(*) 
                FROM Results 
                WHERE driverID = ? AND position <= 3
            ''', (driverID,)).fetchone()[0]

            rank = num_races + (num_championships * 10) + (num_wins * 5) + (num_podiums * 2)
            
            driversWithRank.append((driverName, rank))

        document["drivers"] = driversWithRank

        json_data = json.dumps(document)
        file.write(json_data + ",\n")
    file.write("\n]")