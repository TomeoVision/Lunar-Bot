import { HashRouter, Routes, Route } from "react-router-dom";
import { Library } from "./pages/Library";
import { Editor } from "./pages/Editor";
import { ViewPage } from "./pages/ViewPage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Library />} />
        <Route path="/edit/:id" element={<Editor />} />
        <Route path="/view" element={<ViewPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
