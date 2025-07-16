export type GuidelineHighlight = {
  diffId: string;
  page: number;
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  annotation: string;
};

// 注意: diffMap.tsと同じハイフン文字を使用（D‑01のような特殊なハイフン）
export const guidelineHighlights: GuidelineHighlight[] = [
  {
    diffId: 'D‑01',
    page: 1,
    x: 50,
    y: 100,
    w: 400,
    h: 30,
    text: '割引率は最大10%までとする',
    annotation: '割引率を5%に引き下げてください。収益性改善のためです。'
  },
  {
    diffId: 'D‑02',
    page: 1,
    x: 50,
    y: 200,
    w: 380,
    h: 35,
    text: '製品説明は詳細かつ明確に記載すること',
    annotation: '△△の説明文が不足しています。詳細な説明を追加してください。'
  },
  {
    diffId: 'D‑03',
    page: 1,
    x: 50,
    y: 300,
    w: 350,
    h: 30,
    text: '価格設定は市場動向を考慮して決定',
    annotation: '□□の価格が高すぎます。900円に変更してください。'
  },
  {
    diffId: 'D‑04',
    page: 2,
    x: 50,
    y: 150,
    w: 420,
    h: 40,
    text: '画像は高解像度で統一感のあるものを使用',
    annotation: '××の画像が古いガイドラインのものです。最新版に差し替えてください。'
  },
  {
    diffId: 'D‑05',
    page: 1,
    x: 50,
    y: 400,
    w: 300,
    h: 30,
    text: 'タイトルは簡潔で分かりやすく',
    annotation: '◎◎のタイトルが分かりにくいです。より直感的な表現に変更してください。'
  },
  {
    diffId: 'D‑06',
    page: 2,
    x: 50,
    y: 250,
    w: 410,
    h: 35,
    text: 'フォントサイズは可読性を重視して設定',
    annotation: '△△のフォントサイズが小さすぎます。視認性向上のため大きくしてください。'
  },
  {
    diffId: 'D‑07',
    page: 2,
    x: 50,
    y: 350,
    w: 390,
    h: 30,
    text: 'リンクは最新のURLを維持すること',
    annotation: '□□のリンクが古いドメインを指しています。新ドメインに更新してください。'
  },
  {
    diffId: 'D‑08',
    page: 1,
    x: 50,
    y: 500,
    w: 360,
    h: 35,
    text: '色彩は企業カラーに準拠すること',
    annotation: '××の色が旧ブランドカラーです。新しいカラーコードに変更してください。'
  },
  {
    diffId: 'D‑09',
    page: 2,
    x: 50,
    y: 450,
    w: 400,
    h: 30,
    text: '説明文は簡潔で分かりやすく記載',
    annotation: '◎◎に説明が不足しています。ユーザー向けの説明を追加してください。'
  },
  {
    diffId: 'D‑10',
    page: 3,
    x: 50,
    y: 100,
    w: 420,
    h: 40,
    text: 'レイアウトは視認性を重視した構成にすること',
    annotation: '〇〇のレイアウトが複雑すぎます。より見やすい配置に変更してください。'
  },
  {
    diffId: 'D‑11',
    page: 3,
    x: 50,
    y: 217,
    w: 380,
    h: 15,
    text: '不要な画像は削除し、シンプルな構成を維持',
    annotation: '△△に不要な画像があります。ページ速度改善のため削除してください。'
  },
  {
    diffId: 'D‑12',
    page: 3,
    x: 50,
    y: 300,
    w: 400,
    h: 35,
    text: 'テキストは最新の情報に更新すること',
    annotation: '□□のテキストが古い情報です。最新の製品仕様に更新してください。'
  },
  {
    diffId: 'D‑13',
    page: 3,
    x: 50,
    y: 400,
    w: 390,
    h: 30,
    text: 'フォントは統一されたものを使用',
    annotation: '××のフォントが規定外です。指定のフォントファミリーに統一してください。'
  },
  {
    diffId: 'D‑14',
    page: 3,
    x: 50,
    y: 500,
    w: 420,
    h: 35,
    text: 'リンクは定期的に確認し、最新の状態を保つ',
    annotation: '◎◎のリンクが切れています。有効なURLに更新してください。'
  },
  {
    diffId: 'D‑15',
    page: 4,
    x: 50,
    y: 100,
    w: 380,
    h: 30,
    text: '色の変更は企業イメージを考慮して行う',
    annotation: '〇〇の色の視認性が低いです。コントラストを高めて調整してください。'
  }
];