import { ConfirmationEmail } from './ConfirmationEmail';

export interface ConfirmationEmailData {
  workshopName: string;
  workshopDate: string;
  workshopTime: string;
  participantName: string;
  confirmationCode: string;
  joinLink?: string;
}

export const generateConfirmationEmailHTML = (data: ConfirmationEmailData): string => {
  // For now, we'll generate HTML from the React component data
  // In a production app, you'd want to use a proper React renderer
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Workshop Registration Confirmed</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px 20px;">
      
      <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #007AFF; padding-bottom: 20px;">
        <div style="font-size: 32px; font-weight: bold; color: #007AFF; margin-bottom: 10px;">iSystem</div>
        <h1 style="font-size: 24px; font-weight: 600; color: #1d1d1f; margin-bottom: 10px;">Workshop Registration Confirmed!</h1>
        <p style="font-size: 16px; color: #6e6e73; margin-bottom: 30px;">
          Get ready for an amazing learning experience, ${data.participantName}!
        </p>
      </div>

      <div style="background-color: #f5f5f7; border: 2px solid #007AFF; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 30px;">
        <p style="margin: 0 0 10px 0; font-weight: 600; color: #1d1d1f;">
          Your Confirmation Code
        </p>
        <div style="font-size: 24px; font-weight: bold; color: #007AFF; font-family: Monaco, monospace; letter-spacing: 2px;">${data.confirmationCode}</div>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #6e6e73;">
          Save this code for your records
        </p>
      </div>

      <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
        <h2 style="margin: 0 0 20px 0; color: #1d1d1f;">Workshop Details</h2>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e5e5e7;">
          <span style="font-weight: 600; color: #1d1d1f;">Workshop:</span>
          <span style="color: #6e6e73;">${data.workshopName}</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e5e5e7;">
          <span style="font-weight: 600; color: #1d1d1f;">Date:</span>
          <span style="color: #6e6e73;">${data.workshopDate}</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e5e5e7;">
          <span style="font-weight: 600; color: #1d1d1f;">Time:</span>
          <span style="color: #6e6e73;">${data.workshopTime}</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e5e5e7;">
          <span style="font-weight: 600; color: #1d1d1f;">Format:</span>
          <span style="color: #6e6e73;">Online Workshop</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; border-bottom: none;">
          <span style="font-weight: 600; color: #1d1d1f;">Join Link:</span>
          <span style="color: #6e6e73;">${data.joinLink || 'Will be provided 1 hour before the session'}</span>
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="margin: 0 0 20px 0; color: #1d1d1f;">What Happens Next?</h2>
        <ul style="padding-left: 0; list-style: none;">
          <li style="padding: 10px 0; border-left: 3px solid #007AFF; padding-left: 15px; margin-bottom: 10px; background-color: #f5f5f7; border-radius: 4px;">
            📧 You'll receive workshop materials 24 hours before the session
          </li>
          <li style="padding: 10px 0; border-left: 3px solid #007AFF; padding-left: 15px; margin-bottom: 10px; background-color: #f5f5f7; border-radius: 4px;">
            🔗 Join link and meeting details will be shared 1 hour before start time
          </li>
          <li style="padding: 10px 0; border-left: 3px solid #007AFF; padding-left: 15px; margin-bottom: 10px; background-color: #f5f5f7; border-radius: 4px;">
            📱 Add this event to your calendar to never miss it
          </li>
          <li style="padding: 10px 0; border-left: 3px solid #007AFF; padding-left: 15px; margin-bottom: 10px; background-color: #f5f5f7; border-radius: 4px;">
            💡 Prepare any questions you'd like to ask during the session
          </li>
        </ul>
      </div>

      <div style="text-align: center; padding-top: 30px; border-top: 1px solid #e5e5e7; color: #6e6e73; font-size: 14px;">
        <p>Need help? Contact us at support@isystem.com</p>
        <p>© 2024 iSystem Training. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};

export const generateReminderEmailHTML = (data: ConfirmationEmailData & { hoursUntil: number }): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Workshop Reminder - Starting Soon!</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px 20px;">
      
      <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #FF6B35; padding-bottom: 20px;">
        <div style="font-size: 32px; font-weight: bold; color: #007AFF; margin-bottom: 10px;">iSystem</div>
        <h1 style="font-size: 24px; font-weight: 600; color: #1d1d1f; margin-bottom: 10px;">Workshop Reminder</h1>
        <p style="font-size: 18px; color: #FF6B35; font-weight: 600; margin-bottom: 10px;">
          Starting in ${data.hoursUntil} ${data.hoursUntil === 1 ? 'hour' : 'hours'}!
        </p>
        <p style="font-size: 16px; color: #6e6e73;">
          Don't forget about your upcoming workshop, ${data.participantName}!
        </p>
      </div>

      <div style="background-color: #fff5f0; border: 2px solid #FF6B35; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 30px;">
        <p style="margin: 0 0 10px 0; font-weight: 600; color: #1d1d1f;">
          Your Confirmation Code
        </p>
        <div style="font-size: 24px; font-weight: bold; color: #FF6B35; font-family: Monaco, monospace; letter-spacing: 2px;">${data.confirmationCode}</div>
      </div>

      <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
        <h2 style="margin: 0 0 20px 0; color: #1d1d1f;">Workshop Details</h2>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e5e5e7;">
          <span style="font-weight: 600; color: #1d1d1f;">Workshop:</span>
          <span style="color: #6e6e73;">${data.workshopName}</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e5e5e7;">
          <span style="font-weight: 600; color: #1d1d1f;">Date:</span>
          <span style="color: #6e6e73;">${data.workshopDate}</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e5e5e7;">
          <span style="font-weight: 600; color: #1d1d1f;">Time:</span>
          <span style="color: #6e6e73;">${data.workshopTime}</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; border-bottom: none;">
          <span style="font-weight: 600; color: #1d1d1f;">Join Link:</span>
          <span style="color: #6e6e73;">${data.joinLink || 'Check your email 1 hour before the session'}</span>
        </div>
      </div>

      <div style="text-align: center; margin-bottom: 30px;">
        <div style="background-color: #007AFF; color: white; padding: 15px 25px; border-radius: 8px; display: inline-block; font-weight: 600; text-decoration: none;">
          ${data.joinLink ? `<a href="${data.joinLink}" style="color: white; text-decoration: none;">Join Workshop Now</a>` : 'Join link coming soon'}
        </div>
      </div>

      <div style="text-align: center; padding-top: 30px; border-top: 1px solid #e5e5e7; color: #6e6e73; font-size: 14px;">
        <p>Need help? Contact us at support@isystem.com</p>
        <p>© 2024 iSystem Training. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};