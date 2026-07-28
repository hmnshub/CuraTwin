import pandas as pd

# Load dataset
data = pd.read_csv("dataset/diabetes.csv")

print("Dataset Information")
print("-" * 40)
print(data.info())

print("\nStatistical Summary")
print("-" * 40)
print(data.describe())

print("\nMissing Values")
print("-" * 40)
print(data.isnull().sum())

print("\nOutcome Distribution")
print("-" * 40)
print(data["Outcome"].value_counts())