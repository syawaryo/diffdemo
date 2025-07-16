'use client';

import dynamic from 'next/dynamic';
import DiffSummaryPanel from '@/components/DiffSummaryPanel';
import { DiffProvider } from '@/contexts/DiffContext';
import { diffBoxes } from '@/data/diffMap';

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
  return (
    <DiffProvider>
      <div className="h-screen bg-gray-50 flex">
        {/* 左側: PDFビューアー - 6の比率 */}
        <div className="flex-[6] flex flex-col min-w-0">
          <div className="flex-1 p-6">
            <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200">
              <PDFViewer />
            </div>
          </div>
        </div>

        {/* 右側: 差分サマリーパネル - 4の比率 */}
        <div className="flex-[4] flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 p-6 overflow-hidden">
              <DiffSummaryPanel boxes={diffBoxes} />
            </div>
          </div>
        </div>
      </div>
    </DiffProvider>
  );
}