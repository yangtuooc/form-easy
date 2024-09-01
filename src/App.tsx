import React, { useState, useRef, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import FormField from "@/components/FormField";
import { useFormFields } from "@/hooks/useFormFields";
import { handleSaveAndExport as saveAndExportPDF } from "@/utils/pdfUtils";
import ControlPanel, { ControlPanelPlugin } from "@/components/ControlPanel";
import FieldsList from "@/components/FieldsList";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Moon, Sun, Laptop, FileText } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import ScaleControl from "@/components/ScaleControl";
import OperationsControl from "@/components/OperationsControl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface ThemeContextType {
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
}

// 创建主题 context 并导出
export const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined
);

const PDFPlaceholder = () => (
  <div className="flex flex-col items-center justify-center w-full h-full bg-muted text-muted-foreground rounded-lg border-2 border-dashed">
    <FileText className="w-16 h-16 mb-4" />
    <p className="text-lg font-medium">选择一个 PDF 文件开始</p>
  </div>
);

function App() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState(1.5);
  const [fileName, setFileName] = useState<string>("No file selected");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pdfContentRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  useEffect(() => {
    const options = {
      root: null, // 使用视口作为根
      rootMargin: "-50% 0px", // 当页面在视口中间时触发
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const pageNumber = Number(
            entry.target.getAttribute("data-page-number")
          );
          if (pageNumber && pageNumber !== currentPage) {
            handlePageChange(pageNumber);
          }
        }
      });
    }, options);

    pageRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => observer.disconnect();
  }, [handlePageChange, currentPage, numPages]);

  useEffect(() => {
    if (observerRef.current) {
      pageRefs.current.forEach((ref) => {
        if (ref) {
          observerRef.current?.observe(ref);
        }
      });
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [numPages]);

  const {
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
    clearAllFields,
  } = useFormFields(scale, pdfContentRef, currentPage); // 传入 currentPage

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdfFile(file);
      setFileName(file.name);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setCurrentPage(1); // 确保在文档加载成功后将当前页设置为第一页
  };

  const handleSaveAndExport = () => {
    if (formFields.length === 0) {
      alert("Please add at least one form field before exporting.");
      return;
    }
    saveAndExportPDF(pdfFile, formFields);
  };

  // 应用主题
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const plugins: ControlPanelPlugin[] = [
    {
      component: FileUpload,
      props: { onFileChange: onFileChange, fileName: fileName },
    },
    {
      component: ScaleControl,
      props: { scale, setScale },
    },
    {
      component: OperationsControl,
      props: {
        onSaveAndExport: handleSaveAndExport,
        onClearFields: clearAllFields,
        isDisabled: !pdfFile || formFields.length === 0,
      },
    },
  ];

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className="bg-background h-screen flex flex-col">
        <header className="flex items-center justify-between p-4 border-b">
          <h1 className="text-2xl font-bold">PDF Form Editor</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                {theme === "light" ? (
                  <Sun className="h-[1.2rem] w-[1.2rem]" />
                ) : theme === "dark" ? (
                  <Moon className="h-[1.2rem] w-[1.2rem]" />
                ) : (
                  <Laptop className="h-[1.2rem] w-[1.2rem]" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Laptop className="mr-2 h-4 w-4" />
                <span>System</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <aside className="w-80 flex-shrink-0 border-r flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <ControlPanel plugins={plugins} />
              <Separator className="my-4" />
              <FieldsList
                fields={formFields}
                onEdit={handleFieldEdit}
                onDelete={handleFieldDelete}
              />
            </div>
          </aside>
          <main className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-auto" id="pdf-container">
              <div className="min-w-full inline-block p-4">
                <div
                  ref={pdfContentRef}
                  className={`pdf-content relative cursor-crosshair ${
                    isSelectingDisabled ? "select-none" : ""
                  }`}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                >
                  {pdfFile ? (
                    <Document
                      file={pdfFile}
                      onLoadSuccess={onDocumentLoadSuccess}
                      className="shadow-xl"
                    >
                      {Array.from(new Array(numPages), (_, index) => (
                        <div
                          key={`page_${index + 1}`}
                          ref={(el) => (pageRefs.current[index] = el)}
                          data-page-number={index + 1}
                        >
                          <Page
                            pageNumber={index + 1}
                            scale={scale}
                            renderTextLayer={true}
                            renderAnnotationLayer={true}
                            className="mb-4"
                          />
                        </div>
                      ))}
                    </Document>
                  ) : (
                    <PDFPlaceholder />
                  )}
                  {selectionBox && (
                    <div
                      className="absolute border-2 border-blue-500 bg-blue-200 bg-opacity-40 pointer-events-none"
                      style={{
                        left: `${selectionBox.x * scale}px`,
                        top: `${selectionBox.y * scale}px`,
                        width: `${selectionBox.width * scale}px`,
                        height: `${selectionBox.height * scale}px`,
                      }}
                    />
                  )}
                  {formFields.map((field, index) => (
                    <FormField
                      key={`form-field-${index}`}
                      x={field.x}
                      y={field.y}
                      width={field.width}
                      height={field.height}
                      fieldKey={field.key}
                      onKeySet={(newKey) => handleKeySet(index, newKey)}
                      onDelete={() => handleFieldDelete(index)}
                      onEdit={() => handleFieldEdit(index)}
                      scale={scale}
                      isEditing={selectedField === index}
                    />
                  ))}
                </div>
              </div>
            </div>
            {pdfFile && (
              <div className="flex justify-center items-center p-2 border-t">
                <span className="text-sm">
                  第 {currentPage} 页，共 {numPages} 页
                </span>
              </div>
            )}
          </main>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
