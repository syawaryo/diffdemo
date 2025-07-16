// PDFViewer.tsx
'use client';
import { useState, useMemo, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Eye } from 'lucide-react';
import DiffOverlay from './DiffOverlay';
import { useDiff } from '@/contexts/DiffContext';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// PDFjsワーカーの設定
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type ViewMode = '2025-only' | '2024-only' | 'both';

interface PDFDocument {
  file: string;
  year: string;
  numPages: number | null;
  pageNumber: number;
}

export default function PDFViewer() {
  const [viewMode, setViewMode] = useState<ViewMode>('both');
  const [scale, setScale] = useState(0.9);
  const { registerPageChanger } = useDiff();
  
  const [documents, setDocuments] = useState<{
    '2025': PDFDocument;
    '2024': PDFDocument;
  }>({
    '2025': { file: 'pdfs/2025.pdf', year: '2025', numPages: null, pageNumber: 1 },
    '2024': { file: 'pdfs/2024.pdf', year: '2024', numPages: null, pageNumber: 1 }
  });

  const options = useMemo(
    () => ({
      cMapUrl: '/cmaps/',
      cMapPacked: true,
      standardFontDataUrl: '/standard_fonts/',
    }),
    [],
  );

  // ページ変更関数をコンテキストに登録
  useEffect(() => {
    registerPageChanger((page: number) => {
      setDocuments(prev => ({
        ...prev,
        '2025': { ...prev['2025'], pageNumber: page },
        '2024': { ...prev['2024'], pageNumber: page }
      }));
    });
  }, [registerPageChanger]);

  const onDocumentLoadSuccess = (year: '2025' | '2024') => ({ numPages }: { numPages: number }) => {
    setDocuments(prev => ({
      ...prev,
      [year]: { ...prev[year], numPages }
    }));
  };

  const previousPage = () => {
    setDocuments(prev => {
      const currentPage = prev['2025'].pageNumber;
      const newPage = currentPage <= 1 ? 1 : currentPage - 1;
      
      return {
        '2025': { ...prev['2025'], pageNumber: newPage },
        '2024': { ...prev['2024'], pageNumber: newPage }
      };
    });
  };

  const nextPage = () => {
    setDocuments(prev => {
      const currentPage = prev['2025'].pageNumber;
      const maxPage = Math.max(prev['2025'].numPages || 1, prev['2024'].numPages || 1);
      const newPage = currentPage >= maxPage ? maxPage : currentPage + 1;
      
      return {
        '2025': { ...prev['2025'], pageNumber: newPage },
        '2024': { ...prev['2024'], pageNumber: newPage }
      };
    });
  };

  const zoomIn = () => {
    setScale(scale + 0.1);
  };

  const zoomOut = () => {
    setScale(scale > 0.3 ? scale - 0.1 : 0.3);
  };

  // 現在のページ数を取得（表示モードに応じて）
  const getCurrentPageInfo = () => {
    if (viewMode === '2025-only') return { current: documents['2025'].pageNumber, max: documents['2025'].numPages };
    if (viewMode === '2024-only') return { current: documents['2024'].pageNumber, max: documents['2024'].numPages };
    return { current: documents['2025'].pageNumber, max: Math.max(documents['2025'].numPages || 0, documents['2024'].numPages || 0) };
  };

  const pageInfo = getCurrentPageInfo();

  // 表示するドキュメントを決定
  const getDocumentsToRender = () => {
    switch (viewMode) {
      case '2025-only':
        return [documents['2025']];
      case '2024-only':
        return [documents['2024']];
      case 'both':
        return [documents['2025'], documents['2024']];
      default:
        return [documents['2025'], documents['2024']];
    }
  };

  const documentsToRender = getDocumentsToRender();

  return (
    <div className="h-full flex flex-col bg-white">
      {/* ツールバー */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* 表示モード選択 */}
          <div className="flex items-center space-x-1">
            <Eye size={16} className="text-gray-600" />
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as ViewMode)}
              className="px-2 py-1 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="both">両方表示</option>
              <option value="2025-only">2025年のみ</option>
              <option value="2024-only">2024年のみ</option>
            </select>
          </div>

          {/* ページナビゲーション */}
          <div className="flex items-center space-x-1">
            <button
              onClick={previousPage}
              disabled={pageInfo.current <= 1}
              className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="flex items-center space-x-2 px-2 py-1 bg-white rounded-md border border-gray-200 text-xs">
              <span className="font-medium text-gray-700">
                {pageInfo.current}
              </span>
              <span className="text-gray-500">/</span>
              <span className="text-gray-500">
                {pageInfo.max || '-'}
              </span>
            </div>
            
            <button
              onClick={nextPage}
              disabled={pageInfo.current >= (pageInfo.max || 1)}
              className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* ズームコントロール */}
        <div className="flex items-center space-x-1">
          <button
            onClick={zoomOut}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
          >
            <ZoomOut size={16} />
          </button>
          
          <div className="px-2 py-1 bg-white rounded-md border border-gray-200 min-w-[60px] text-center">
            <span className="text-xs font-medium text-gray-700">
              {Math.round(scale * 100)}%
            </span>
          </div>
          
          <button
            onClick={zoomIn}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
          >
            <ZoomIn size={16} />
          </button>
        </div>
      </div>

      {/* PDFビューエリア */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <div className={`flex ${viewMode === 'both' ? 'space-x-4' : 'justify-center'}`}>
            {documentsToRender.map((doc) => (
              <div key={doc.year} className="flex-shrink-0">
                {viewMode === 'both' && (
                  <div className="text-center mb-2">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {doc.year}年
                    </span>
                  </div>
                )}
                <Document
                  file={doc.file}
                  onLoadSuccess={onDocumentLoadSuccess(doc.year as '2025' | '2024')}
                  loading={
                    <div className="flex items-center justify-center py-20">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="text-gray-600">PDFを読み込んでいます...</p>
                      </div>
                    </div>
                  }
                  error={
                    <div className="flex items-center justify-center py-20">
                      <div className="text-center">
                        <p className="text-red-600 font-medium">PDFの読み込みに失敗しました</p>
                        <p className="text-gray-500 text-sm mt-1">
                          {doc.file} が存在するか確認してください
                        </p>
                      </div>
                    </div>
                  }
                  options={options}
                >
                  <div className="relative shadow-lg rounded-lg overflow-hidden">
                    <Page
                      pageNumber={doc.pageNumber}
                      scale={scale}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      className="z-0"
                    />
                    {/* DiffOverlayを追加（2025年の場合のみ） */}
                    {doc.year === '2025' && (
                      <DiffOverlay page={doc.pageNumber} scale={scale} />
                    )}
                  </div>
                </Document>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}