# React 学習プロジェクト

`totonou` リポジトリ内の、React 学習用ディレクトリです。CLI 本体とは独立しています。

最初の題材は、よくない `useEffect` fetch を改善しながら、クリーンアップ関数の使い方を学ぶことです。

## なぜ Vite から作っているか

React 公式は本番アプリにフレームワーク（Next.js など）を勧めています。一方で「基本を学ぶならスクラッチでもよい」とも書いており、その案内では Vite の `react-ts` テンプレートが例示されています。

このディレクトリは学習用なので、公式のスクラッチ案内に合わせて次で作成しています。

```sh
npm create vite@latest react-learning -- --template react-ts
```

出典: [Build a React app from Scratch](https://react.dev/learn/build-a-react-app-from-scratch)

## 動かし方

```sh
cd react-learning
npm install
npm run dev
```

## このレッスンで学ぶこと

画面の題材は、React 公式ドキュメント「Fix fetching inside an Effect」と同じです。

1. Alice / Bob / Taylor を選ぶと、その人の bio を `fetchBio` 相当の遅延付き関数で取ります。
2. Bob だけ 2000ms、Alice と Taylor は 200ms で返ります。
3. よくない例では、Bob を選んですぐ Taylor を選ぶと、Taylor の表示があとから Bob に上書きされます。
4. 改善例では、クリーンアップ関数で `ignore = true` にし、古い応答では `setBio` しません。
5. `AbortController` でリクエスト自体を中断する例も置いています。公式は「abort だけでは不十分で、`ignore` の方が確実」と書いています。

開発中は React Strict Mode が setup → cleanup → setup をもう一度行います。欠落したクリーンアップを見つけるための動作で、本番ではこの余分なサイクルは走りません。

## 1次ソース

- [Synchronizing with Effects / Fetching data](https://react.dev/learn/synchronizing-with-effects#fetching-data)
- [Synchronizing with Effects / Fix fetching inside an Effect](https://react.dev/learn/synchronizing-with-effects#fix-fetching-inside-an-effect)
- [useEffect / Fetching data with Effects](https://react.dev/reference/react/useEffect#fetching-data-with-effects)
- [Creating a React App](https://react.dev/learn/creating-a-react-app)
- [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [MDN: AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)
