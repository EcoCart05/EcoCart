import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Embedding
from tensorflow.keras.utils import to_categorical
from sklearn.model_selection import train_test_split

# Dummy data: user sequences of product IDs (1-5) and next product to recommend
# In a real scenario, replace this with your actual user interaction data
user_sequences = [
    [1, 2, 3],
    [2, 3, 4],
    [3, 4, 5],
    [1, 3, 5],
    [2, 4, 1],
    [5, 1, 2],
    [4, 5, 3],
    [3, 1, 4],
]
next_products = [4, 5, 1, 2, 3, 3, 2, 2]  # What product was actually chosen next

# Parameters
num_products = 5  # Number of unique products
max_seq_len = 3

X = np.array(user_sequences)
y = np.array(next_products) - 1  # zero-based indexing for categorical

y_cat = to_categorical(y, num_classes=num_products)

# Model
model = Sequential([
    Embedding(input_dim=num_products+1, output_dim=8, input_length=max_seq_len),
    LSTM(16, return_sequences=False),
    Dense(num_products, activation='softmax')
])

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Train
model.fit(X, y_cat, epochs=50, batch_size=2, verbose=1)

# Save
model.save('lstm_recommender_model.h5')
print('Model trained and saved as lstm_recommender_model.h5')
