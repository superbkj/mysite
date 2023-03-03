/*
import React from 'react';
import PostDetails from './PostDetails';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
// whatwgのfetchはブラウザでしか使えないので、Jest (node) で使うにはpolyfillが必要。
// 古いブラウザーなどで足りない機能の穴を埋めるコードを、polyfill という風に呼ぶ
// WHATWG: 
// Web Hypertext Application Technology Working Group
// の頭文字をとった、Apple、Mozilla、Operaのブラウザベンダーによって設立されたグループ。
// HTML5を作成している。
import 'cross-fetch/polyfill';

test('renders post details', () => {
  const { container } = render(<PostDetails />);
  const div = container.querySelector(".post_details");

  screen.debug(div);

  expect(div).toHaveTextContent('Loading...');
});
*/
