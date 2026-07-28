import pandas as pd

# Load the dataset
df = pd.read_csv("datasets/diabetes.csv")

# First 5 rows
print("First 5 Rows:\n")
print(df.head())

# Dataset information
print("\nDataset Information:\n")
print(df.info())

# Statistical summary
print("\nStatistical Summary:\n")
print(df.describe())

# Missing values
print("\nMissing Values:\n")
print(df.isnull().sum())