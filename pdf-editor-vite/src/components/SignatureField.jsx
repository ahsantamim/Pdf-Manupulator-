// src/components/SignatureField.js
import React from 'react';

function SignatureField({ onSign }) {
  const handleSign = () => {
    onSign("User's Signature"); // Replace this with actual signature capture logic if needed
  };

  return (
    <div
      style={{
        padding: '5px',
        border: '1px solid #000',
        backgroundColor: '#f1f1f1',
        cursor: 'pointer',
      }}
      onClick={handleSign}
    >
      [Signature Placeholder]
    </div>
  );
}

export default SignatureField;
