'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import DiffSummaryPanel from '@/components/DiffSummaryPanel';
import { DiffProvider } from '@/contexts/DiffContext';
import { diffBoxes } from '@/data/diffMap';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">PDFを読み込んでいます...</p>
      </div>
    </div>
  ),
});

export default function Demo() {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [panelWidth, setPanelWidth] = useState(30);
  const isResizing = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current || !containerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      const newWidth = ((containerWidth - e.clientX) / containerWidth) * 100;
      
      // 最小15%、最大80%に制限
      if (newWidth >= 15 && newWidth <= 80) {
        setPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <DiffProvider>
      <div ref={containerRef} className="h-screen bg-gray-50 flex">
        {/* PDFビューアー */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${isPanelOpen ? '' : 'mr-0'} min-w-0`}>
          <div className="flex-1 p-6 min-w-0">
            <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <PDFViewer isPanelOpen={isPanelOpen} />
            </div>
          </div>
        </div>

        {/* サマリーパネルコンテナ */}
        <div 
          className={`relative ${!isResizing.current ? 'transition-all duration-300' : ''} ${isPanelOpen ? '' : 'w-0'}`}
          style={{ width: isPanelOpen ? `${panelWidth}%` : '0' }}
        >
          {/* リサイズハンドル */}
          {isPanelOpen && (
            <div
              className="absolute left-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-400 hover:opacity-50 transition-colors z-30"
              onMouseDown={(e) => {
                e.preventDefault();
                isResizing.current = true;
                document.body.style.cursor = 'col-resize';
                document.body.style.userSelect = 'none';
              }}
            />
          )}
          {/* トグルボタン */}
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="absolute -left-10 top-1/2 transform -translate-y-1/2 z-20 bg-white border border-gray-200 rounded-l-lg shadow-md p-2 hover:bg-gray-50 transition-colors"
          >
            {isPanelOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>

          {/* サマリーパネル */}
          <div className={`h-full ${isPanelOpen ? 'p-6 pl-0' : ''} overflow-hidden`}>
            <div className={`h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${isPanelOpen ? '' : 'opacity-0'}`}>
              {isPanelOpen && (
                <div className="h-full p-6">
                  <DiffSummaryPanel boxes={diffBoxes} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DiffProvider>
  );
}