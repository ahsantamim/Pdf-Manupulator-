// PDFUploadViewer.jsx
import React, { useState, useRef } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import Draggable from 'react-draggable';
import SignatureField from './SignatureField';
import { PDFDocument, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PDFUploadViewer = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [fields, setFields] = useState([]);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please select a valid PDF file.');
        return;
      }
      const fileURL = URL.createObjectURL(file);
      setPdfFile(fileURL);
    }
  };

  const addField = (type) => {
    const newField = {
      type,
      x: 50,
      y: 50,
      content: type === 'Signature' ? null : new Date().toLocaleDateString(),
    };
    setFields((prevFields) => [...prevFields, newField]);
  };

  const saveDocument = async () => {
    if (!pdfFile) return;

    const existingPdfBytes = await fetch(pdfFile).then((res) =>
      res.arrayBuffer()
    );

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const page = pdfDoc.getPages()[0];

    // Add fields to the PDF
    for (const field of fields) {
      if (field.type === 'Signature') {
        try {
          // Ensure content is not null before embedding
          if (!field.content) {
            console.error('Signature content is null. Skipping embedding.');
            continue; // Skip this iteration if content is null
          }

          const img = await pdfDoc.embedPng(field.content); // field.content is a data URL
          const { width, height } = img.scale(0.5);

          page.drawImage(img, {
            x: field.x,
            y: page.getHeight() - field.y - height,
            width,
            height,
          });
        } catch (error) {
          console.error('Error fetching or embedding image:', error);
        }
      } else if (field.type === 'Date') {
        page.drawText(field.content, {
          x: field.x,
          y: page.getHeight() - field.y - 20,
          size: 12,
          color: rgb(0, 0, 0),
        });
      }
    }

    const pdfBytes = await pdfDoc.save();
    saveAs(new Blob([pdfBytes]), 'edited-document.pdf');
  };

  return (
    <div className="pdf-upload-viewer">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="my-4"
      />
      <button onClick={() => addField('Signature')}>Add Signature</button>
      <button onClick={() => addField('Date')}>Add Date</button>
      <button onClick={saveDocument}>Save PDF</button>

      <div className="pdf-container" style={{ position: 'relative' }}>
        {pdfFile ? (
          <Worker
            workerUrl={`https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js`}
          >
            <Viewer fileUrl={pdfFile} plugins={[defaultLayoutPluginInstance]} />
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
                    left: 0,
                    top: 0,
                    border: '1px dashed #000',
                    padding: '5px',
                    cursor: 'move',
                    backgroundColor: '#f9f9f9',
                    zIndex: 10,
                  }}
                >
                  {field.type === 'Signature' ? (
                    <SignatureField
                      onSign={(sign) => {
                        const updatedFields = [...fields];
                        updatedFields[index] = { ...field, content: sign };
                        setFields(updatedFields);
                      }}
                    />
                  ) : (
                    <span>{field.content}</span>
                  )}
                </div>
              </Draggable>
            ))}
          </Worker>
        ) : (
          <p>Please upload a PDF to view it.</p>
        )}
      </div>
    </div>
  );
};

export default PDFUploadViewer;
