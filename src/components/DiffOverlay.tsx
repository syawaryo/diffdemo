'use client';
import { diffBoxes } from '@/data/diffMap';
import { guidelineHighlights } from '@/data/guidelineMap';
import { useDiff } from '@/contexts/DiffContext';
import React from 'react';

type Props = { 
  page: number; 
  scale: number;
};

function DiffOverlay({ page, scale }: Props) {
  const { activeId, setActiveId, showGuidelineForId, setShowGuidelineForId } = useDiff();
  const boxes = diffBoxes.filter(b => b.page === page);

  const handleBoxClick = (boxId: string) => {
    setActiveId(boxId);
    
    // ガイドラインビューアーが開いている場合のみ、ページを切り替える
    if (showGuidelineForId) {
      const guidelineHighlight = guidelineHighlights.find(h => h.diffId === boxId);
      if (guidelineHighlight) {
        // 同じIDで新しいページに切り替え
        setShowGuidelineForId(boxId, guidelineHighlight.page);
      }
    }
  };

  return (
    <>
      {boxes.map(b => (
        <div
          key={b.id}
          style={{
            position: 'absolute',
            left: b.x * scale, 
            top: b.y * scale, 
            width: b.w * scale, 
            height: b.h * scale,
            border: activeId === b.id 
              ? '3px solid #3b82f6' 
              : '2px solid #06b6d4',
            background: activeId === b.id
              ? 'rgba(59, 130, 246, 0.15)' 
              : 'rgba(6, 182, 212, 0.08)',
            borderRadius: '8px',
            boxShadow: activeId === b.id
              ? '0 0 0 1px rgba(59, 130, 246, 0.3), 0 8px 25px -5px rgba(59, 130, 246, 0.25)'
              : '0 2px 8px -2px rgba(6, 182, 212, 0.2), 0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            animation: activeId === b.id ? 'pulse 1.5s ease-in-out' : 'none',
          }}
          className="cursor-pointer group hover:scale-105 transform transition-transform duration-200"
          onClick={() => handleBoxClick(b.id)}
        >
          <span 
            className="absolute z-20 left-0 top-0 text-xs font-bold text-white px-2 py-1 rounded-tl-lg rounded-br-lg shadow-sm"
            style={{
              backgroundColor: activeId === b.id ? '#3b82f6' : '#0891b2',
              fontSize: `${Math.max(10, 12 * scale)}px`,
              transform: 'translate(-1px, -1px)',
              transition: 'background-color 0.2s ease-in-out',
            }}
          >
            {b.id}
          </span>
          
          {/* ホバー時の詳細情報 */}
          <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-gray-900 text-white text-xs p-2 rounded-b-lg shadow-xl">
              <div className="truncate">{b.summary}</div>
            </div>
          </div>
        </div>
      ))}
      
      {/* CSSアニメーション */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.3), 0 8px 25px -5px rgba(59, 130, 246, 0.25);
          }
          50% { 
            transform: scale(1.03);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4), 0 12px 30px -5px rgba(59, 130, 246, 0.35);
          }
        }
      `}</style>
    </>
  );
}

export default React.memo(DiffOverlay);