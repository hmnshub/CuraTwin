import pandas as pd
import os
import joblib

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.linear_model import LogisticRegression


# Load dataset
dataset_path = "dataset/diabetes.csv"

data = pd.read_csv(dataset_path)
# Replace medically invalid 0 values with the median
columns_with_invalid_zeros = [
    "Glucose",
    "BloodPressure",
    "SkinThickness",
    "Insulin",
    "BMI"
]

for col in columns_with_invalid_zeros:
    data[col] = data[col].replace(0, data[col].median())

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
    n_estimators=200,
    max_depth=10,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42
)


# Train model
model.fit(X_train, y_train)

print("Model training completed")


# Test accuracy
y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print("Accuracy:", accuracy)
from sklearn.metrics import classification_report, confusion_matrix

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))
# Cross Validation
scores = cross_val_score(model, X, y, cv=5)

print("\nCross Validation Scores:")
print(scores)

print("\nAverage Cross Validation Accuracy:")
print(scores.mean())
# Feature Importance
feature_importance = pd.DataFrame({
    "Feature": X.columns,
    "Importance": model.feature_importances_
})

feature_importance = feature_importance.sort_values(
    by="Importance",
    ascending=False
)

print("\nFeature Importance:")
print(feature_importance)

# Save model
model_path = "../ml/models/diabetes_model.pkl"

joblib.dump(model, model_path)

print("Model saved successfully!")
print("Saved at:", model_path)