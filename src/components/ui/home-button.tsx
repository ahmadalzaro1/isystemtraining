import React from 'react';

interface HomeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const HomeButton = React.forwardRef<HTMLButtonElement, HomeButtonProps>(
  ({ children, onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      console.log('HomeButton clicked!');
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        style={{
          backgroundColor: '#007AFF',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          padding: '16px 32px',
          fontSize: '18px',
          fontWeight: '600',
          cursor: 'pointer',
          minHeight: '60px',
          minWidth: '200px'
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

HomeButton.displayName = 'HomeButton';

export { HomeButton };