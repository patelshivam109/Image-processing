import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        setDescription('');
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/describe', {
        image: image
      });
      setDescription(response.data.description);
    } catch (error) {
      console.error('Error:', error);
      setDescription('Error: Could not analyze image. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    setDescription('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Image Describer</h1>
        <p>Describe images for the visually impaired</p>
      </header>

      <div className="container">
        {!image ? (
          <div className="upload-section">
            <h2>Upload an Image</h2>
            <input 
              type="file" 
              ref={fileInputRef}
              accept="image/*" 
              onChange={handleFileSelect}
            />
            <p>Or drag and drop an image here</p>
          </div>
        ) : (
          <div className="image-section">
            <div className="image-preview">
              <img src={image} alt="Preview" />
            </div>
            <div className="controls">
              <button onClick={analyzeImage} disabled={loading}>
                {loading ? 'Analyzing...' : 'Describe Image'}
              </button>
              <button onClick={removeImage}>Remove Image</button>
            </div>
          </div>
        )}

        {description && (
          <div className="result-section">
            <h2>Description:</h2>
            <p>{description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
