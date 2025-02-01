from sklearn.ensemble import IsolationForest
import numpy as np

def detect_anomalies(data):
    model = IsolationForest(contamination=0.1)
    model.fit(data)
    anomalies = model.predict(data)
    return anomalies

# Example usage
data = np.array([[1], [2], [1.5], [8], [1.2], [1.3], [10]])
anomalies = detect_anomalies(data)
print("Anomalies detected:", anomalies) 