import React, { useState, useEffect, useRef } from "react";
import "./FormField.css";

interface FormFieldProps {
  x: number;
  y: number;
  width: number;
  height: number;
  onKeySet: (key: string) => void;
  onDelete: () => void;
  onEdit: () => void;
  scale: number;
  isEditing: boolean;
  fieldKey: string;
}

const FormField: React.FC<FormFieldProps> = ({
  x,
  y,
  width,
  height,
  onKeySet,
  onDelete,
  onEdit,
  scale,
  isEditing,
  fieldKey,
}) => {
  const [localKey, setLocalKey] = useState(fieldKey);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalKey(fieldKey);
  }, [fieldKey]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalKey(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onKeySet(localKey || fieldKey); // 如果 localKey 为空，使用原来的 fieldKey
    }
  };

  const handleBlur = () => {
    onKeySet(localKey || fieldKey); // 在失去焦点时也保存更改
  };

  const handleDoubleClick = () => {
    onEdit();
  };

  return (
    <div
      className={`form-field ${isEditing ? "editing" : ""} ${
        fieldKey ? "set" : ""
      }`}
      style={{
        left: `${x * scale}px`,
        top: `${y * scale}px`,
        width: `${width * scale}px`,
        height: `${height * scale}px`,
        fontSize: `${Math.max(14, 14 / scale)}px`,
      }}
      onDoubleClick={handleDoubleClick}
    >
      <div className="delete-button" onClick={onDelete}>
        ×
      </div>
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={localKey}
          onChange={handleKeyChange}
          onKeyDown={handleKeyPress}
          onBlur={handleBlur}
          placeholder={fieldKey}
          style={{ fontSize: `${Math.max(12, 12 / scale)}px` }}
        />
      ) : (
        <div className="field-key">{fieldKey}</div>
      )}
    </div>
  );
};

export default FormField;
