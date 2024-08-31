import React, { useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useAppContext } from "../contexts/AppContext";
import { useFormFields } from "../hooks/useFormFields";
import FormField from "./FormField";

// 设置 PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer: React.FC = () => {
  const { pdfFile, scale } = useAppContext();
  const [numPages, setNumPages] = useState<number>(1);
  const pdfContentRef = useRef<HTMLDivElement>(null);
  const {
    formFields,
    selectionBox,
    selectedField,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleKeySet,
    handleFieldDelete,
    handleFieldEdit,
  } = useFormFields(scale, pdfContentRef);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    console.log(`Document loaded with ${numPages} page(s)`);
  };

  return (
    <div className="pdf-container">
      <div
        ref={pdfContentRef}
        className="pdf-content"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {pdfFile ? (
          <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => console.error("Error loading PDF:", error)}
          >
            {Array.from(new Array(numPages), (_, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            ))}
          </Document>
        ) : (
          <div className="pdf-placeholder">
            <p>Select a PDF file to begin</p>
          </div>
        )}
        {selectionBox && (
          <div
            className="selection-box"
            style={{
              position: "absolute",
              left: `${selectionBox.x * scale}px`,
              top: `${selectionBox.y * scale}px`,
              width: `${selectionBox.width * scale}px`,
              height: `${selectionBox.height * scale}px`,
            }}
          />
        )}
        {formFields.map((field, index) => (
          <FormField
            key={`form-field-${index}`}
            x={field.x}
            y={field.y}
            width={field.width}
            height={field.height}
            fieldKey={field.key}
            onKeySet={(newKey) => handleKeySet(index, newKey)}
            onDelete={() => handleFieldDelete(index)}
            onEdit={() => handleFieldEdit(index)}
            scale={scale}
            isEditing={selectedField === index}
          />
        ))}
      </div>
    </div>
  );
};

export default PDFViewer;
