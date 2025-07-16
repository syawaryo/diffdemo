'use client';
import { createContext, useContext, useState, ReactNode, useCallback, useRef } from 'react';
import { diffBoxes } from '@/data/diffMap';

type DiffCtx = {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  goToPage: (page: number) => void;
  registerPageChanger: (fn: (page: number) => void) => void;
  showGuidelineForId: string | null;
  showGuidelinePage: number | null;
  setShowGuidelineForId: (id: string | null, page?: number) => void;
};

const DiffContext = createContext<DiffCtx | null>(null);

export function DiffProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveIdState] = useState<string | null>(null);
  const [showGuidelineForId, setShowGuidelineForIdState] = useState<string | null>(null);
  const [showGuidelinePage, setShowGuidelinePage] = useState<number | null>(null);
  const pageChangerRef = useRef<((page: number) => void) | null>(null);

  const setActiveId = useCallback((id: string | null) => {
    setActiveIdState(id);
    
    // アクティブIDが変更されたときに、そのページに移動
    if (id && pageChangerRef.current) {
      const box = diffBoxes.find(b => b.id === id);
      if (box) {
        pageChangerRef.current(box.page);
      }
    }
  }, []);

  const goToPage = useCallback((page: number) => {
    if (pageChangerRef.current) {
      pageChangerRef.current(page);
    }
  }, []);

  const registerPageChanger = useCallback((fn: (page: number) => void) => {
    pageChangerRef.current = fn;
  }, []);

  const setShowGuidelineForId = useCallback((id: string | null, page?: number) => {
    setShowGuidelineForIdState(id);
    setShowGuidelinePage(page || null);
  }, []);

  return (
    <DiffContext.Provider value={{ 
      activeId, 
      setActiveId, 
      goToPage, 
      registerPageChanger,
      showGuidelineForId,
      showGuidelinePage,
      setShowGuidelineForId
    }}>
      {children}
    </DiffContext.Provider>
  );
}

export function useDiff() {
  const ctx = useContext(DiffContext);
  if (!ctx) throw new Error('useDiff must be inside DiffProvider');
  return ctx;
}