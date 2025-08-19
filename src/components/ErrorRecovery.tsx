import React from 'react';

interface ErrorRecoveryProps {
  children: React.ReactNode;
}

export const ErrorRecovery: React.FC<ErrorRecoveryProps> = ({ children }) => {
  // Check if React is properly initialized
  if (typeof React === 'undefined' || !React.useEffect) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        textAlign: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <h1 style={{ color: '#ef4444', marginBottom: '16px' }}>
          Runtime Error Detected
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          The React runtime has been corrupted. Please refresh the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Refresh Page
        </button>
        <p style={{ 
          color: '#9ca3af', 
          fontSize: '14px', 
          marginTop: '16px',
          maxWidth: '400px'
        }}>
          If this issue persists, try clearing your browser cache or using Ctrl+Shift+R (Cmd+Shift+R on Mac) for a hard refresh.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};