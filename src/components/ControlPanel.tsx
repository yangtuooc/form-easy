import React from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Download, Trash2 } from "lucide-react";
import FileUpload from "./FileUpload";

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
  const handleScaleChange = (value: number[]) => {
    setScale(value[0]);
  };

  return (
    <div className="space-y-4 p-4">
      <FileUpload onFileChange={onFileChange} fileName={fileName} />

      <div>
        <h3 className="text-sm font-medium mb-2">缩放</h3>
        <Slider
          min={0.5}
          max={3}
          step={0.1}
          value={[scale]}
          onValueChange={handleScaleChange}
        />
        <div className="mt-1 text-xs text-muted-foreground">
          {scale.toFixed(1)}x
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">操作</h3>
        <div className="space-y-2">
          <Button
            onClick={onSaveAndExport}
            disabled={!fileName || fileName === "未选择文件" || !hasFields}
            className="w-full"
            size="sm"
          >
            <Download className="mr-2 h-4 w-4" />
            导出
          </Button>
          <Button
            variant="destructive"
            onClick={onClearFields}
            disabled={!fileName || fileName === "未选择文件" || !hasFields}
            className="w-full"
            size="sm"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            清除字段
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
