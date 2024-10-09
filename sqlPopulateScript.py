import sqlite3
import pandas as pd

con = sqlite3.connect("database.db")

# Read the seasons data from the csv file
seasons = pd.read_csv("collection/clean_data/seasons.csv")
seasons.to_sql("Seasons", con, if_exists="replace", index=False)

# Read the circuits data from the csv file
circuits = pd.read_csv("collection/clean_data/circuits.csv")
circuits.to_sql("Circuits", con, if_exists="replace", index=False)

# Read the constructors data from the csv file
constructors = pd.read_csv("collection/clean_data/constructors.csv")
constructors.to_sql("Constructors", con, if_exists="replace", index=False)

# Read the drivers data from the csv file
drivers = pd.read_csv("collection/clean_data/drivers.csv")
drivers.to_sql("Drivers", con, if_exists="replace", index=False)

# Read the races data from the csv file
races = pd.read_csv("collection/clean_data/races.csv")
races.to_sql("Races", con, if_exists="replace", index=False)

# Read the results data from the csv file
results = pd.read_csv("collection/clean_data/results.csv")
results.to_sql("Results", con, if_exists="replace", index=False)

# print the tables with content in the database
print(pd.read_sql_query("SELECT * FROM Seasons", con))
print(pd.read_sql_query("SELECT * FROM Circuits", con))
print(pd.read_sql_query("SELECT * FROM Constructors", con))
print(pd.read_sql_query("SELECT * FROM Drivers", con))
print(pd.read_sql_query("SELECT * FROM Races", con))
print(pd.read_sql_query("SELECT * FROM Results", con))

con.close()

#print the tables of constructorchampionship and driverchampionship
con = sqlite3.connect("database.db")
print(pd.read_sql_query("SELECT * FROM ConstructorChampionship", con))
print(pd.read_sql_query("SELECT * FROM DriverChampionship", con))
con.close()


