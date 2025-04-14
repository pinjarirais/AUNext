'use client'
import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { z } from "zod";

// Validation Schema (Same as before)
const fileSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  phone: z.string().regex(/^\d{10}$/, { message: "Phone Number should be exactly 10 digits." }),
  email: z.string().email({ message: "Invalid email format" }),
  role_id: z.number().positive({ message: "Role ID must be a positive number" }),
  aus_user_id: z.union([z.number().positive(), z.literal(0), z.null(), z.undefined()]).optional(),
  pancard_number: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, { message: "Invalid PAN Card format" }),
  card_number: z.string().regex(/^\d{16}$/, { message: "Card Number should be exactly 16 digits." }),
  pin: z.string().regex(/^\d{6}$/, { message: "PIN should be exactly 6 digits." }),
  cvv: z.string().regex(/^\d{3}$/, { message: "CVV should be exactly 3 digits." }),
  ch_user_id: z.number().positive({ message: "ch_user_id must be a positive number" }),
});

const requiredHeaders = [
  "name", "phone", "email", "role_id", "aus_user_id",
  "pancard_number", "card_number", "pin", "cvv", "ch_user_id",
];

function ExcelUploader({token}) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files?.[0];
    const allowedExtensions = [".xlsx", ".xls"];
    const fileExtension = selectedFile?.name.slice(selectedFile.name.lastIndexOf("."));

    if (!selectedFile) {
      return setErrors(["No file selected."]);
    }
    if (!allowedExtensions.includes(fileExtension)) {
      return setErrors(["Invalid file type. Please upload an Excel file."]);
    }

    setFile(selectedFile);
    setErrors([]);
  };

  const parseExcelFile = (binaryStr) => {
    const workbook = XLSX.read(binaryStr, { type: "binary" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(sheet);
  };

  const validateHeaders = (data) => {
    const fileHeaders = Object.keys(data[0]).map((h) => h.toLowerCase());
    const missingHeaders = requiredHeaders.filter((header) => !fileHeaders.includes(header));
    if (missingHeaders.length > 0) {
      throw new Error(`Missing columns: ${missingHeaders.join(", ")}`);
    }
  };

  const validateData = (data) => {
    const validationErrors = [];
    const validatedData = data.map((row, index) => {
      try {
        return fileSchema.parse({
          name: row.name,
          phone: row.phone?.toString(),
          email: row.email,
          role_id: Number(row.role_id),
          aus_user_id: row.aus_user_id !== undefined && row.aus_user_id !== null
            ? Number(row.aus_user_id)
            : undefined,
          pancard_number: row.pancard_number,
          card_number: row.card_number?.toString(),
          pin: row.pin?.toString(),
          cvv: row.cvv?.toString(),
          ch_user_id: Number(row.ch_user_id),
        });
      } catch (err) {
        validationErrors.push(`Row ${index + 2}: ${err.errors.map(e => e.message).join(", ")}`);
        return null;
      }
    }).filter(Boolean);

    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join("\n"));
    }

    return validatedData;
  };

  const handleUpload = async () => {
    if (!file) return setErrors(["No file selected for upload."]);
  
    setLoading(true);
    setErrors([]);
  
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const binaryStr = e.target?.result;
        const data = parseExcelFile(binaryStr);
  
        if (data.length === 0) {
          throw new Error("The uploaded file is empty.");
        }
  
        // Validate headers and data
        validateHeaders(data);
        validateData(data);
  
        const formData = new FormData();
        formData.append("file", file);
  
        // Make the POST request with Authorization header
        const response = await fetch("http://localhost:8081/api/cardholders/upload-excel", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`, // Include the token in the Authorization header
            // Do not set Content-Type when using FormData, browser will handle it
          },
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error("Failed to upload the file.");
        }
  
        // Handle success
        alert("File uploaded successfully!");
        resetUploader();
      } catch (error) {
        console.error("Upload error:", error);
        setErrors(error.message.split("\n"));
      } finally {
        setLoading(false);
      }
    };
  
    reader.readAsBinaryString(file);
  };
  

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8081/api/cardholders/download-empty-excel", {
        headers: {
          "Authorization": `Bearer ${token}`, // Include the token in the Authorization header
        },
      });

      if (!response.ok) {
        throw new Error("Failed to download the file.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Download error:", error);
      setErrors(["Failed to download the file. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  const resetUploader = () => {
    setFile(null);
    setErrors([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-4 w-[90vw] mx-auto my-3 text-center">
      <input
        type="file"
        ref={fileInputRef}
        accept=".xlsx, .xls"
        onChange={handleFileSelect}
        className="mt-3 border p-2 rounded"
      />
      {file && <p className="mt-2 text-green-600">Selected: {file.name}</p>}

      <div className="mt-4 flex justify-center gap-4">
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className={`py-2 px-4 rounded-lg transition ${loading ? "bg-gray-400" : "bg-[#6436d7] hover:bg-[#502bb5] text-white"}`}
        >
          {loading ? "Processing..." : "Upload"}
        </button>
        <button
          onClick={handleDownload}
          disabled={loading}
          className={`py-2 px-4 rounded-lg transition ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700 text-white"}`}
        >
          {loading ? "Downloading..." : "Download"}
        </button>
      </div>

      {errors.length > 0 && (
        <div className="mt-4 text-red-600 border border-red-400 p-3 rounded bg-red-100 text-left max-w-xl mx-auto" aria-live="polite">
          <strong>Errors:</strong>
          <ul className="mt-2 list-disc pl-5">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ExcelUploader;
