import { createRoot } from 'react-dom/client'
import '/src/styles/theme.css';
import '/src/styles/forms.css';
import '/src/styles/glass.css';
import '/src/styles/canvas.css';
import '/src/styles/layout.css';
import '/src/styles/workshops.css';
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
