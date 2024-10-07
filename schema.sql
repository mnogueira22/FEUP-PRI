DROP TABLE IF EXISTS Season;
DROP TABLE IF EXISTS Circuit;
DROP TABLE IF EXISTS Constructor;
DROP TABLE IF EXISTS DriverChampionship;
DROP TABLE IF EXISTS ConstructorChampionship;
DROP TABLE IF EXISTS Driver;
DROP TABLE IF EXISTS GrandPrixWeekend;
DROP TABLE IF EXISTS Race;
DROP TABLE IF EXISTS Qualifying;
DROP TABLE IF EXISTS RaceResult;
DROP TABLE IF EXISTS QualifyingResult;

CREATE TABLE Season (
    seasonID INTEGER PRIMARY KEY AUTOINCREMENT,
    year INTEGER NOT NULL
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
    seasonID INTEGER NOT NULL,
    position INTEGER NOT NULL,
    points INTEGER NOT NULL,
    FOREIGN KEY (seasonID) REFERENCES Season(seasonID),
    FOREIGN KEY (driverID) REFERENCES Driver(driverID)
);

CREATE TABLE ConstructorChampionship (
    constructorID INTEGER NOT NULL,
    seasonID INTEGER NOT NULL,
    position INTEGER NOT NULL,
    points INTEGER NOT NULL,
    FOREIGN KEY (seasonID) REFERENCES Season(seasonID),
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
    FOREIGN KEY (circuitID) REFERENCES Circuit(circuitID)
);

CREATE TABLE Race (
    raceID INTEGER PRIMARY KEY AUTOINCREMENT,
    gpID INTEGER NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    weatherCondition TEXT NOT NULL,
    raceSummary TEXT NOT NULL,
    FOREIGN KEY (gpID) REFERENCES GrandPrixWeekend(gpID)
);

CREATE TABLE Qualifying (
    qualifyingID INTEGER PRIMARY KEY AUTOINCREMENT,
    gpID INTEGER NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    weatherCondition TEXT NOT NULL,
    qualifyingSummary TEXT NOT NULL,
    FOREIGN KEY (gpID) REFERENCES GrandPrixWeekend(gpID)
);

CREATE TABLE RaceResult (
    raceResultID INTEGER PRIMARY KEY,
    gpID INTEGER NOT NULL,
    driverID INTEGER NOT NULL,
    position INTEGER NOT NULL,
    points INTEGER NOT NULL,
    FOREIGN KEY (gpID) REFERENCES GrandPrixWeekend(gpID),
    FOREIGN KEY (driverID) REFERENCES Driver(driverID)
);

CREATE TABLE QualifyingResult (
    qualifyingResultID INTEGER PRIMARY KEY,
    gpID INTEGER NOT NULL,
    driverID INTEGER NOT NULL,
    position INTEGER NOT NULL,
    q1Time TIME NOT NULL,
    q2Time TIME NOT NULL,
    q3Time TIME NOT NULL,
    FOREIGN KEY (gpID) REFERENCES GrandPrixWeekend(gpID),
    FOREIGN KEY (driverID) REFERENCES Driver(driverID)
);

