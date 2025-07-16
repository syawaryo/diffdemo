'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useDiff } from '@/contexts/DiffContext';
import { DiffBox } from '@/data/diffMap';
import { guidelineHighlights } from '@/data/guidelineMap';
import { FileText, AlertCircle, ChevronDown, ChevronUp, Info } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const GuidelinePDFViewer = dynamic(() => import('./GuidelinePDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 text-sm">読み込み中...</p>
      </div>
    </div>
  ),
});

function DiffSummaryPanel({ boxes }: { boxes: DiffBox[] }) {
  const { activeId, setActiveId, showGuidelineForId, showGuidelinePage, setShowGuidelineForId } = useDiff();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<{ [key: string]: HTMLDivElement }>({});

  // アクティブなアイテムが変更されたときにスクロール
  useEffect(() => {
    if (activeId && itemRefs.current[activeId] && scrollContainerRef.current && !showGuidelineForId) {
      const timeoutId = setTimeout(() => {
        const activeElement = itemRefs.current[activeId];
        const container = scrollContainerRef.current;
        
        if (!activeElement || !container) return;
        
        const elementTop = activeElement.offsetTop;
        const elementHeight = activeElement.offsetHeight;
        const containerHeight = container.offsetHeight;
        
        const targetScrollTop = elementTop - (containerHeight / 2) + (elementHeight / 2);
        
        const maxScrollTop = container.scrollHeight - containerHeight;
        const finalScrollTop = Math.max(0, Math.min(targetScrollTop, maxScrollTop));
        
        container.scrollTo({
          top: finalScrollTop,
          behavior: 'smooth'
        });
      }, 350);
      
      return () => clearTimeout(timeoutId);
    }
  }, [activeId, showGuidelineForId]);

  const handleItemClick = (id: string) => {
    setActiveId(id);
  };

  const handleGuidelineClick = (id: string) => {
    const guidelineHighlight = guidelineHighlights.find(h => h.diffId === id);
    setShowGuidelineForId(id, guidelineHighlight?.page);
  };

  const handleCloseGuideline = () => {
    setShowGuidelineForId(null);
  };

  // ガイドラインビューアーが表示されている場合
  if (showGuidelineForId) {
    return (
      <div className="h-full">
        <GuidelinePDFViewer 
          diffId={showGuidelineForId} 
          onClose={handleCloseGuideline}
          initialPage={showGuidelinePage || undefined}
        />
      </div>
    );
  }

  // 通常の差分リスト表示
  return (
    <div className="flex flex-col h-full min-h-0 bg-white shadow-lg rounded-l-xl border border-gray-200">
      {/* ヘッダー */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText size={20} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              変更箇所サマリー
            </h2>
            <p className="text-sm text-gray-600">
              {boxes.length}件の変更が見つかりました
            </p>
          </div>
        </div>
      </div>

      {/* 変更リスト */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto py-8"
      >
        <div className="px-4 space-y-4">
          {boxes.length > 0 ? (
            boxes.map((box, index) => {
              const isActive = activeId === box.id;
              const guidelineInfo = guidelineHighlights.find(h => h.diffId === box.id);
              
              return (
                <motion.div
                  key={box.id}
                  ref={el => {
                    if (el) itemRefs.current[box.id] = el;
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1,
                    y: 0
                  }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                  onClick={() => handleItemClick(box.id)}
                  className="relative cursor-pointer transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* カード */}
                  <div className={`
                    p-4 rounded-xl border transition-all duration-300
                    ${isActive 
                      ? 'border-blue-500 bg-blue-50 shadow-lg' 
                      : 'border-gray-200 bg-white shadow-sm hover:shadow-md'
                    }
                  `}>
                    {/* アクティブインジケーター */}
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-12 bg-blue-500 rounded-r-full"
                      />
                    )}
                    
                    <div className="flex items-center space-x-3">
                      <div className={`
                        p-2 rounded-lg transition-all duration-300
                        ${isActive 
                          ? 'bg-blue-100 shadow-sm' 
                          : 'bg-gray-100'
                        }
                      `}>
                        <AlertCircle size={16} className={`
                          transition-colors duration-300
                          ${isActive ? 'text-blue-600' : 'text-gray-500'}
                        `} />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className={`
                          font-bold text-lg transition-colors duration-300
                          ${isActive ? 'text-blue-800' : 'text-gray-800'}
                        `}>
                          {box.id}
                        </h3>
                        
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            ページ {box.page}
                          </span>
                          
                          {!isActive && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex items-center text-xs text-gray-400"
                            >
                              <ChevronDown size={12} />
                              <span className="ml-1">詳細を見る</span>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* 展開されたサマリー（アクティブ時のみ） */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t border-gray-200"
                        >
                          <div className="flex items-start space-x-2">
                            <ChevronUp size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {box.summary}
                              </p>
                              
                              {/* ガイドライン注釈（スタイリング版） */}
                              {guidelineInfo && (
                                <motion.div
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.1 }}
                                  className="mt-2 bg-red-50 border border-red-200 rounded-lg p-2.5"
                                >
                                  <div className="flex items-start space-x-2">
                                    <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-red-700 leading-relaxed flex-1">
                                      {guidelineInfo.annotation}
                                    </p>
                                  </div>
                                </motion.div>
                              )}   
                              
                              <div className="mt-3 flex items-center space-x-3">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleGuidelineClick(box.id);
                                  }}
                                  className="text-xs text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors"
                                >
                                  ガイドラインPDFを確認
                                </button>
                                <button className="text-xs text-gray-500 hover:text-gray-700 font-medium">
                                  履歴を見る
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <FileText size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">変更箇所がありません</p>
              <p className="text-gray-500 text-sm mt-1">
                PDFに変更が検出されませんでした
              </p>
            </div>
          )}
        </div>
      </div>

      {/* フッター */}
      <div className="px-6 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>最終更新: 今すぐ</span>
          <div className="flex items-center space-x-2">
            {activeId && (
              <span className="text-blue-600 font-medium">
                {activeId} を表示中
              </span>
            )}
            <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
              すべて表示
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(DiffSummaryPanel);