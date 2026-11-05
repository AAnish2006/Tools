import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Tools from './pages/Tools';
import './App.css';

// Lazy-load individual tools and pages for optimal code splitting
const Stopwatch = lazy(() => import('./tools/Stopwatch/Stopwatch'));
const Notepad = lazy(() => import('./tools/Notepad/Notepad'));
const WordCounter = lazy(() => import('./tools/WordCounter/WordCounter'));
const JsonFormatter = lazy(() => import('./tools/JsonFormatter/JsonFormatter'));
const ImageResizer = lazy(() => import('./tools/ImageResizer/ImageResizer'));
const PasswordGenerator = lazy(() => import('./tools/PasswordGenerator/PasswordGenerator'));
const Base64Encoder = lazy(() => import('./tools/Base64Encoder/Base64Encoder'));
const MarkdownPreviewer = lazy(() => import('./tools/MarkdownPreviewer/MarkdownPreviewer'));
const UuidGenerator = lazy(() => import('./tools/UuidGenerator/UuidGenerator'));
const ColorConverter = lazy(() => import('./tools/ColorConverter/ColorConverter'));

const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));

const ToolLoader = () => (
  <div style={{ padding: '4rem 1rem', textAlign: 'center', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
    <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <span style={{ color: '#64748b', fontSize: '0.95rem' }}>Loading utility...</span>
  </div>
);

function App() {
  return (
    <Suspense fallback={<ToolLoader />}>
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

          {/* Direct Convenience Aliases -> Redirect to canonical /tools/... */}
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
    </Suspense>
  );
}

export default App;
