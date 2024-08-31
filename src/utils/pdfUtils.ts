import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

interface FormField {
  x: number;
  y: number;
  width: number;
  height: number;
  key: string;
}

export async function handleSaveAndExport(
  pdfFile: File | null,
  formFields: FormField[]
) {
  if (!pdfFile) return;

  const pdfBytes = await pdfFile.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();
  const pages = pdfDoc.getPages();

  // 加载默认字体
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  formFields.forEach((field) => {
    const page = pages[0]; // 假设所有字段都在第一页，如果不是，需要确定正确的页面
    const { height } = page.getSize();

    const textField = form.createTextField(field.key);
    textField.addToPage(page, {
      x: field.x,
      y: height - field.y - field.height, // PDF 坐标系从底部开始需要调整 y 坐标
      width: field.width,
      height: field.height,
      borderWidth: 0,
      backgroundColor: rgb(1, 1, 1),
    });

    // 设置字段属性
    textField.setFontSize(12);
    textField.setText(field.key); // 设置表单域的默认文本为 key
    textField.enableReadOnly(); // 设置为只读

    // 使用 updateAppearances 方法来设置默认外观
    textField.updateAppearances(helveticaFont);
  });

  const pdfBytesWithForm = await pdfDoc.save();
  const blob = new Blob([pdfBytesWithForm], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "form_with_fields.pdf";
  link.click();
}
