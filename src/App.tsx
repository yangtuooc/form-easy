import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "./App.css";
import FormField from "./components/FormField";
import { useFormFields } from "./hooks/useFormFields";
import { handleSaveAndExport as saveAndExportPDF } from "./utils/pdfUtils"; // 重命名导入的函数
import ControlPanel from "./components/ControlPanel";
import FieldsList from "./components/FieldsList";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFPlaceholder = () => (
  <div className="pdf-placeholder">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
    <p>Select a PDF file to begin</p>
  </div>
);

function App() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState(1.5);
  const [fileName, setFileName] = useState<string>("No file chosen");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const pdfContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

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
    saveAndExportPDF(pdfFile, formFields); // 使用重命名后的函数
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className={`App ${isSelectingDisabled ? "no-select" : ""}`}>
      <header className="App-header">
        <h1>PDF Form Editor</h1>
        <div className="header-controls">
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          <button
            className="toggle-sidebar-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
          </button>
        </div>
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
          <div className="fields-list-wrapper">
            <FieldsList
              fields={formFields}
              onEdit={handleFieldEdit}
              onDelete={handleFieldDelete}
            />
          </div>
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
        </div>
      </main>
    </div>
  );
}

export default App;
