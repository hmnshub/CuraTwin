import pandas as pd
import os
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score


# Load dataset
dataset_path = "dataset/diabetes.csv"

data = pd.read_csv(dataset_path)

print("Dataset loaded successfully")
print(data.head())


# Separate features and target
X = data.drop("Outcome", axis=1)
y = data["Outcome"]


# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


# Create model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)


# Train model
model.fit(X_train, y_train)

print("Model training completed")


# Test accuracy
prediction = model.predict(X_test)

accuracy = accuracy_score(y_test, prediction)

print("Accuracy:", accuracy)


# Save model
model_path = "../ml/models/diabetes_model.pkl"

joblib.dump(model, model_path)

print("Model saved successfully!")
print("Saved at:", model_path)