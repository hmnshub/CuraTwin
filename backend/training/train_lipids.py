import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
import os

print("Generating synthetic lipid panel dataset...")
np.random.seed(42)

# Generate 1000 synthetic patient records
n_samples = 1000
age = np.random.randint(20, 80, n_samples)
bmi = np.random.uniform(18.5, 40.0, n_samples)
total_cholesterol = np.random.normal(200, 40, n_samples) # Mean 200 mg/dL
triglycerides = np.random.normal(150, 50, n_samples)     # Mean 150 mg/dL

# Simple logic for synthetic labels: 
# High cholesterol (>240) OR high triglycerides (>200) increases risk flag
risk_labels = np.where((total_cholesterol > 240) | (triglycerides > 200), 1, 0)

# Create a DataFrame
df = pd.DataFrame({
    'age': age,
    'bmi': bmi,
    'total_cholesterol': total_cholesterol,
    'triglycerides': triglycerides,
    'risk_flag': risk_labels
})

# Define input features (X) and target (y)
X = df[['age', 'bmi', 'total_cholesterol', 'triglycerides']]
y = df['risk_flag']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("Training the Hyperlipidemia Random Forest Classifier...")
rf_model = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)
rf_model.fit(X_train, y_train)

accuracy = rf_model.score(X_test, y_test)
print(f"Model trained successfully with validation accuracy: {accuracy * 100:.2f}%")

# Save the model to the ml_artifacts directory
os.makedirs("app/ml_artifacts", exist_ok=True)
model_path = "app/ml_artifacts/lipids_rf.joblib"
joblib.dump(rf_model, model_path)

print(f"Model serialized and saved to {model_path}")