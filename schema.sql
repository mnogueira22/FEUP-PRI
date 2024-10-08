DROP TABLE IF EXISTS Season;
DROP TABLE IF EXISTS Circuit;
DROP TABLE IF EXISTS Constructor;
DROP TABLE IF EXISTS DriverChampionship;
DROP TABLE IF EXISTS ConstructorChampionship;
DROP TABLE IF EXISTS Driver;
DROP TABLE IF EXISTS GrandPrixWeekend;
DROP TABLE IF EXISTS RaceResult;

CREATE TABLE Season (
    year INTEGER PRIMARY KEY
);


CREATE TABLE Circuit (
    circuitID INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    country TEXT NOT NULL
);

CREATE TABLE Constructor (
    constructorID INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    nationality TEXT NOT NULL
);

CREATE TABLE DriverChampionship (
    driverID INTEGER NOT NULL,
    year INTEGER NOT NULL,
    position INTEGER NOT NULL,
    points INTEGER NOT NULL,
    FOREIGN KEY (year) REFERENCES Season(year),
    FOREIGN KEY (driverID) REFERENCES Driver(driverID)
);

CREATE TABLE ConstructorChampionship (
    constructorID INTEGER NOT NULL,
    year INTEGER NOT NULL,
    position INTEGER NOT NULL,
    points INTEGER NOT NULL,
    FOREIGN KEY (year) REFERENCES Season(year),
    FOREIGN KEY (constructorID) REFERENCES Constructor(constructorID)
);

CREATE TABLE Driver (
    driverID INTEGER PRIMARY KEY AUTOINCREMENT,
    carNumber INTEGER NOT NULL,
    code TEXT NOT NULL,
    forename TEXT NOT NULL,
    surname TEXT NOT NULL,
    dateOfBirth DATE NOT NULL,
    nationality TEXT NOT NULL
);

CREATE TABLE GrandPrixWeekend (
    gpID INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    round INTEGER NOT NULL,
    circuitID INTEGER NOT NULL,
    url TEXT NOT NULL,
    weatherCondition TEXT NOT NULL,
    date DATE NOT NULL,
    summary TEXT NOT NULL,
    FOREIGN KEY (circuitID) REFERENCES Circuit(circuitID)
);

CREATE TABLE RaceResult (
    raceResultID INTEGER PRIMARY KEY AUTOINCREMENT,
    gpID INTEGER NOT NULL,
    driverID INTEGER NOT NULL,
    constructorID INTEGER NOT NULL,
    racePosition INTEGER NOT NULL,
    qualiPosition INTEGER NOT NULL,
    qualiTime TEXT NOT NULL,
    points INTEGER NOT NULL,
    FOREIGN KEY (gpID) REFERENCES GrandPrixWeekend(gpID),
    FOREIGN KEY (driverID) REFERENCES Driver(driverID),
    FOREIGN KEY (constructorID) REFERENCES Constructor(constructorID)
);


