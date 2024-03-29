import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from './theme-context.js'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    // createContext使用例子，主题切换
    // https://vimalselvam.com/post/toggle-theme-using-react-hooks/
    <ThemeProvider>
        <App />
    </ThemeProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
