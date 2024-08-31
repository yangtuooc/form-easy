import React, { createContext, useState, useContext } from "react";
import { FormField } from "../types";

interface AppContextType {
  pdfFile: File | ArrayBuffer | null;
  setPdfFile: (file: File | ArrayBuffer | null) => void;
  formFields: FormField[];
  setFormFields: (fields: FormField[]) => void;
  scale: number;
  setScale: (scale: number) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pdfFile, setPdfFile] = useState<File | ArrayBuffer | null>(null);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [scale, setScale] = useState(1.5);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <AppContext.Provider
      value={{
        pdfFile,
        setPdfFile,
        formFields,
        setFormFields,
        scale,
        setScale,
        isSidebarOpen,
        setIsSidebarOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
