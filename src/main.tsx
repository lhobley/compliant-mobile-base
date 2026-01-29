import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Global Error Handler for startup
window.onerror = function(message, source, lineno, colno, error) {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 20px; color: red; font-family: monospace; background: #fff0f0; border: 1px solid red; margin: 20px;">
        <h2>Runtime Error</h2>
        <p>${message}</p>
        <pre>${error?.stack || ''}</pre>
        <p>Source: ${source}:${lineno}:${colno}</p>
      </div>
    `;
  }
};

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-50 text-red-900 min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <pre className="bg-white p-4 rounded shadow overflow-auto text-sm">
            {this.state.error?.message}
            {'\n'}
            {this.state.error?.stack}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} catch (e) {
  console.error("Render failed:", e);
  rootElement.innerHTML = `<h1>Fatal Render Error</h1><pre>${e}</pre>`;
}
