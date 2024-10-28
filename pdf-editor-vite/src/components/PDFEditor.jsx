import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { jsPDF } from 'jspdf';
import SignatureField from './SignatureField'; // Assuming SignatureField component exists
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

import { Document, Page, pdfjs } from 'react-pdf';

// Set the worker source to a valid PDF.js worker script URL
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`;

const PDFEditor = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [fields, setFields] = useState([]);
  const [numPages, setNumPages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = () => {
        setPdfFile(reader.result);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const addField = (type) => {
    const newField = {
      type,
      x: 50,
      y: 50,
      content:
        type === 'Signature' ? (
          <SignatureField onSign={(sign) => console.log(sign)} />
        ) : (
          type
        ),
    };
    setFields([...fields, newField]);
  };

  const saveDocument = () => {
    const pdfDoc = new jsPDF();
    fields.forEach((field) => {
      pdfDoc.text(field.type, field.x, field.y);
    });
    pdfDoc.save('edited-document.pdf');
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div>
      <h2>PDF Editor</h2>
      <input type="file" onChange={handleFileChange} accept="application/pdf" />
      <button onClick={() => addField('Signature')}>Add Signature</button>
      <button onClick={() => addField('Date')}>Add Date</button>
      <button onClick={saveDocument}>Save PDF</button>

      {pdfFile && (
        <div style={{ position: 'relative', width: '100%' }}>
          {isLoading ? (
            <p>Loading PDF...</p>
          ) : (
            <Document
              file={pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={(error) =>
                console.error('Failed to load PDF:', error)
              }
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page key={index} pageNumber={index + 1} width={600} />
              ))}
              {fields.map((field, index) => (
                <Draggable
                  key={index}
                  position={{ x: field.x, y: field.y }}
                  onStop={(e, data) => {
                    const updatedFields = [...fields];
                    updatedFields[index] = { ...field, x: data.x, y: data.y };
                    setFields(updatedFields);
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      border: '1px dashed #000',
                      padding: '5px',
                      cursor: 'move',
                      backgroundColor: '#f9f9f9',
                    }}
                  >
                    {field.content}
                  </div>
                </Draggable>
              ))}
            </Document>
          )}
        </div>
      )}
    </div>
  );
};

export default PDFEditor;
