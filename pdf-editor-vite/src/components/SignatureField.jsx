// // SignatureField.jsx
// import React, { forwardRef } from 'react';

// const SignatureField = forwardRef(({ onSign }, ref) => {
//   const handleSign = () => {
//     // Implement your signing logic here
//     const signedData = '/sig.png'; // Replace this with actual signed image URL
//     onSign(signedData);
//   };

//   return (
//     <div
//       ref={ref}
//       onClick={handleSign}
//       style={{
//         cursor: 'pointer',
//         border: '1px solid black',
//         padding: '10px',
//         backgroundColor: 'blue',
//         textAlign: 'center',
//       }}
//     >
//       Click to sign
//     </div>
//   );
// });

// export default SignatureField;
import React, { forwardRef } from 'react';

const SignatureField = forwardRef(({ onSign }, ref) => {
  const handleSign = () => {
    // Create a canvas for the signature
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 200; // Set width for signature
    canvas.height = 100; // Set height for signature

    // Draw the signature (customize this)
    ctx.fillStyle = '#000'; // Dark color for the signature
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Example background
    ctx.font = '30px Arial';
    ctx.fillStyle = 'white'; // Text color
    ctx.fillText('Signature', 20, 50); // Placeholder text for signature

    // Convert the canvas to a PNG data URL
    const signedData = canvas.toDataURL('image/png');
    console.log('Generated signature data:', signedData); // Debug log
    onSign(signedData); // Pass the data URL back to PDFUploadViewer
  };

  return (
    <div
      ref={ref}
      onClick={handleSign}
      style={{
        cursor: 'pointer',
        border: '1px solid #000',
        padding: '10px',
        backgroundColor: 'blue',
        textAlign: 'center',
      }}
    >
      Click to sign
    </div>
  );
});

export default SignatureField;
