// src/app/page.tsx  （Server Component）
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Diff‑PDF Demo</h1>
      <p className="text-gray-700 mb-6">パンフレット差分のプレビュー・注釈付 PDF を生成します。</p>
      <Link
        href="/demo"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        デモを開く
      </Link>
    </main>
  );
}
