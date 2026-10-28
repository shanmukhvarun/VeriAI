// ============================
// VeriAI — Document Verification Page
// ============================

import { useState, useCallback, useRef } from 'react';
import { useStore } from '../store';
import {
  Upload, FileText, CheckCircle2, XCircle, Clock, AlertTriangle,
  Eye, Trash2, RefreshCw, ChevronDown, Loader, ShieldCheck, Search,
  FileWarning, Hash, Calendar, Building, User
} from 'lucide-react';

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: string;
  type: string;
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
  processingStep: number;
  extractedText: string;
  extractedFields: { field: string; value: string }[];
  anomalies: string[];
  hash: string;
}

const processingSteps = [
  'File uploaded',
  'Document format assessed',
  'Text extraction (OCR/PDF)',
  'Field identification',
  'Mandatory fields checked',
  'Application field comparison',
  'Source verification check',
  'Anomaly evaluation',
  'Compliance rules assessed',
  'Report generated',
];

export default function DocumentVerification() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [showSample, setShowSample] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const applications = useStore((s) => s.applications);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const generateHash = async (file: File): Promise<string> => {
    try {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      return 'hash-' + Math.random().toString(36).slice(2);
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    // Real text extraction for text-based files
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      return await file.text();
    }
    // For PDFs, attempt basic text extraction
    if (file.type === 'application/pdf') {
      try {
        const text = await file.text();
        // Extract readable text from PDF binary
        const readable = text.replace(/[^\x20-\x7E\n]/g, ' ').replace(/\s+/g, ' ').trim();
        if (readable.length > 50) return readable.slice(0, 2000);
      } catch { /* fall through */ }
    }
    return '[Simulated] Text extraction would require Tesseract.js OCR or a PDF parsing library. In a production deployment, real OCR/PDF text extraction would be performed here.';
  };

  const processFile = useCallback(async (uploadedFile: UploadedFile) => {
    const stepDelay = (ms: number) => new Promise(r => setTimeout(r, ms));

    setFiles(prev => prev.map(f => f.id === uploadedFile.id ? { ...f, status: 'processing' as const, processingStep: 0 } : f));

    for (let i = 0; i < processingSteps.length; i++) {
      await stepDelay(400 + Math.random() * 300);
      setFiles(prev => prev.map(f => f.id === uploadedFile.id ? { ...f, processingStep: i + 1 } : f));
    }

    // Generate hash
    const hash = await generateHash(uploadedFile.file);

    // Extract text
    const extractedText = await extractTextFromFile(uploadedFile.file);

    // Generate demo extracted fields based on filename
    const nameLower = uploadedFile.name.toLowerCase();
    const extractedFields: { field: string; value: string }[] = [];
    const anomalies: string[] = [];

    if (nameLower.includes('eoa') || nameLower.includes('approval')) {
      extractedFields.push({ field: 'Document Type', value: 'Extension of Approval Certificate' });
      extractedFields.push({ field: 'Institution Name', value: 'Detected from document text' });
      extractedFields.push({ field: 'Academic Year', value: '2025-26 (extracted)' });
    } else if (nameLower.includes('naac') || nameLower.includes('accredit')) {
      extractedFields.push({ field: 'Document Type', value: 'Accreditation Certificate' });
      extractedFields.push({ field: 'Accrediting Body', value: 'NAAC (detected)' });
    } else if (nameLower.includes('nba')) {
      extractedFields.push({ field: 'Document Type', value: 'NBA Certificate' });
    } else {
      extractedFields.push({ field: 'Document Type', value: 'Supporting Document' });
    }

    extractedFields.push(
      { field: 'File Format', value: uploadedFile.type.toUpperCase() },
      { field: 'File Size', value: uploadedFile.size },
      { field: 'SHA-256 Hash', value: hash.slice(0, 32) + '...' },
      { field: 'Text Extracted', value: extractedText.length > 50 ? `${extractedText.length} characters` : 'Limited text found' },
    );

    // Check for duplicate hashes
    const existingHashes = files.filter(f => f.id !== uploadedFile.id).map(f => f.hash);
    if (existingHashes.includes(hash)) {
      anomalies.push('⚠ Duplicate file hash detected — this file may be identical to another uploaded document.');
    }

    if (uploadedFile.file.size < 1000) {
      anomalies.push('⚠ File size unusually small — verify document contains expected content.');
    }

    setFiles(prev => prev.map(f => f.id === uploadedFile.id ? {
      ...f, status: 'completed' as const, hash, extractedText, extractedFields, anomalies
    } : f));
  }, [files]);

  const handleFiles = useCallback(async (fileList: FileList | File[]) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map(file => ({
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      file,
      name: file.name,
      size: formatSize(file.size),
      type: file.type || 'unknown',
      status: 'uploaded' as const,
      processingStep: 0,
      extractedText: '',
      extractedFields: [],
      anomalies: [],
      hash: '',
    }));
    setFiles(prev => [...prev, ...newFiles]);
    for (const f of newFiles) {
      await processFile(f);
    }
  }, [processFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const removeFile = (id: string) => setFiles(prev => prev.filter(f => f.id !== id));

  const loadSampleCase = () => {
    // Load documents from Demo B (Horizon College)
    const horizonApp = applications.find(a => a.id === 'app-002');
    if (horizonApp) {
      setShowSample(true);
    }
  };

  const selected = files.find(f => f.id === selectedFile);

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Document Verification</h1>
          <p className="page-subtitle">Upload, process and verify institutional documents with OCR and automated analysis.</p>
        </div>
        <button className="btn btn-accent" onClick={loadSampleCase}>
          <FileText size={16} /> Load Sample Verification Case
        </button>
      </div>

      {showSample && (
        <div style={{ padding: 16, background: 'var(--color-info-bg)', border: '1px solid var(--color-info-border)', borderRadius: 10, marginBottom: 24, fontSize: 13 }}>
          <strong>Sample Case Loaded:</strong> View Horizon College of Engineering (app-002) in the{' '}
          <a href="/app/applications/app-002" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Application Detail</a> to see pre-processed documents with findings, anomalies, and extracted field comparisons.
        </div>
      )}

      {/* Upload Zone */}
      <div
        className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{ marginBottom: 24 }}
      >
        <div className="upload-zone-icon"><Upload size={28} /></div>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Drop documents here or click to browse</div>
        <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Supports PDF, PNG, JPEG files • Multiple uploads allowed</div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg"
          style={{ display: 'none' }}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {/* File List + Detail */}
      {files.length > 0 && (
        <div className="dashboard-grid dashboard-grid-2" style={{ alignItems: 'start' }}>
          {/* File List */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Uploaded Documents ({files.length})</span>
            </div>
            <div style={{ padding: 0 }}>
              {files.map(file => (
                <div
                  key={file.id}
                  style={{
                    padding: '14px 20px', borderBottom: '1px solid var(--color-border-light)', cursor: 'pointer',
                    background: selectedFile === file.id ? 'var(--color-bg-active)' : 'transparent',
                    transition: 'background var(--transition-fast)'
                  }}
                  onClick={() => setSelectedFile(file.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <FileText size={20} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }} className="truncate">{file.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{file.size} • {file.type}</div>
                    </div>
                    {file.status === 'processing' && <div className="processing-spinner" />}
                    {file.status === 'completed' && <CheckCircle2 size={18} style={{ color: 'var(--color-success)' }} />}
                    {file.status === 'failed' && <XCircle size={18} style={{ color: 'var(--color-danger)' }} />}
                    <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); removeFile(file.id); }} title="Remove">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {file.status === 'processing' && (
                    <div style={{ marginTop: 8 }}>
                      <div className="progress-bar" style={{ height: 4 }}>
                        <div className="progress-fill primary" style={{ width: `${(file.processingStep / processingSteps.length) * 100}%`, transition: 'width 0.3s' }} />
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--color-primary)', marginTop: 4 }}>
                        {processingSteps[file.processingStep - 1] || 'Starting...'}
                      </div>
                    </div>
                  )}
                  {file.anomalies.length > 0 && (
                    <div style={{ marginTop: 6 }}>
                      <span className="badge badge-warning" style={{ fontSize: 10 }}>
                        <AlertTriangle size={10} /> {file.anomalies.length} anomaly
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Detail Panel */}
          <div className="card" style={{ position: 'sticky', top: 80 }}>
            {selected ? (
              <>
                <div className="card-header">
                  <span className="card-title">Document Analysis</span>
                  <span className={`badge ${selected.status === 'completed' ? 'badge-success' : selected.status === 'processing' ? 'badge-info' : 'badge-neutral'}`}>
                    {selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
                  </span>
                </div>
                <div className="card-body">
                  {selected.status === 'processing' && (
                    <div className="processing-steps">
                      {processingSteps.map((step, i) => (
                        <div key={i} className={`processing-step ${i < selected.processingStep ? 'completed' : i === selected.processingStep ? 'active' : ''}`}>
                          {i < selected.processingStep ? <CheckCircle2 size={16} style={{ color: 'var(--color-success)' }} /> :
                           i === selected.processingStep ? <div className="processing-spinner" /> :
                           <Clock size={16} style={{ color: 'var(--color-text-tertiary)' }} />}
                          <span className="processing-step-label">{step}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {selected.status === 'completed' && (
                    <>
                      {/* Extracted Fields */}
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
                          Extracted Information
                        </div>
                        {selected.extractedFields.map((field, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--color-border-light)', fontSize: 13 }}>
                            <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>{field.field}</span>
                            <span style={{ fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{field.value}</span>
                          </div>
                        ))}
                      </div>

                      {/* Hash */}
                      <div style={{ padding: '10px 14px', background: 'var(--color-bg)', borderRadius: 8, marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <Hash size={14} style={{ color: 'var(--color-accent)' }} />
                          <span style={{ fontSize: 12, fontWeight: 600 }}>SHA-256 File Hash</span>
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, wordBreak: 'break-all', color: 'var(--color-text-secondary)' }}>
                          {selected.hash}
                        </div>
                      </div>

                      {/* Anomalies */}
                      {selected.anomalies.length > 0 && (
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-danger)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                            Anomalies Detected
                          </div>
                          {selected.anomalies.map((a, i) => (
                            <div key={i} style={{ padding: '10px 14px', background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger-border)', borderRadius: 8, fontSize: 13, marginBottom: 8 }}>
                              {a}
                            </div>
                          ))}
                        </div>
                      )}

                      {selected.anomalies.length === 0 && (
                        <div style={{ padding: '12px 14px', background: 'var(--color-success-bg)', border: '1px solid var(--color-success-border)', borderRadius: 8, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <CheckCircle2 size={16} style={{ color: 'var(--color-success)' }} />
                          No anomalies detected in preliminary analysis.
                        </div>
                      )}

                      {/* Extracted Text Preview */}
                      {selected.extractedText && (
                        <div style={{ marginTop: 16 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                            Extracted Text Preview
                          </div>
                          <div style={{ padding: '12px 14px', background: 'var(--color-bg)', borderRadius: 8, fontSize: 12, fontFamily: 'var(--font-mono)', maxHeight: 200, overflow: 'auto', whiteSpace: 'pre-wrap', color: 'var(--color-text-secondary)' }}>
                            {selected.extractedText.slice(0, 500)}{selected.extractedText.length > 500 ? '...' : ''}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="card-body">
                <div className="empty-state" style={{ padding: '40px 20px' }}>
                  <Eye size={32} style={{ color: 'var(--color-text-tertiary)', margin: '0 auto 12px' }} />
                  <div className="empty-state-title" style={{ fontSize: 14 }}>Select a document</div>
                  <div className="empty-state-text" style={{ fontSize: 13 }}>Click a document to view its analysis results.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Implementation Note */}
      <div style={{ marginTop: 24, padding: 16, background: 'var(--color-warning-bg)', border: '1px solid var(--color-warning-border)', borderRadius: 10, fontSize: 13, display: 'flex', gap: 10 }}>
        <AlertTriangle size={18} style={{ color: 'var(--color-warning)', flexShrink: 0, marginTop: 2 }} />
        <div>
          <strong>Implementation Note:</strong> This prototype performs real SHA-256 file hashing, basic text extraction for text files, and demonstrates the processing workflow. Full OCR (Tesseract.js) and advanced PDF parsing would be integrated in a production deployment. Extracted fields shown for uploaded files are partially simulated based on filename patterns.
        </div>
      </div>
    </div>
  );
}
