import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Tools from './pages/Tools';
import About from './pages/About';
import Blog from './pages/Blog';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Notepad from './tools/Notepad/Notepad';
import WordCounter from './tools/WordCounter/WordCounter';
import JsonFormatter from './tools/JsonFormatter/JsonFormatter';
import ImageResizer from './tools/ImageResizer/ImageResizer';
import PasswordGenerator from './tools/PasswordGenerator/PasswordGenerator';
import Base64Encoder from './tools/Base64Encoder/Base64Encoder';
import MarkdownPreviewer from './tools/MarkdownPreviewer/MarkdownPreviewer';
import UuidGenerator from './tools/UuidGenerator/UuidGenerator';
import ColorConverter from './tools/ColorConverter/ColorConverter';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="tools" element={<Tools />}>
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
        {/* Direct Convenience Aliases */}
        <Route path="notepad" element={<Notepad />} />
        <Route path="word-counter" element={<WordCounter />} />
        <Route path="json-formatter" element={<JsonFormatter />} />
        <Route path="image-resizer" element={<ImageResizer />} />
        <Route path="password-generator" element={<PasswordGenerator />} />
        <Route path="base64-encoder" element={<Base64Encoder />} />
        <Route path="markdown-previewer" element={<MarkdownPreviewer />} />
        <Route path="uuid-generator" element={<UuidGenerator />} />
        <Route path="color-converter" element={<ColorConverter />} />

        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<Blog />} />
        <Route path="about" element={<About />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
