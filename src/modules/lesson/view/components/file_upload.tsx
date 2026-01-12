"use client";

import { useState } from "react";
import { Label } from "flowbite-react";
import { HiDocumentText } from "react-icons/hi";

interface FileUploadProps {
  onFileSelect: (file: File | null, url: string) => void;
  error?: string;
}

export default function FileUpload({ onFileSelect, error }: FileUploadProps) {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string>("");

  const validateAndSetFile = (file?: File) => {
    if (!file) {
      setFileError("No se seleccionó ningún archivo");
      setPdfFile(null);
      onFileSelect(null, "");
      return;
    }

    if (file.type !== "application/pdf") {
      setFileError("El archivo debe ser un PDF");
      setPdfFile(null);
      onFileSelect(null, "");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setFileError("El archivo no debe superar 5MB");
      setPdfFile(null);
      onFileSelect(null, "");
      return;
    }

    setPdfFile(file);
    setFileError("");
    // TODO: Aquí iría la lógica para subir el archivo al servidor
    // Por ahora generamos una URL temporal para la validación
    const tempUrl = `temp://pdf/${file.name}`;
    onFileSelect(file, tempUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    validateAndSetFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    validateAndSetFile(file);
  };

  const displayError = error || fileError;

  return (
    <div>
      <Label htmlFor="pdfFile" className="mb-2">
        Documento PDF
      </Label>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : pdfFile
            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
            : displayError
            ? "border-red-500 bg-red-50 dark:bg-red-900/20"
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
        }`}
      >
        <input
          type="file"
          id="pdfFile"
          accept=".pdf"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="pointer-events-none">
          <HiDocumentText
            className={`mx-auto h-12 w-12 mb-3 ${
              isDragging
                ? "text-blue-500"
                : pdfFile
                ? "text-green-500"
                : displayError
                ? "text-red-500"
                : "text-gray-400"
            }`}
          />
          {pdfFile ? (
            <>
              <p className="text-sm font-medium text-green-700 dark:text-green-400">
                ✓ Archivo seleccionado
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Haz clic o arrastra otro archivo para reemplazar
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isDragging
                  ? "Suelta el archivo aquí"
                  : "Arrastra y suelta un PDF aquí"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                o haz clic para seleccionar un archivo
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                PDF • Máx. 5MB
              </p>
            </>
          )}
          {displayError && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
              {displayError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
