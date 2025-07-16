'use client';
import { useState, useMemo, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X, FileText, Highlighter } from 'lucide-react';
import { guidelineHighlights } from '@/data/guidelineMap';
import { motion } from 'framer-motion';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useDiff } from '@/contexts/DiffContext';

// PDFjsワーカーの設定
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Props {
  diffId: string;
  onClose: () => void;
  initialPage?: number;
}

export default function GuidelinePDFViewer({ diffId, onClose, initialPage }: Props) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(0.8);
  const [pageRendered, setPageRendered] = useState(false);
  const { showGuidelinePage } = useDiff();
  const highlights = guidelineHighlights.filter(h => h.diffId === diffId);

  // 初期ページまたは最初のハイライトがあるページに移動
  useEffect(() => {
    if (initialPage) {
      setPageNumber(initialPage);
    } else if (highlights.length > 0) {
      setPageNumber(highlights[0].page);
    }
  }, [diffId, initialPage]);

    // showGuidelinePageが変更されたときにページを更新
    useEffect(() => {
    if (showGuidelinePage && showGuidelinePage !== pageNumber) {
        setPageNumber(showGuidelinePage);
    }
    }, [showGuidelinePage]);

  // ページが変更されたときにレンダリング状態をリセット
  useEffect(() => {
    setPageRendered(false);
  }, [pageNumber]);

  const options = useMemo(
    () => ({
      cMapUrl: '/cmaps/',
      cMapPacked: true,
      standardFontDataUrl: '/standard_fonts/',
    }),
    [],
  );

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const onPageRenderSuccess = () => {
    setPageRendered(true);
  };

  const previousPage = () => {
    setPageNumber(pageNumber <= 1 ? 1 : pageNumber - 1);
  };

  const nextPage = () => {
    setPageNumber(pageNumber >= (numPages || 1) ? (numPages || 1) : pageNumber + 1);
  };

  const zoomIn = () => {
    setScale(scale + 0.1);
  };

  const zoomOut = () => {
    setScale(scale > 0.3 ? scale - 0.1 : 0.3);
  };

  const currentPageHighlights = highlights.filter(h => h.page === pageNumber);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="h-full flex flex-col bg-white rounded-lg"
    >
      {/* ヘッダー */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText size={18} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">ガイドラインPDF</h3>
            <p className="text-xs text-gray-600">{diffId} に関連する規定</p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={20} className="text-gray-600" />
        </button>
      </div>

      {/* ツールバー */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={previousPage}
            disabled={pageNumber <= 1}
            className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="flex items-center space-x-2 px-2 py-1 bg-white rounded-md border border-gray-200 text-xs">
            <span className="font-medium text-gray-700">{pageNumber}</span>
            <span className="text-gray-500">/</span>
            <span className="text-gray-500">{numPages || '-'}</span>
          </div>
          
          <button
            onClick={nextPage}
            disabled={pageNumber >= (numPages || 1)}
            className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>

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

      {/* PDF表示エリア */}
      <div className="flex-1 overflow-auto bg-gray-50 p-4">
        <Document
          file="/pdfs/boshubunsyo_guideline.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center py-10">
              <div className="flex flex-col items-center space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 text-sm">ガイドラインを読み込んでいます...</p>
              </div>
            </div>
          }
          error={
            <div className="flex items-center justify-center py-10">
              <div className="text-center">
                <p className="text-red-600 font-medium">PDFの読み込みに失敗しました</p>
                <p className="text-gray-500 text-sm mt-1">
                  ガイドラインPDFが存在するか確認してください
                </p>
              </div>
            </div>
          }
          options={options}
        >
          <div className="relative shadow-xl rounded-lg overflow-hidden mx-auto" style={{ width: 'fit-content' }}>
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              onRenderSuccess={onPageRenderSuccess}
            />
            
            {/* ハイライトオーバーレイ */}
            {pageRendered && currentPageHighlights.map((highlight, index) => (
              <motion.div
                key={`${highlight.diffId}-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                style={{
                  position: 'absolute',
                  left: highlight.x * scale,
                  top: highlight.y * scale,
                  width: highlight.w * scale,
                  height: highlight.h * scale,
                }}
                className="pointer-events-none"
              >
                {/* ハイライト背景 */}
                <div 
                  className="absolute inset-0 bg-yellow-300 opacity-40 rounded"
                  style={{
                    boxShadow: '0 0 0 2px rgba(251, 191, 36, 0.3)'
                  }}
                />
                
                {/* ハイライトアイコン */}
                <div className="absolute -top-2 -left-2 bg-yellow-500 rounded-full p-1 shadow-lg">
                  <Highlighter size={12} className="text-white" />
                </div>
              </motion.div>
            ))}
          </div>
        </Document>
      </div>
    </motion.div>
  );
}