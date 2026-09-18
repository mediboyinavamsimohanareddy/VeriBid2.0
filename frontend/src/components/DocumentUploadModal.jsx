import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, X, Sparkles, Folder, Files, Image as ImageIcon } from 'lucide-react';
import { uploadDocument } from '../services/api';
import { useVerification } from '../context/VerificationContext';
import { useToast } from '../context/ToastContext';
import DemoCasesModal from './DemoCasesModal';

export default function DocumentUploadModal({ caseId = "GEM/2024/9/19102", isOpen, onClose, onUploadComplete }) {
  const { showToast } = useToast();
  const { startVerificationWorkflow, isProcessing } = useVerification();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadMode, setUploadMode] = useState('files'); // 'files' | 'folder'
  const [folderName, setFolderName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleFilesSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArr = Array.from(e.target.files);
      const valid = filesArr.filter(f => {
        const name = f.name.toLowerCase();
        return name.endsWith('.pdf') || name.match(/\.(png|jpe?g|webp|tiff|bmp)$/i);
      });

      if (valid.length === 0) {
        showToast('Please select valid PDF or image documents.', 'error');
        return;
      }

      // Infer folder name if folder upload
      let detectedFolderName = '';
      if (e.target.files[0]?.webkitRelativePath) {
        const pathParts = e.target.files[0].webkitRelativePath.split('/');
        if (pathParts.length > 1) {
          detectedFolderName = pathParts[0];
        }
      }

      setSelectedFiles(valid);
      setFolderName(detectedFolderName);
      setStatus(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0 || isProcessing) return;

    setUploading(true);
    const countMsg = selectedFiles.length > 1 
      ? `Analyzing package of ${selectedFiles.length} file(s)...`
      : `Analyzing document ${selectedFiles[0].name}...`;
    setStatus(countMsg);

    const res = await uploadDocument(caseId, selectedFiles, folderName);

    setUploading(false);
    setStatus('Session Created! Triggering Live Verification Pipeline...');

    setTimeout(() => {
      startVerificationWorkflow(selectedFiles, res.analysis, caseId, folderName);
      if (onUploadComplete) onUploadComplete(res);
      onClose();
    }, 800);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn font-sans">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs uppercase tracking-wide">
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Select Verification Submission</span>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-4 text-xs">
            {/* Top Action Options: [ Upload Folder / Files ] [ Try with Sample Documents ] */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                className="py-2 px-3 bg-white text-slate-900 rounded font-bold shadow-2xs text-xs flex items-center justify-center space-x-1.5"
              >
                <Files className="w-3.5 h-3.5 text-blue-600" />
                <span>Upload Folder / Files</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsDemoModalOpen(true);
                }}
                className="py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded font-bold transition-colors text-xs flex items-center justify-center space-x-1.5 border border-blue-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                <span>Try Sample Documents</span>
              </button>
            </div>

            {/* Mode selector: Select Files vs Select Folder */}
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-2 rounded-lg">
              <span className="font-semibold text-slate-700 text-[11px]">Upload Type:</span>
              <div className="flex space-x-1">
                <button
                  type="button"
                  onClick={() => { setUploadMode('files'); setSelectedFiles([]); }}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center space-x-1 transition-all ${
                    uploadMode === 'files' ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  <Files className="w-3 h-3" />
                  <span>Select Files</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setUploadMode('folder'); setSelectedFiles([]); }}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center space-x-1 transition-all ${
                    uploadMode === 'folder' ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  <Folder className="w-3 h-3" />
                  <span>Select Folder</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-5 text-center hover:border-blue-500 transition-colors bg-slate-50">
                {uploadMode === 'files' ? (
                  <>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.png,.jpg,.jpeg,.webp,.tiff"
                      onChange={handleFilesSelect}
                      className="hidden"
                      id="files-upload"
                    />
                    <label htmlFor="files-upload" className="cursor-pointer space-y-2 block">
                      <Files className="w-8 h-8 text-blue-500 mx-auto" />
                      <div className="font-bold text-slate-800">
                        {selectedFiles.length > 0
                          ? `${selectedFiles.length} file(s) selected`
                          : 'Click to choose multiple PDF or image documents'}
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Select single file or multiple documents (PDFs, GST/PAN certs, Images, Orders)
                      </p>
                    </label>
                  </>
                ) : (
                  <>
                    <input
                      type="file"
                      directory=""
                      webkitdirectory=""
                      mozdirectory=""
                      onChange={handleFilesSelect}
                      className="hidden"
                      id="folder-upload"
                    />
                    <label htmlFor="folder-upload" className="cursor-pointer space-y-2 block">
                      <Folder className="w-8 h-8 text-amber-500 mx-auto" />
                      <div className="font-bold text-slate-800">
                        {selectedFiles.length > 0
                          ? `Folder "${folderName || 'Selected Folder'}" (${selectedFiles.length} files)`
                          : 'Click to select entire submission folder'}
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Upload entire directory containing all tender bid submission documents & certificates
                      </p>
                    </label>
                  </>
                )}
              </div>

              {/* Preview List of selected files */}
              {selectedFiles.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 max-h-36 overflow-y-auto space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between font-bold text-slate-700 border-b border-slate-200 pb-1">
                    <span>Selected Package Contents ({selectedFiles.length})</span>
                    {folderName && <span className="text-blue-600 font-mono text-[10px]">Folder: {folderName}</span>}
                  </div>
                  {selectedFiles.map((f, idx) => {
                    const isImg = !!f.name.match(/\.(png|jpe?g|webp|tiff|bmp)$/i);
                    return (
                      <div key={idx} className="flex items-center justify-between text-slate-600 bg-white p-1.5 rounded border border-slate-100">
                        <div className="flex items-center space-x-1.5 truncate pr-2">
                          {isImg ? <ImageIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                          <span className="truncate font-medium">{f.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">{(f.size/1024).toFixed(0)} KB</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {status && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded text-blue-900 font-semibold flex items-center space-x-2 text-[11px]">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin text-blue-600 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  <span>{status}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDemoModalOpen(true)}
                  className="py-1.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded text-xs font-bold flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Try Sample Documents</span>
                </button>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={selectedFiles.length === 0 || uploading || isProcessing}
                    className={`py-1.5 px-4 rounded text-xs font-bold text-white transition-all ${
                      selectedFiles.length > 0 && !uploading && !isProcessing ? 'bg-[#071328] hover:bg-slate-800 shadow-2xs' : 'bg-slate-300 cursor-not-allowed'
                    }`}
                  >
                    {isProcessing ? 'Verification Active...' : `Analyze ${selectedFiles.length > 0 ? selectedFiles.length + ' Item(s)' : ''}`}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <DemoCasesModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </>
  );
}
