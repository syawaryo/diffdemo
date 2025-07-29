export type DiffBox = {
  page: number;
  id: string;
  x: number; y: number; w: number; h: number;
  summary: string;
};

export const diffBoxes: DiffBox[] = [
  { page: 1, id: 'D‑01', x: 217, y: 594, w: 180, h: 30,
    summary: '4月12(火)~4月30日(水)が7月12(火)~7月30日(水)に変更' },
  { page: 1, id: 'D‑02', x: 420, y: 674, w:70, h: 30,
    summary: '17が追加' },
  { page: 2, id: 'D‑03', x: 195, y: 355, w: 120, h: 36,
    summary: '約1000種類が約1100種類に変更' },
  { page: 2, id: 'D‑04', x: 430, y: 330, w: 110, h: 46,
    summary: '20万円→25万円、10万円→15万円に変更' },
  { page: 2, id: 'D‑05', x: 430, y: 498, w: 110, h: 30,
    summary: '5万円→6万円に変更' },
  { page: 3, id: 'D‑06', x: 8, y: 465, w: 570, h: 70,
    summary: 'ご加入内容確認事項が変更' },
];
