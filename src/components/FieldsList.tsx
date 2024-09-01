import React from "react";
import { Button } from "./ui/button";
import { Pencil, Trash } from "lucide-react";
import { FormFieldType } from "@/types"; // 导入 FormField 类型

interface FieldsListProps {
  fields: FormFieldType[]; // 使用 FormField 类型
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

const FieldsList: React.FC<FieldsListProps> = ({
  fields,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="p-4">
      <h3 className="text-sm font-medium mb-2">表单字段</h3>
      <div className="space-y-2">
        {fields.length === 0 ? (
          <p className="text-xs text-muted-foreground italic text-center">
            还没有添加字段。在 PDF 上绘制一个框来添加字段。
          </p>
        ) : (
          <ul className="space-y-1">
            {fields.map((field, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-2 bg-muted rounded-md text-sm"
              >
                <div className="flex items-center space-x-2">
                  <span
                    className="truncate"
                    title={field.key || `字段 ${index + 1}`}
                  >
                    {field.key || `字段 ${index + 1}`}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    (第 {field.page} 页)
                  </span>
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onEdit(index)}
                    title="编辑字段"
                    className="h-7 w-7"
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete(index)}
                    title="删除字段"
                    className="h-7 w-7"
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FieldsList;
