import React from "react";
import "./ControlPanel.css"; // 我们将创建一个新的 CSS 文件

interface ControlPanelProps {
  fileName: string;
  scale: number;
  setScale: (scale: number) => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveAndExport: () => void;
  onClearFields: () => void;
  hasFields: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  fileName,
  scale,
  setScale,
  onFileChange,
  onSaveAndExport,
  onClearFields,
  hasFields,
}) => {
  const handleScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScale(parseFloat(event.target.value));
  };

  return (
    <div className="control-panel">
      <div className="control-section">
        <h3>File</h3>
        <div className="file-input-wrapper">
          <button className="btn btn-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Upload PDF
          </button>
          <input type="file" onChange={onFileChange} accept=".pdf" />
        </div>
        <div className="file-name-display" title={fileName}>
          {fileName.length > 20 ? fileName.substring(0, 20) + "..." : fileName}
        </div>
      </div>

      <div className="control-section">
        <h3>Zoom</h3>
        <div className="scale-control">
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={scale}
            onChange={handleScaleChange}
          />
          <span>{scale.toFixed(1)}x</span>
        </div>
      </div>

      <div className="control-section">
        <h3>Actions</h3>
        <button
          className="btn btn-export"
          onClick={onSaveAndExport}
          disabled={!fileName || fileName === "No file chosen" || !hasFields}
          title={!hasFields ? "Add at least one form field" : ""}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Export
        </button>
        <button
          className="btn btn-danger"
          onClick={onClearFields}
          disabled={!fileName || fileName === "No file chosen" || !hasFields}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          Clear Fields
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
