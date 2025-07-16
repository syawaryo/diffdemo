export type DiffBox = {
  page: number;
  id: string;
  x: number; y: number; w: number; h: number;
  summary: string;
};

export const diffBoxes: DiffBox[] = [
  { page: 1, id: 'D‑01', x: 120, y: 340, w: 180, h: 60,
    summary: '〇〇の割引率が 10%→5% に変更' },
  { page: 2, id: 'D‑02', x: 100, y: 200, w: 200, h: 80,
    summary: '△△の説明文が追加されました。' },
  { page: 3, id: 'D‑03', x: 50, y: 150, w: 300, h: 100,
    summary: '□□の価格が 1,000円→900円に変更' },
  { page: 4, id: 'D‑04', x: 200, y: 400, w: 150, h: 50,
    summary: '××の画像が差し替えられました。' },
  { page: 5, id: 'D‑05', x: 80, y: 300, w: 250, h: 70,
    summary: '◎◎のタイトルが変更されました。' },
  { page: 6, id: 'D‑06', x: 150, y: 250, w: 200, h: 90,
    summary: '△△のフォントサイズが変更されました。' },
  { page: 7, id: 'D‑07', x: 100, y: 350, w: 180, h: 60,
    summary: '□□のリンク先が変更されました。' },
  { page: 8, id: 'D‑08', x: 120, y: 400, w: 220, h: 80,
    summary: '××の色が変更されました。' },
  { page: 9, id: 'D‑09', x: 90, y: 300, w: 200, h: 70,
    summary: '◎◎の説明が追加されました。' },
  { page: 10, id: 'D‑10', x: 130, y: 250, w: 240, h: 90,
    summary: '〇〇のレイアウトが変更されました。' },
  { page: 11, id: 'D‑11', x: 110, y: 320, w: 210, h: 80,
    summary: '△△の画像が削除されました。' },
  { page: 12, id: 'D‑12', x: 140, y: 280, w: 230, h: 100,
    summary: '□□のテキストが変更されました。' },
  { page: 13, id: 'D‑13', x: 160, y: 300, w: 190, h: 70,
    summary: '××のフォントが変更されました。' },
  { page: 14, id: 'D‑14', x: 120, y: 350, w: 220, h: 80,
    summary: '◎◎のリンクが更新されました。' },
  { page: 15, id: 'D‑15', x: 130, y: 400, w: 200, h: 90,
    summary: '〇〇の色が変更されました。' 
  },
];
