import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { useState, useRef, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "./App.css";
import FormField from "./components/FormField";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function App() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [formFields, setFormFields] = useState<
    Array<{ x: number; y: number; width: number; height: number; key: string }>
  >([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [scale, setScale] = useState(1.5);
  const [selectionBox, setSelectionBox] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [selectedField, setSelectedField] = useState<number | null>(null);
  const [isSelectingDisabled, setIsSelectingDisabled] = useState(false);
  const pdfContentRef = useRef<HTMLDivElement>(null);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdfFile(file);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

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
      setIsSelectingDisabled(true); // 禁用文本选择
      e.preventDefault(); // 阻止默认的选择行为
    },
    [scale]
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
    [isDrawing, startPoint, scale]
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
          key: "",
        };
        setFormFields((prevFields) => [...prevFields, newField]);
        setSelectedField(formFields.length); // 设置新创建的字段为选中状态
      }
      setSelectionBox(null);
      setStartPoint(null);
      setIsSelectingDisabled(false); // 重新启用文本选择
    },
    [isDrawing, startPoint, scale, formFields.length]
  );

  const handleKeySet = (index: number, key: string) => {
    console.log("handleKeySet called with index:", index, "and key:", key);
    setFormFields((prevFields) => {
      const updatedFields = prevFields.map((field, i) =>
        i === index ? { ...field, key } : field
      );
      console.log("Updated fields:", updatedFields);
      return updatedFields;
    });
    setSelectedField(null); // 关闭编辑模式
  };

  const handleFieldDelete = (index: number) => {
    const updatedFields = formFields.filter((_, i) => i !== index);
    setFormFields(updatedFields);
    setSelectedField(null);
  };

  const handleFieldEdit = (index: number) => {
    setSelectedField(index);
  };

  const handleSaveAndExport = async () => {
    if (!pdfFile) return;
    const pdfBytes = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();
    const pages = pdfDoc.getPages();

    // 加载默认字体
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    formFields.forEach((field) => {
      const page = pages[0]; // 假设所有字段都在第一页，如果不是，需要确定正确的页面
      const { width, height } = page.getSize();

      const textField = form.createTextField(field.key);
      textField.addToPage(page, {
        x: field.x,
        y: height - field.y - field.height, // PDF 坐标系从底部开始，需要调整 y 坐标
        width: field.width,
        height: field.height,
        borderWidth: 1,
        borderColor: rgb(0, 0, 0),
      });

      // 设置字段属性
      textField.setFontSize(12);
      textField.setText(field.key); // 设置表单域的默认文本为 key

      // 使用 updateAppearances 方法来设置默认外观
      textField.updateAppearances(helveticaFont);
    });

    const pdfBytesWithForm = await pdfDoc.save();
    const blob = new Blob([pdfBytesWithForm], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "form_with_fields.pdf";
    link.click();
  };

  const handleScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScale(parseFloat(event.target.value));
  };

  return (
    <div className={`App ${isSelectingDisabled ? "no-select" : ""}`}>
      <header className="App-header">
        <h1>PDF Form Editor</h1>
      </header>
      <main className="App-main">
        <div className="control-panel">
          <input type="file" onChange={onFileChange} accept=".pdf" />
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
          <button onClick={handleSaveAndExport}>Save and Export</button>
        </div>
        <div className="pdf-container">
          <div
            ref={pdfContentRef}
            className="pdf-content"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {pdfFile && (
              <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(new Array(numPages), (el, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    scale={scale}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                ))}
              </Document>
            )}
            {selectionBox && (
              <div
                className="selection-box"
                style={{
                  position: "absolute",
                  left: `${selectionBox.x * scale}px`,
                  top: `${selectionBox.y * scale}px`,
                  width: `${selectionBox.width * scale}px`,
                  height: `${selectionBox.height * scale}px`,
                  border: "2px dashed blue",
                  backgroundColor: "rgba(0, 0, 255, 0.1)",
                  pointerEvents: "none",
                }}
              />
            )}
            {formFields.map((field, index) => (
              <FormField
                key={`form-field-${index}`}
                {...field}
                fieldKey={field.key} // 将 'key' 重命名为 'fieldKey'
                onKeySet={(newKey) => handleKeySet(index, newKey)}
                onDelete={() => handleFieldDelete(index)}
                onEdit={() => handleFieldEdit(index)}
                scale={scale}
                isEditing={selectedField === index}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
