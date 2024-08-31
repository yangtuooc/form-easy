import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { Upload, Download, Trash2 } from "lucide-react";

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
      <div>
        <h3 className="text-sm font-medium mb-2">文件</h3>
        <div className="flex items-center space-x-2 mb-2">
          <Button variant="outline" className="w-full" asChild>
            <label htmlFor="pdf-upload">
              <Upload className="mr-2 h-4 w-4" />
              上传 PDF
            </label>
          </Button>
          <Input
            id="pdf-upload"
            type="file"
            onChange={onFileChange}
            accept=".pdf"
            className="hidden"
          />
        </div>
        <div
          className="text-xs text-muted-foreground truncate"
          title={fileName}
        >
          {fileName}
        </div>
      </div>

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
