import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Tools from './pages/Tools';
import About from './pages/About';
import Blog from './pages/Blog';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

import Stopwatch from './tools/Stopwatch/Stopwatch';
import Notepad from './tools/Notepad/Notepad';
import WordCounter from './tools/WordCounter/WordCounter';
import JsonFormatter from './tools/JsonFormatter/JsonFormatter';
import ImageResizer from './tools/ImageResizer/ImageResizer';
import PasswordGenerator from './tools/PasswordGenerator/PasswordGenerator';
import Base64Encoder from './tools/Base64Encoder/Base64Encoder';
import MarkdownPreviewer from './tools/MarkdownPreviewer/MarkdownPreviewer';
import UuidGenerator from './tools/UuidGenerator/UuidGenerator';
import ColorConverter from './tools/ColorConverter/ColorConverter';

export function render(url, helmetContext = {}) {
  const html = ReactDOMServer.renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="tools" element={<Tools />}>
              <Route path="stopwatch" element={<Stopwatch />} />
              <Route path="notepad" element={<Notepad />} />
              <Route path="word-counter" element={<WordCounter />} />
              <Route path="json-formatter" element={<JsonFormatter />} />
              <Route path="image-resizer" element={<ImageResizer />} />
              <Route path="password-generator" element={<PasswordGenerator />} />
              <Route path="base64-encoder" element={<Base64Encoder />} />
              <Route path="markdown-previewer" element={<MarkdownPreviewer />} />
              <Route path="uuid-generator" element={<UuidGenerator />} />
              <Route path="color-converter" element={<ColorConverter />} />
            </Route>

            {/* Direct convenience aliases redirected to canonical /tools/... */}
            <Route path="stopwatch" element={<Navigate to="/tools/stopwatch" replace />} />
            <Route path="notepad" element={<Navigate to="/tools/notepad" replace />} />
            <Route path="word-counter" element={<Navigate to="/tools/word-counter" replace />} />
            <Route path="json-formatter" element={<Navigate to="/tools/json-formatter" replace />} />
            <Route path="image-resizer" element={<Navigate to="/tools/image-resizer" replace />} />
            <Route path="password-generator" element={<Navigate to="/tools/password-generator" replace />} />
            <Route path="base64-encoder" element={<Navigate to="/tools/base64-encoder" replace />} />
            <Route path="markdown-previewer" element={<Navigate to="/tools/markdown-previewer" replace />} />
            <Route path="uuid-generator" element={<Navigate to="/tools/uuid-generator" replace />} />
            <Route path="color-converter" element={<Navigate to="/tools/color-converter" replace />} />

            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<Blog />} />
            <Route path="about" element={<About />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms" element={<Terms />} />
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </StaticRouter>
    </HelmetProvider>
  );

  return { html, helmet: helmetContext.helmet };
}
