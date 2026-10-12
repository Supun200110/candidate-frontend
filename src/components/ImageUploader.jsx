import React, { useRef, useState } from 'react';
import { FiUploadCloud, FiTrash2, FiImage, FiUser } from 'react-icons/fi';

export const ImageUploader = ({
  label,
  sublabel = "PNG, JPG, WEBP up to 5MB",
  file,
  previewUrl,
  onFileSelect,
  onRemove,
  iconType = "image",
  required = false,
  error = null
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateAndProcessFile = (selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      alert("Please upload a valid image file (JPEG, PNG, WEBP, SVG).");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("Image size exceeds 5MB limit. Please choose a smaller file.");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    onFileSelect(selectedFile, objectUrl);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    }
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="flex flex-col space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {file && (
          <span className="text-xs text-gray-400 font-mono">
            {formatFileSize(file.size)}
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
        onChange={handleInputChange}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative border-2 border-purple-200 rounded-xl p-3 bg-purple-50/20 flex items-center gap-4 transition-all">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-gray-200 bg-white flex-shrink-0 flex items-center justify-center shadow-sm">
            <img
              src={previewUrl}
              alt={label}
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {file ? file.name : "Uploaded Image"}
            </p>
            <p className="text-xs text-green-600 font-medium mt-0.5 flex items-center gap-1">
              ✓ Ready for upload to Supabase
            </p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-xs text-[#592c68] hover:text-[#462153] font-semibold underline underline-offset-2"
              >
                Change Image
              </button>
              <span className="text-gray-300">|</span>
              <button
                type="button"
                onClick={onRemove}
                className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
              >
                <FiTrash2 className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
            isDragging
              ? "border-[#592c68] bg-purple-50 scale-[1.01]"
              : "border-gray-300 hover:border-[#592c68] bg-gray-50/50 hover:bg-purple-50/30"
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-purple-100/70 text-[#592c68] flex items-center justify-center mb-2">
            {iconType === "user" ? (
              <FiUser className="w-6 h-6" />
            ) : iconType === "symbol" ? (
              <FiImage className="w-6 h-6" />
            ) : (
              <FiUploadCloud className="w-6 h-6" />
            )}
          </div>

          <p className="text-sm font-medium text-gray-700">
            <span className="text-[#592c68] font-bold">Click to browse</span> or drag & drop
          </p>
          <p className="text-xs text-gray-400 mt-1">{sublabel}</p>
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default ImageUploader;
