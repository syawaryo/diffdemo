'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, Check, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type FileType = 'template' | 'check' | 'guideline';

interface UploadedFile {
  name: string;
  type: FileType;
  file: File;
}

export default function Home() {
  const router = useRouter();
  const [uploadedFiles, setUploadedFiles] = useState<Record<FileType, UploadedFile | null>>({
    template: null,
    check: null,
    guideline: null
  });
  const [isProcessing, setIsProcessing] = useState(false);
  
  // ファイル入力用のref
  const fileInputRefs = {
    template: useRef<HTMLInputElement>(null),
    check: useRef<HTMLInputElement>(null),
    guideline: useRef<HTMLInputElement>(null)
  };

  const fileLabels = {
    template: { label: '雛形PDF', description: '前年度の承認済みパンフレット' },
    check: { label: 'チェック対象PDF', description: '今年度の新しいパンフレット' },
    guideline: { label: 'ガイドラインPDF', description: '企業ガイドライン・規定書' }
  };

  const handleFileSelect = (type: FileType, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFiles(prev => ({
        ...prev,
        [type]: { name: file.name, type, file }
      }));
    }
  };

  const handleButtonClick = (type: FileType) => {
    fileInputRefs[type].current?.click();
  };

  const handleStartCheck = async () => {
    setIsProcessing(true);
    
    // デモ用の処理時間をシミュレート
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    router.push('/demo');
  };

  const allFilesUploaded = Object.values(uploadedFiles).every(file => file !== null);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          {/* ヘッダー */}
          <div className="mb-10">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              PDF差分チェックシステム
            </h1>
            <p className="text-gray-600">
              パンフレットの変更箇所を自動検出し、ガイドライン準拠を確認します
            </p>
          </div>

          {/* アップロードエリア */}
          <div className="space-y-3 mb-8">
            {(Object.keys(fileLabels) as FileType[]).map((type) => (
              <div
                key={type}
                className={`
                  border rounded-lg p-5 transition-colors bg-white
                  ${uploadedFiles[type] 
                    ? 'border-gray-300' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`
                      p-2 rounded-md
                      ${uploadedFiles[type] ? 'bg-green-50' : 'bg-gray-50'}
                    `}>
                      <FileText className={`w-5 h-5 ${
                        uploadedFiles[type] ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {fileLabels[type].label}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {fileLabels[type].description}
                      </p>
                      {uploadedFiles[type] && (
                        <p className="text-xs text-green-600 mt-1 flex items-center">
                          <Check className="w-3 h-3 mr-1" />
                          {uploadedFiles[type].name}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <input
                      ref={fileInputRefs[type]}
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileSelect(type, e)}
                      className="hidden"
                    />
                    {!uploadedFiles[type] && (
                      <button
                        onClick={() => handleButtonClick(type)}
                        className="flex items-center space-x-2 px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>選択</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* チェック開始ボタン */}
          <div className="flex justify-end">
            <button
              onClick={handleStartCheck}
              disabled={isProcessing}
              className={`
                flex items-center space-x-2 px-6 py-2.5 rounded-md text-sm font-medium transition-colors
                ${!isProcessing
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>処理中...</span>
                </>
              ) : (
                <>
                  <span>差分チェックを開始</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* 処理中のオーバーレイ */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50"
            >
              <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
                <div className="flex flex-col items-center space-y-4">
                  {/* シンプルなローディングアニメーション */}
                  <div className="flex space-x-1">
                    <motion.div
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                    <motion.div
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                    <motion.div
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      差分を検出しています
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}