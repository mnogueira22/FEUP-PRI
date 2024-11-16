import subprocess
import zipfile

# Download the dataset using Kaggle API
subprocess.run(['kaggle', 'datasets', 'download', '-d', 'rohanrao/formula-1-world-championship-1950-2020'])

# Unzip the dataset
zip_file = 'formula-1-world-championship-1950-2020.zip'
with zipfile.ZipFile(zip_file, 'r') as zip_ref:
    zip_ref.extractall('collection/original_data')

print("Dataset downloaded and extracted successfully!")
