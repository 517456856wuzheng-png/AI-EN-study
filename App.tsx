
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { VocabularyModule } from './components/VocabularyModule';
import { ReadingModule } from './components/ReadingModule';
import { GrammarModule } from './components/GrammarModule';
import { WritingModule } from './components/WritingModule';
import { Dashboard } from './components/Dashboard';
import { WrongBook } from './components/WrongBook';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<VocabularyModule />} />
          <Route path="reading" element={<ReadingModule />} />
          <Route path="tenses" element={<GrammarModule />} />
          <Route path="writing" element={<WritingModule />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="wrong-book" element={<WrongBook />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
