from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import os
import random

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({"message": "Flask backend is working!"})

@app.route('/api/health')
def health():
    return jsonify({"status": "healthy", "service": "Image Describer API"})

@app.route('/api/describe', methods=['POST'])
def describe_image():
    try:
        # Get the JSON data from request
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({"error": "No image data provided"}), 400
        
        image_data = data['image']
        
        # Remove data URL prefix if present
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        # Mock AI response - in real app, this would call GPT-4 Vision
        mock_descriptions = [
            "This image shows a golden retriever dog playing in a green park. The dog is running towards a red ball with its tongue out.",
            "A person working at a wooden desk with a laptop, a cup of coffee, and a notebook. Sunlight streams through a large window.",
            "A beautiful sunset over a calm lake with mountains in the distance. The sky has shades of orange and purple.",
            "A modern office with people collaborating around a whiteboard. One person is pointing at a diagram."
        ]
        
        description = random.choice(mock_descriptions)
        
        return jsonify({
            "description": description,
            "status": "success"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True, port=5000, host='0.0.0.0')