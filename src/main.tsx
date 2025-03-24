
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Don't make the hook globally available, import it properly in App.tsx instead
createRoot(document.getElementById("root")!).render(<App />);
