import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, Maximize2, FileText, UploadCloud, ArrowRight, Info, Sparkles, Folder, Files, Image as ImageIcon } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useVerification } from '../context/VerificationContext';
import DemoCasesModal from './DemoCasesModal';

export default function EvidenceViewer({ clause, onOpenUpload }) {
  const { showToast } = useToast();
  const {
    uploadedFile,
    uploadedFiles,
    activeFileIndex,
    selectFileByIndex,
    isFolder,
    folderName,
    pdfObjectUrl,
    fileName,
    fileSizeKb,
    startVerificationWorkflow
  } = useVerification();

  const [zoom, setZoom] = useState(150);
  const [activePage, setActivePage] = useState(clause?.pageNumber || 1);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  React.useEffect(() => {
    if (clause?.pageNumber) {
      setActivePage(clause.pageNumber);
    }
  }, [clause]);

  // When clause changes, check if the clause has a specific documentFileName matching one of uploadedFiles
  React.useEffect(() => {
    if (clause?.documentFileName && uploadedFiles && uploadedFiles.length > 0) {
      const idx = uploadedFiles.findIndex(f => 
        f.name.toLowerCase() === clause.documentFileName.toLowerCase() ||
        clause.documentFileName.toLowerCase().includes(f.name.toLowerCase()) ||
        f.name.toLowerCase().includes(clause.documentFileName.toLowerCase())
      );
      if (idx !== -1 && idx !== activeFileIndex) {
        selectFileByIndex(idx);
      }
    }
  }, [clause]);

  const handleFilesChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArr = Array.from(e.target.files);
      startVerificationWorkflow(filesArr);
    }
  };

  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else if (onOpenUpload) {
      onOpenUpload();
    }
  };

  const isCurrentImage = fileName && !!fileName.match(/\.(png|jpe?g|webp|tiff|bmp)$/i);

  return (
    <>
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs flex flex-col h-full overflow-hidden font-sans">
        {/* Hidden File Input for Native File Picker */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFilesChange}
          multiple
          accept=".pdf,.docx,.xlsx,.jpg,.png,.jpeg,.webp"
          className="hidden"
        />

        {/* Top Controls Bar */}
        <div className="px-3.5 py-2.5 border-b border-slate-200 bg-white flex flex-col gap-2 shrink-0 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 truncate pr-2">
              <span className="font-bold text-slate-900 truncate text-[11px] uppercase tracking-wide flex items-center space-x-1.5">
                {isFolder ? <Folder className="w-3.5 h-3.5 text-amber-600" /> : <Files className="w-3.5 h-3.5 text-blue-600" />}
                <span>{isFolder ? (folderName ? `Folder: ${folderName}` : 'Document Package') : 'Evidence Viewer'}</span>
              </span>
              {uploadedFiles && uploadedFiles.length > 1 && (
                <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded border border-slate-200">
                  {uploadedFiles.length} files
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2 shrink-0 text-[11px]">
              <button
                onClick={() => setIsDemoModalOpen(true)}
                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded font-bold text-[11px] flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span>Try Sample Documents</span>
              </button>

              {pdfObjectUrl && !isCurrentImage ? (
                <>
                  <div className="hidden sm:block text-slate-500">
                    Page <strong className="text-slate-900 font-semibold">{activePage}</strong> of {clause?.totalPages || 1}
                  </div>

                  <div className="flex items-center space-x-1 border border-slate-200 rounded bg-slate-50 px-1 py-0.5">
                    <button
                      onClick={() => setZoom(prev => Math.max(60, prev - 20))}
                      className="p-0.5 hover:bg-slate-200 rounded text-slate-600 font-bold"
                    >
                      -
                    </button>
                    <span className="px-1 font-medium text-slate-700 text-[10px] min-w-[32px] text-center">{zoom}%</span>
                    <button
                      onClick={() => setZoom(prev => Math.min(200, prev + 20))}
                      className="p-0.5 hover:bg-slate-200 rounded text-slate-600 font-bold"
                    >
                      +
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* Multi-file switcher selector bar if package/folder contains > 1 document */}
          {uploadedFiles && uploadedFiles.length > 1 && (
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-[11px]">
              <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0">Package Items:</span>
              {uploadedFiles.map((fileItem, idx) => {
                const isActive = idx === activeFileIndex;
                const isImg = fileItem.isImage || !!fileItem.name.match(/\.(png|jpe?g|webp|tiff|bmp)$/i);
                return (
                  <button
                    key={idx}
                    onClick={() => selectFileByIndex(idx)}
                    className={`py-1 px-2.5 rounded border text-[11px] font-semibold flex items-center space-x-1 shrink-0 transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {isImg ? <ImageIcon className="w-3 h-3 text-emerald-400" /> : <FileText className="w-3 h-3 text-blue-300" />}
                    <span className="truncate max-w-[150px]">{fileItem.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Main Document Area */}
        <div className="flex-1 bg-[#F8FAFC] p-3 overflow-auto flex items-center justify-center relative">
          {pdfObjectUrl ? (
            <div className="w-full h-full min-h-[500px] flex flex-col items-center">
              {isCurrentImage ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-lg border border-slate-300 p-4 shadow-md">
                  <img
                    src={pdfObjectUrl}
                    alt={fileName}
                    className="max-h-[540px] max-w-full object-contain rounded border border-slate-200 shadow-2xs"
                  />
                  <div className="mt-2 text-center text-[11px] text-slate-500 font-medium">
                    Image Evidence File: <span className="font-bold text-slate-800">{fileName}</span>
                  </div>
                </div>
              ) : (
                <iframe
                  src={pdfObjectUrl.startsWith('blob:') ? `${pdfObjectUrl}#page=${activePage}` : pdfObjectUrl}
                  title="Uploaded PDF Document"
                  className="w-full h-full min-h-[520px] rounded-lg border border-slate-300 shadow-md bg-white"
                />
              )}
            </div>
          ) : (
            /* Empty State Dropzone with "Try Sample Documents" option */
            <div className="w-full h-full min-h-[480px] bg-white border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-2xs">
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4 shadow-2xs">
                <UploadCloud className="w-10 h-10 stroke-[1.5]" />
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">
                No Folder or File Selected
              </h3>
              <p className="text-xs text-slate-500 mb-6 max-w-sm leading-relaxed">
                Upload your bid submission folder / files or choose sample documents to run AI verification.
              </p>

              {/* Action Options inside Document Reader Component */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleSelectFile}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-md hover:shadow-lg flex items-center space-x-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Folder or Files</span>
                </button>

                <button
                  onClick={() => setIsDemoModalOpen(true)}
                  className="px-5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-lg shadow-2xs hover:shadow-md flex items-center space-x-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                  <span>Try Sample Documents</span>
                </button>
              </div>

              <div className="bg-blue-50/70 border border-blue-100 rounded-lg p-3 text-left max-w-md mt-8 text-[11px] text-slate-600 flex items-start space-x-2.5">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold text-slate-900">
                    Supports Folder & Multi-File packages: <span className="font-normal text-slate-600">PDFs, GST/PAN certs, Images</span>
                  </p>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Accepts entire folders or multiple document files, performing cross-document verification and forgery analysis.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <DemoCasesModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </>
  );
}
