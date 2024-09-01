import { FormFieldType } from "@/types";
import { useState, useCallback, RefObject, useEffect } from "react";

interface FormField {
  x: number;
  y: number;
  width: number;
  height: number;
  key: string;
}

interface SelectionBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function useFormFields(
  scale: number,
  pdfContentRef: RefObject<HTMLDivElement>,
  currentPage: number // 添加 currentPage 参数
) {
  const [formFields, setFormFields] = useState<FormFieldType[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);
  const [selectedField, setSelectedField] = useState<number | null>(null);
  const [isSelectingDisabled, setIsSelectingDisabled] = useState(false);

  // 新增：处理窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      // 在这里可以添加调整表单字段位置的逻辑
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!pdfContentRef.current) return;
      const rect = pdfContentRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;
      setIsDrawing(true);
      setStartPoint({ x, y });
      setSelectionBox({ x, y, width: 0, height: 0 });
      setSelectedField(null);
      setIsSelectingDisabled(true);
      e.preventDefault();
    },
    [scale, pdfContentRef]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDrawing || !startPoint || !pdfContentRef.current) return;
      const rect = pdfContentRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;
      setSelectionBox({
        x: Math.min(startPoint.x, x),
        y: Math.min(startPoint.y, y),
        width: Math.abs(x - startPoint.x),
        height: Math.abs(y - startPoint.y),
      });
    },
    [isDrawing, startPoint, scale, pdfContentRef]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (!isDrawing || !startPoint || !pdfContentRef.current) return;
      setIsDrawing(false);
      const rect = pdfContentRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;
      const width = Math.abs(x - startPoint.x);
      const height = Math.abs(y - startPoint.y);

      if (width > 10 / scale && height > 10 / scale) {
        const newField = {
          x: Math.min(startPoint.x, x),
          y: Math.min(startPoint.y, y),
          width: width,
          height: height,
          key: `Field ${formFields.length + 1}`,
          page: currentPage, // 添加当前页码
        };
        setFormFields((prevFields) => [...prevFields, newField]);
        setSelectedField(formFields.length);
      }
      setSelectionBox(null);
      setStartPoint(null);
      setIsSelectingDisabled(false);
    },
    [
      isDrawing,
      startPoint,
      scale,
      formFields.length,
      pdfContentRef,
      currentPage,
    ] // 添加 currentPage 依赖
  );

  const handleKeySet = useCallback((index: number, key: string) => {
    setFormFields((prevFields) => {
      const updatedFields = prevFields.map((field, i) =>
        i === index ? { ...field, key: key || field.key } : field
      );
      return updatedFields;
    });
    setSelectedField(null);
  }, []);

  const handleFieldDelete = useCallback((index: number) => {
    setFormFields((prevFields) => {
      const updatedFields = prevFields.filter((_, i) => i !== index);
      // 重新编号剩余的字段
      return updatedFields.map((field, i) => ({
        ...field,
        key: field.key.startsWith("Field ") ? `Field ${i + 1}` : field.key,
      }));
    });
    setSelectedField(null);
  }, []);

  const handleFieldEdit = useCallback((index: number) => {
    setSelectedField(index);
  }, []);

  // 新增：更新表单字段位置
  const updateFieldPosition = useCallback(
    (index: number, newPosition: Partial<FormField>) => {
      setFormFields((prevFields) =>
        prevFields.map((field, i) =>
          i === index ? { ...field, ...newPosition } : field
        )
      );
    },
    []
  );

  // 新增：批量更新表单字段
  const updateAllFields = useCallback((updatedFields: FormFieldType[]) => {
    setFormFields(updatedFields);
  }, []);

  // 新增：清除所有表单字段
  const clearAllFields = useCallback(() => {
    setFormFields([]);
    setSelectedField(null);
  }, []);

  return {
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
    updateFieldPosition,
    updateAllFields,
    clearAllFields,
  };
}
