import React from "react";
import { Button } from "./ui/button";
import { Download, Trash2 } from "lucide-react";

interface OperationsControlProps {
  onSaveAndExport: () => void;
  onClearFields: () => void;
  isDisabled: boolean;
}

const OperationsControl: React.FC<OperationsControlProps> = ({
  onSaveAndExport,
  onClearFields,
  isDisabled,
}) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">操作</h3>
      <div className="space-y-2">
        <Button
          onClick={onSaveAndExport}
          disabled={isDisabled}
          className="w-full"
          size="sm"
        >
          <Download className="mr-2 h-4 w-4" />
          导出
        </Button>
        <Button
          variant="destructive"
          onClick={onClearFields}
          disabled={isDisabled}
          className="w-full"
          size="sm"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          清除字段
        </Button>
      </div>
    </div>
  );
};

export default OperationsControl;
