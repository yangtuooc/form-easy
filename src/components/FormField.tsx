import React, { useState, useEffect, useRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { X } from "lucide-react";

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
      onKeySet(localKey || fieldKey);
    }
  };

  const handleBlur = () => {
    onKeySet(localKey || fieldKey);
  };

  const handleDoubleClick = () => {
    onEdit();
  };

  const scaledFontSize = Math.max(12, 12 * scale);

  return (
    <div
      className={`absolute border-2 ${
        isEditing
          ? "bg-purple-300 bg-opacity-50 border-purple-500"
          : "bg-green-300 bg-opacity-50 border-green-500"
      } flex flex-col justify-center items-center overflow-hidden shadow-md`}
      style={{
        left: `${x * scale}px`,
        top: `${y * scale}px`,
        width: `${width * scale}px`,
        height: `${height * scale}px`,
        fontSize: `${scaledFontSize}px`,
      }}
      onDoubleClick={handleDoubleClick}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-0 right-0 opacity-0 hover:opacity-100 transition-opacity"
        onClick={onDelete}
        style={{ transform: `scale(${scale})`, transformOrigin: "top right" }}
      >
        <X className="h-4 w-4" />
      </Button>
      {isEditing ? (
        <Input
          ref={inputRef}
          type="text"
          value={localKey}
          onChange={handleKeyChange}
          onKeyDown={handleKeyPress}
          onBlur={handleBlur}
          className="w-full h-full text-center bg-transparent font-semibold text-black"
          style={{ fontSize: `${scaledFontSize}px` }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center font-semibold text-black">
          {fieldKey}
        </div>
      )}
    </div>
  );
};

export default FormField;
