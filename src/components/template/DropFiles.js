import React, { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Use local worker with import.meta.url
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const DropFiles = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [numPages, setNumPages] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (droppedFile) => {
    setError("");

    if (droppedFile.type !== "application/pdf") {
      setError("Please select a PDF file only.");
      return;
    }

    if (droppedFile.size > 50 * 1024 * 1024) {
      setError("File size must be less than 50MB.");
      return;
    }

    setFile(droppedFile);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onDocumentLoadError = (error) => {
    setError(`Error loading PDF: ${error.message}`);
  };

  const openFileExplorer = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
    setError("");
    setNumPages(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Styles
  const containerStyle = {
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto",
    padding: "24px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "16px",
    color: "#1f2937",
  };

  const dropZoneStyle = {
    border: dragActive ? "2px dashed #60a5fa" : "2px dashed #d1d5db",
    borderRadius: "8px",
    padding: "32px",
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: dragActive ? "#eff6ff" : "transparent",
    transition: "all 0.2s ease",
  };

  const hiddenInputStyle = {
    display: "none",
  };

  const iconStyle = {
    fontSize: "32px",
    marginBottom: "8px",
  };

  const textStyle = {
    color: "#6b7280",
    marginBottom: "8px",
  };

  const smallTextStyle = {
    fontSize: "14px",
    color: "#9ca3af",
  };

  const fileNameStyle = {
    fontWeight: "500",
    color: "#1f2937",
  };

  const fileSizeStyle = {
    fontSize: "14px",
    color: "#6b7280",
  };

  const removeButtonStyle = {
    marginTop: "8px",
    padding: "4px 12px",
    fontSize: "14px",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const errorStyle = {
    marginTop: "16px",
    padding: "12px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    borderRadius: "4px",
  };

  const pdfContainerStyle = {
    marginTop: "20px",
    maxHeight: "600px",
    overflowY: "auto",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "16px",
    backgroundColor: "#f9fafb",
  };

  const pageStyle = {
    marginBottom: "20px",
    textAlign: "center",
  };

  const pageNumberStyle = {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "8px",
    fontWeight: "500",
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>PDF File Upload (React-PDF)</h2>

      <div
        style={dropZoneStyle}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileExplorer}
      >
        <input
          ref={fileInputRef}
          type="file"
          style={hiddenInputStyle}
          accept=".pdf"
          onChange={handleChange}
        />

        {!file ? (
          <div>
            <div style={iconStyle}>📄</div>
            <p style={textStyle}>Drop your PDF file here or click to browse</p>
            <p style={smallTextStyle}>Max file size: 50MB</p>
          </div>
        ) : (
          <div>
            <div style={{ ...iconStyle, color: "#10b981" }}>✅</div>
            <p style={fileNameStyle}>{file.name}</p>
            <p style={fileSizeStyle}>
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <button
              style={removeButtonStyle}
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#fecaca")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#fef2f2")}
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      {file && (
        <div style={pdfContainerStyle}>
          <h3 style={{ ...titleStyle, fontSize: "16px", marginBottom: "16px" }}>
            PDF Pages {numPages && `(${numPages} total)`}
          </h3>

          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div style={{ textAlign: "center", padding: "20px" }}>
                Loading PDF...
              </div>
            }
          >
            {numPages &&
              Array.from(new Array(numPages), (el, index) => (
                <div key={`page_${index + 1}`} style={pageStyle}>
                  <div style={pageNumberStyle}>Page {index + 1}</div>
                  <Page
                    pageNumber={index + 1}
                    scale={1.5}
                    loading={<div>Loading page...</div>}
                  />
                </div>
              ))}
          </Document>
        </div>
      )}
    </div>
  );
};

export default DropFiles;
