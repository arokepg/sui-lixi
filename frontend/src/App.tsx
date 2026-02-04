import { Routes, Route } from 'react-router-dom';
import { Header, CreateEnvelope, ClaimEnvelope } from './components';
import './App.css';

/**
 * Main App Component
 * Định nghĩa routing cho ứng dụng Sui Red Envelope
 */
function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          {/* Trang chủ - Tạo lì xì */}
          <Route path="/" element={<CreateEnvelope />} />
          
          {/* Trang nhận lì xì - Claim */}
          <Route path="/claim/:id" element={<ClaimEnvelope />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
