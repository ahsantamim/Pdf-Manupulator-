// src/App.js
import React from 'react';
import PDFEditor from './components/PDFUploadViewer';
import PDFUploadViewer from './components/PDFUploadViewer';

function App() {
  return (
    <div className="App">
      <h1>PDF Editor Application</h1>
      <PDFUploadViewer />
    </div>
  );
}

export default App;
