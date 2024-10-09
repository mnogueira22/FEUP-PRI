import sqlite3

con = sqlite3.connect("database.db")

con.execute("DROP TABLE IF EXISTS Seasons")
con.execute("DROP TABLE IF EXISTS Circuits")
con.execute("DROP TABLE IF EXISTS Constructors")
con.execute("DROP TABLE IF EXISTS DriverChampionship")
con.execute("DROP TABLE IF EXISTS ConstructorChampionship")
con.execute("DROP TABLE IF EXISTS Drivers")
con.execute("DROP TABLE IF EXISTS Races")
con.execute("DROP TABLE IF EXISTS Results")

con.execute("CREATE TABLE IF NOT EXISTS Seasons (year INTEGER PRIMARY KEY)")
con.execute("CREATE TABLE IF NOT EXISTS Circuits (circuitID INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, location TEXT NOT NULL, country TEXT NOT NULL)")
con.execute("CREATE TABLE IF NOT EXISTS Constructors (constructorID INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, nationality TEXT NOT NULL)")
con.execute("CREATE TABLE IF NOT EXISTS DriverChampionship (driverID INTEGER NOT NULL, year INTEGER NOT NULL, position INTEGER NOT NULL, points INTEGER NOT NULL, FOREIGN KEY (driverID) REFERENCES Drivers(driverID), FOREIGN KEY (year) REFERENCES Seasons(year))")
con.execute("CREATE TABLE IF NOT EXISTS ConstructorChampionship (constructorID INTEGER NOT NULL, year INTEGER NOT NULL, position INTEGER NOT NULL, points INTEGER NOT NULL, FOREIGN KEY (constructorID) REFERENCES Constructors(constructorID), FOREIGN KEY (year) REFERENCES Seasons(year))")
con.execute("CREATE TABLE IF NOT EXISTS Drivers (driverID INTEGER PRIMARY KEY AUTOINCREMENT, carNumber INTEGER NOT NULL, code TEXT NOT NULL, forename TEXT NOT NULL, surname TEXT NOT NULL, dateOfBirth DATE NOT NULL, nationality TEXT NOT NULL)")
con.execute("CREATE TABLE IF NOT EXISTS Races(raceID INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, round INTEGER NOT NULL, circuitID INTEGER NOT NULL, url TEXT NOT NULL, weatherCondition TEXT NOT NULL, date DATE NOT NULL, year INTEGER NOT NULL, summary TEXT NOT NULL, FOREIGN KEY (circuitID) REFERENCES Circuits(circuitID), FOREIGN KEY (year) REFERENCES Seasons(year))")
con.execute("CREATE TABLE IF NOT EXISTS Results (resultID INTEGER PRIMARY KEY AUTOINCREMENT, raceID INTEGER NOT NULL, driverID INTEGER NOT NULL, constructorID INTEGER NOT NULL, racePosition INTEGER NOT NULL, qualiPosition INTEGER NOT NULL, qualiTime TEXT NOT NULL, points INTEGER NOT NULL, FOREIGN KEY (raceID) REFERENCES Races(raceID), FOREIGN KEY (driverID) REFERENCES Drivers(driverID), FOREIGN KEY (constructorID) REFERENCES Constructors(constructorID))")

