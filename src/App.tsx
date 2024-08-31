import React, { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "./App.css";
import FormField from "./components/FormField";
import { useFormFields } from "./hooks/useFormFields";
import { handleSaveAndExport } from "./utils/pdfUtils";
import ControlPanel from "./components/ControlPanel";
import FieldsList from "./components/FieldsList";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFPlaceholder = () => (
  <div className="pdf-placeholder">
    <p>Please select a PDF file</p>
  </div>
);

function App() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState(1.5);
  const [fileName, setFileName] = useState<string>("No file chosen");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pdfContentRef = useRef<HTMLDivElement>(null);

  const {
    formFields,
    selectionBox,
    isSelectingDisabled,
    selectedField,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleKeySet,
    handleFieldDelete,
    handleFieldEdit,
    clearAllFields,
  } = useFormFields(scale, pdfContentRef);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdfFile(file);
      setFileName(file.name);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleSaveAndExport = () => {
    if (formFields.length === 0) {
      alert("Please add at least one form field before exporting.");
      return;
    }
    handleSaveAndExport(pdfFile, formFields);
  };

  return (
    <div className={`App ${isSelectingDisabled ? "no-select" : ""}`}>
      <header className="App-header">
        <h1>PDF Form Editor</h1>
        <button
          className="toggle-sidebar-btn"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
        </button>
      </header>
      <main className="App-main">
        <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
          <ControlPanel
            fileName={fileName}
            scale={scale}
            setScale={setScale}
            onFileChange={onFileChange}
            onSaveAndExport={handleSaveAndExport}
            onClearFields={clearAllFields}
            hasFields={formFields.length > 0}
          />
          <FieldsList
            fields={formFields}
            onEdit={handleFieldEdit}
            onDelete={handleFieldDelete}
          />
        </div>
        <div className={`pdf-editor ${isSidebarOpen ? "" : "full-width"}`}>
          <div className="pdf-container">
            <div
              ref={pdfContentRef}
              className="pdf-content"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              {pdfFile ? (
                <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
                  {Array.from(new Array(numPages), (el, index) => (
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
                <PDFPlaceholder />
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
                  {...field}
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
        </div>
      </main>
    </div>
  );
}

export default App;
