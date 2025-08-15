# Email Verification Setup Guide

## Overview
This guide will help you set up email verification for the DreamNet application. The system sends verification emails to users when they register, and they must verify their email before they can log in.

## Backend Setup

### 1. Install Dependencies
```bash
cd server
npm install nodemailer
```

### 2. Database Migration
Run the updated schema.sql to add verification fields to the users table:
```sql
-- Add these fields to your users table:
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN verification_token TEXT;
ALTER TABLE users ADD COLUMN verification_expires TIMESTAMP;
```

### 3. Environment Variables
Add these to your `.env` file in the server directory:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_SERVICE=gmail
FRONTEND_URL=http://localhost:3000

# For production, use a proper email service:
# EMAIL_SERVICE=sendgrid
# EMAIL_USER=your-sendgrid-username
# EMAIL_PASS=your-sendgrid-api-key
```

### 4. Gmail Setup (Development)
If using Gmail for development:

1. Enable 2-factor authentication on your Gmail account
2. Generate an "App Password":
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Use this app password in your EMAIL_PASS environment variable

### 5. Production Email Services
For production, consider using:
- **SendGrid**: Professional email service with good deliverability
- **AWS SES**: Cost-effective for high volume
- **Mailgun**: Developer-friendly email API

## Frontend Setup

### 1. New Routes
The verification route `/verify-email` has been added to handle email verification links.

### 2. Updated Components
- **Register.jsx**: Now shows verification messages and doesn't redirect immediately
- **VerifyEmail.jsx**: New page for handling verification tokens

## How It Works

### 1. Registration Flow
1. User fills out registration form
2. Backend creates user account with `email_verified = FALSE`
3. Verification token is generated and stored
4. Verification email is sent to user
5. User sees success message asking them to check email

### 2. Email Verification Flow
1. User clicks verification link in email
2. Frontend calls `/auth/verify/:token` endpoint
3. Backend validates token and marks user as verified
4. User sees success message and is redirected to login

### 3. Login Flow
1. User attempts to log in
2. Backend checks if `email_verified = TRUE`
3. If not verified, shows error message
4. If verified, proceeds with normal login

## Security Features

- **Token Expiration**: Verification tokens expire after 24 hours
- **One-time Use**: Tokens are cleared after successful verification
- **Secure Generation**: Uses crypto.randomBytes for token generation
- **Email Validation**: Only unverified users can use verification tokens

## Testing

### 1. Test Registration
1. Register a new user
2. Check console for email sending logs
3. Verify user is created with `email_verified = FALSE`

### 2. Test Email Sending
1. Check your email inbox
2. Verify the email contains the verification link
3. Check server logs for email sending status

### 3. Test Verification
1. Click the verification link in the email
2. Verify the user is marked as verified in the database
3. Test logging in with the verified account

## Troubleshooting

### Common Issues

1. **Email Not Sending**
   - Check EMAIL_USER and EMAIL_PASS environment variables
   - Verify Gmail app password is correct
   - Check server logs for error messages

2. **Verification Token Not Working**
   - Ensure token hasn't expired (24 hours)
   - Check database for correct token storage
   - Verify the verification endpoint is accessible

3. **User Can't Login After Verification**
   - Check if `email_verified` is set to TRUE in database
   - Verify verification token was cleared
   - Check server logs for verification process

### Debug Mode
Enable debug logging by adding to your server:
```javascript
console.log('Verification token:', verificationToken);
console.log('User verification status:', user.email_verified);
```

## Production Considerations

1. **Email Service**: Use a professional email service (SendGrid, AWS SES)
2. **Rate Limiting**: Implement rate limiting for registration and verification
3. **Monitoring**: Set up monitoring for email delivery rates
4. **Backup Verification**: Consider SMS verification as a backup
5. **User Experience**: Add resend verification email functionality

## Next Steps

Consider implementing these additional features:
- Resend verification email functionality
- Email change verification
- Password reset via email
- Account deletion confirmation 