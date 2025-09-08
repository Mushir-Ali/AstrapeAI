import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>

      {/* Toast center mein aana chahiye */}
      <Toaster
        position="top-center" // default options: top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
        toastOptions={{
          style: {
            transform: "translateY(50vh)", // move toast to vertical center
          },
        }}
      />
    </>
  )
}

export default App
