import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, Maximize2, FileText, UploadCloud, ArrowRight, Info, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useVerification } from '../context/VerificationContext';
import DemoCasesModal from './DemoCasesModal';

export default function EvidenceViewer({ clause, onOpenUpload }) {
  const { showToast } = useToast();
  const { uploadedFile, pdfObjectUrl, fileName, fileSizeKb, startVerificationWorkflow } = useVerification();
  const [zoom, setZoom] = useState(150);
  const [activePage, setActivePage] = useState(clause?.pageNumber || 1);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  React.useEffect(() => {
    if (clause?.pageNumber) {
      setActivePage(clause.pageNumber);
    }
  }, [clause]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      startVerificationWorkflow(file);
    }
  };

  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else if (onOpenUpload) {
      onOpenUpload();
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs flex flex-col h-full overflow-hidden font-sans">
        {/* Hidden File Input for Native File Picker */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.docx,.xlsx,.jpg,.png"
          className="hidden"
        />

        {/* Top Controls Bar */}
        <div className="px-3.5 py-2.5 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 text-xs">
          <div className="flex items-center space-x-2 truncate pr-2">
            <span className="font-bold text-slate-900 truncate text-[11px] uppercase tracking-wide">
              DOCUMENT READER AND EVIDENCE
            </span>
            {fileName && (
              <span className="text-[10px] text-blue-600 font-mono bg-blue-50 px-2 py-0.5 rounded border border-blue-200 truncate">
                {fileName}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3 shrink-0 text-[11px] text-slate-500">
            {/* Try with Sample Documents Button in Top Bar */}
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded font-bold text-[11px] flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>Try with Sample Documents</span>
            </button>

            {pdfObjectUrl ? (
              <>
                <div>
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

                <button
                  onClick={() => showToast(`Expanded Document Evidence View`, 'info')}
                  className="p-1 hover:bg-slate-100 rounded text-slate-600 transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5 stroke-[1.8]" />
                </button>
              </>
            ) : null}
          </div>
        </div>

        {/* Main Document Area */}
        <div className="flex-1 bg-[#F8FAFC] p-4 overflow-auto flex items-center justify-center relative">
          {pdfObjectUrl ? (
            <div className="w-full h-full min-h-[500px] flex flex-col items-center">
              <iframe
                src={pdfObjectUrl.startsWith('blob:') ? `${pdfObjectUrl}#page=${activePage}` : pdfObjectUrl}
                title="Uploaded PDF Document"
                className="w-full h-full min-h-[520px] rounded-lg border border-slate-300 shadow-md bg-white"
              />
            </div>
          ) : (
            /* Empty State Dropzone with "Try with Sample Documents" option */
            <div className="w-full h-full min-h-[480px] bg-white border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-2xs">
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4 shadow-2xs">
                <UploadCloud className="w-10 h-10 stroke-[1.5]" />
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">
                No Document Uploaded
              </h3>
              <p className="text-xs text-slate-500 mb-6 max-w-sm leading-relaxed">
                Please upload a bid document or load a pre-configured synthetic sample case to start verification.
              </p>

              {/* Action Options inside Document Reader Component */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleSelectFile}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-md hover:shadow-lg flex items-center space-x-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Documents</span>
                </button>

                <button
                  onClick={() => setIsDemoModalOpen(true)}
                  className="px-5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-lg shadow-2xs hover:shadow-md flex items-center space-x-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                  <span>Try with Sample Documents</span>
                </button>
              </div>

              <div className="bg-blue-50/70 border border-blue-100 rounded-lg p-3 text-left max-w-md mt-10 text-[11px] text-slate-600 flex items-start space-x-2.5">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold text-slate-900">
                    Supported formats: <span className="font-normal text-slate-600">PDF, DOCX, XLSX, JPG, PNG (Max 25MB)</span>
                  </p>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Documents are automatically processed using OCR, cross-document entity matching, and AI forensics.
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
