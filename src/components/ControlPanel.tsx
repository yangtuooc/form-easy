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
        <h3>File Operations</h3>
        <div className="file-input-wrapper">
          <button className="btn btn-primary">Choose PDF File</button>
          <input type="file" onChange={onFileChange} accept=".pdf" />
        </div>
        <div className="file-name-display">{fileName}</div>
      </div>

      <div className="control-section">
        <h3>Zoom Control</h3>
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
        <h3>Field Operations</h3>
        <button
          className="btn btn-secondary"
          onClick={onSaveAndExport}
          disabled={!fileName || fileName === "No file chosen" || !hasFields}
          title={!hasFields ? "Please add at least one form field" : ""}
        >
          Save and Export
        </button>
        <button
          className="btn btn-secondary"
          onClick={onClearFields}
          disabled={!fileName || fileName === "No file chosen" || !hasFields}
        >
          Clear All Fields
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
