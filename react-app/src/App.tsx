import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { Header } from './components/layout/Header';
import { Landing } from './pages/Landing';
import { Editor } from './pages/Editor';

function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/editor" element={<Editor />} />
          </Routes>
        </div>
      </DataProvider>
    </BrowserRouter>
  );
}

export default App;
