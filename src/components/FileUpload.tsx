import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Upload } from "lucide-react";

interface FileUploadProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileName: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, fileName }) => {
  return (
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
      <div className="text-xs text-muted-foreground truncate" title={fileName}>
        {fileName}
      </div>
    </div>
  );
};

export default FileUpload;
