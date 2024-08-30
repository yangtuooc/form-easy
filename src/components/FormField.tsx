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
  fieldKey: string; // 重命名为 fieldKey
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
  const [localKey, setLocalKey] = useState(fieldKey || ""); // 确保初始值是字符串
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalKey(fieldKey || "");
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
      e.preventDefault(); // 防止表单提交
      onKeySet(localKey);
      console.log("Enter pressed, setting key:", localKey); // 添加日志
    }
  };

  const handleDoubleClick = () => {
    onEdit();
  };

  return (
    <div
      className={`form-field ${isEditing ? "editing" : ""} ${
        localKey ? "set" : ""
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
          placeholder="Enter field key"
          style={{ fontSize: `${Math.max(12, 12 / scale)}px` }}
        />
      ) : (
        <div className="field-key">{localKey ? `${localKey}` : "未设置"}</div>
      )}
    </div>
  );
};

export default FormField;
