import React, { useRef } from 'react';
import { Upload, FileText, MonitorPlay } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndUpload(e.target.files[0]);
    }
  };

  const validateAndUpload = (file: File) => {
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isPPTX = file.name.toLowerCase().endsWith('.pptx') || 
                   file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation';

    if (isPDF || isPPTX) {
      onFileSelect(file);
    } else {
      alert("Please upload a supported file type: PDF (.pdf) or PowerPoint (.pptx)");
    }
  };

  // Technical Styling
  const containerClasses = disabled
    ? 'border-slate-800 bg-slate-900/30 opacity-50 cursor-not-allowed'
    : 'border-slate-700 bg-slate-900/50 hover:bg-slate-800 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] cursor-pointer group';

  return (
    <div 
      className={`relative border-2 border-dashed rounded-lg h-64 flex flex-col items-center justify-center transition-all duration-300 ${containerClasses}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <input 
        type="file" 
        accept=".pdf, .pptx, application/pdf, application/vnd.openxmlformats-officedocument.presentationml.presentation" 
        className="hidden" 
        ref={inputRef} 
        onChange={handleChange}
        disabled={disabled}
      />
      
      {/* Corner Accents */}
      {!disabled && (
        <>
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-slate-600 group-hover:border-amber-500 transition-colors duration-300 rounded-tl-sm" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-slate-600 group-hover:border-amber-500 transition-colors duration-300 rounded-tr-sm" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-slate-600 group-hover:border-amber-500 transition-colors duration-300 rounded-bl-sm" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-slate-600 group-hover:border-amber-500 transition-colors duration-300 rounded-br-sm" />
        </>
      )}

      <div className="flex flex-col items-center gap-4 z-10">
        <div className={`p-4 rounded-full bg-slate-800 border border-slate-700 group-hover:border-amber-500/30 group-hover:bg-slate-800/80 transition-all duration-300`}>
          <Upload className={`w-8 h-8 text-slate-400 group-hover:text-amber-500 transition-colors duration-300`} />
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-200 group-hover:text-white mb-2 tracking-tight">
            Initiate Lesson Upload
          </h3>
          <p className="text-sm text-slate-500 group-hover:text-slate-400 font-mono">
            Drag & drop PDF manual or PPTX slides
          </p>
        </div>

        <div className="flex gap-3 mt-2">
            <span className="text-[10px] font-mono uppercase text-slate-400 bg-slate-800 border border-slate-700 px-3 py-1 rounded flex items-center gap-1.5">
                <FileText className="w-3 h-3 text-sky-500" /> PDF
            </span>
            <span className="text-[10px] font-mono uppercase text-slate-400 bg-slate-800 border border-slate-700 px-3 py-1 rounded flex items-center gap-1.5">
                <MonitorPlay className="w-3 h-3 text-orange-500" /> PPTX
            </span>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;