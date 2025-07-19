
import React from 'react';

interface ConfirmationEmailProps {
  workshopName: string;
  workshopDate: string;
  workshopTime: string;
  participantName: string;
  confirmationCode: string;
  joinLink?: string;
}

export const ConfirmationEmail = ({
  workshopName,
  workshopDate,
  workshopTime,
  participantName,
  confirmationCode,
  joinLink = "Will be provided 1 hour before the session"
}: ConfirmationEmailProps) => {
  const emailStyles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      padding: '40px 20px',
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '40px',
      borderBottom: '2px solid #007AFF',
      paddingBottom: '20px',
    },
    logo: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#007AFF',
      marginBottom: '10px',
    },
    title: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#1d1d1f',
      marginBottom: '10px',
    },
    subtitle: {
      fontSize: '16px',
      color: '#6e6e73',
      marginBottom: '30px',
    },
    confirmationBox: {
      backgroundColor: '#f5f5f7',
      border: '2px solid #007AFF',
      borderRadius: '12px',
      padding: '20px',
      textAlign: 'center' as const,
      marginBottom: '30px',
    },
    confirmationCode: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#007AFF',
      fontFamily: 'Monaco, monospace',
      letterSpacing: '2px',
    },
    detailsSection: {
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '30px',
    },
    detailRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '10px',
      paddingBottom: '10px',
      borderBottom: '1px solid #e5e5e7',
    },
    label: {
      fontWeight: '600',
      color: '#1d1d1f',
    },
    value: {
      color: '#6e6e73',
    },
    nextSteps: {
      marginBottom: '30px',
    },
    stepsList: {
      paddingLeft: '0',
      listStyle: 'none',
    },
    stepItem: {
      padding: '10px 0',
      borderLeft: '3px solid #007AFF',
      paddingLeft: '15px',
      marginBottom: '10px',
      backgroundColor: '#f5f5f7',
      borderRadius: '4px',
    },
    footer: {
      textAlign: 'center' as const,
      paddingTop: '30px',
      borderTop: '1px solid #e5e5e7',
      color: '#6e6e73',
      fontSize: '14px',
    },
    button: {
      display: 'inline-block',
      backgroundColor: '#007AFF',
      color: '#ffffff',
      padding: '12px 24px',
      textDecoration: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      marginTop: '20px',
    },
  };

  return (
    <div style={emailStyles.container}>
      <div style={emailStyles.header}>
        <div style={emailStyles.logo}>iSystem</div>
        <h1 style={emailStyles.title}>Workshop Registration Confirmed!</h1>
        <p style={emailStyles.subtitle}>
          Get ready for an amazing learning experience, {participantName}!
        </p>
      </div>

      <div style={emailStyles.confirmationBox}>
        <p style={{ margin: '0 0 10px 0', fontWeight: '600', color: '#1d1d1f' }}>
          Your Confirmation Code
        </p>
        <div style={emailStyles.confirmationCode}>{confirmationCode}</div>
        <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#6e6e73' }}>
          Save this code for your records
        </p>
      </div>

      <div style={emailStyles.detailsSection}>
        <h2 style={{ margin: '0 0 20px 0', color: '#1d1d1f' }}>Workshop Details</h2>
        
        <div style={emailStyles.detailRow}>
          <span style={emailStyles.label}>Workshop:</span>
          <span style={emailStyles.value}>{workshopName}</span>
        </div>
        
        <div style={emailStyles.detailRow}>
          <span style={emailStyles.label}>Date:</span>
          <span style={emailStyles.value}>{workshopDate}</span>
        </div>
        
        <div style={emailStyles.detailRow}>
          <span style={emailStyles.label}>Time:</span>
          <span style={emailStyles.value}>{workshopTime}</span>
        </div>
        
        <div style={emailStyles.detailRow}>
          <span style={emailStyles.label}>Format:</span>
          <span style={emailStyles.value}>Online Workshop</span>
        </div>
        
        <div style={{ ...emailStyles.detailRow, borderBottom: 'none' }}>
          <span style={emailStyles.label}>Join Link:</span>
          <span style={emailStyles.value}>{joinLink}</span>
        </div>
      </div>

      <div style={emailStyles.nextSteps}>
        <h2 style={{ margin: '0 0 20px 0', color: '#1d1d1f' }}>What Happens Next?</h2>
        <ul style={emailStyles.stepsList}>
          <li style={emailStyles.stepItem}>
            📧 You'll receive workshop materials 24 hours before the session
          </li>
          <li style={emailStyles.stepItem}>
            🔗 Join link and meeting details will be shared 1 hour before start time
          </li>
          <li style={emailStyles.stepItem}>
            📱 Add this event to your calendar to never miss it
          </li>
          <li style={emailStyles.stepItem}>
            💡 Prepare any questions you'd like to ask during the session
          </li>
        </ul>
        
        <div style={{ textAlign: 'center' }}>
          <a href="#" style={emailStyles.button}>
            Add to Calendar
          </a>
        </div>
      </div>

      <div style={emailStyles.footer}>
        <p>Need help? Contact us at support@isystem.com</p>
        <p>© 2024 iSystem Training. All rights reserved.</p>
        <div style={{ marginTop: '20px' }}>
          <img 
            src="/placeholder.svg" 
            alt="iSystem Logo" 
            style={{ height: '24px', opacity: 0.6 }}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmationEmail;
