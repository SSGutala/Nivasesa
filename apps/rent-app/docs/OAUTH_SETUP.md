# OAuth Authentication Setup

This guide explains how to configure and use OAuth authentication with Google and GitHub in the Nivasesa rent-app.

## Overview

The application now supports three authentication methods:
1. **Email/Password** (Credentials provider with demo mode)
2. **Google OAuth** (Sign in with Google)
3. **GitHub OAuth** (Sign in with GitHub)

## Features

- OAuth providers automatically create new user accounts with BUYER role
- OAuth accounts are automatically linked to existing users by email
- Users can sign in with any method if accounts share the same email
- Profile pictures and names are synced from OAuth providers
- Email is automatically verified for OAuth sign-ins
- 2FA is still supported for credentials-based login

## Setup Instructions

### 1. Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client ID
5. Set authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
6. Copy the Client ID and Client Secret

### 2. GitHub OAuth Configuration

1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - Application name: Nivasesa
   - Homepage URL: `http://localhost:3000` (or your production URL)
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Generate a new client secret
6. Copy the Client ID and Client Secret

### 3. Environment Variables

Add the following to your `.env` file (or `.env.local`):

```env
# NextAuth
AUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
```

Generate a secure `AUTH_SECRET` with:
```bash
openssl rand -base64 32
```

## Implementation Details

### Files Modified

1. **`/apps/rent-app/auth.ts`**
   - Added Google and GitHub provider imports
   - Configured providers with environment variables
   - Added `signIn` callback to handle OAuth user creation/linking
   - Set `allowDangerousEmailAccountLinking: true` to link OAuth accounts to existing users

2. **`/apps/rent-app/auth.config.ts`**
   - Added OAuth providers for edge middleware compatibility
   - Ensures OAuth routes are accessible

3. **`/apps/rent-app/app/login/page.tsx`**
   - Added OAuth buttons with Google and GitHub branding
   - Implemented `signIn()` calls with provider parameter
   - Added visual divider between credentials and OAuth login

4. **`/apps/rent-app/app/auth/login/page.tsx`**
   - Same OAuth buttons as main login page (for alternative login route)

5. **`/apps/rent-app/.env.example`**
   - Created template with all required OAuth variables

### User Flow

#### New User Sign-in (OAuth)
1. User clicks "Continue with Google" or "Continue with GitHub"
2. User is redirected to OAuth provider for authorization
3. On successful auth, callback checks if user exists in database
4. If not, creates new user with:
   - Email from OAuth profile
   - Name from OAuth profile
   - Image from OAuth profile
   - Role: BUYER (default)
   - EmailVerified: current timestamp
5. User is redirected to `/dashboard`

#### Existing User Sign-in (OAuth)
1. User clicks OAuth button
2. OAuth provider authenticates user
3. Callback finds existing user by email
4. Updates user's name and image if provided by OAuth
5. User is redirected to `/dashboard`

### Security Considerations

**Account Linking**
- `allowDangerousEmailAccountLinking: true` is set to allow users to sign in with different methods using the same email
- This is considered "dangerous" because an attacker with access to an OAuth account could link to an existing email
- Mitigation: In production, consider requiring email verification before linking accounts
- Alternative: Implement a manual account linking flow in user settings

**Error Handling**
- OAuth errors are logged to console
- Failed sign-ins return `false`, showing error to user
- Database errors are caught and prevent account creation

## Testing

### Development Testing

1. Start the development server:
```bash
npm run dev:rent
```

2. Navigate to `http://localhost:3000/login`

3. Test OAuth buttons:
   - Click "Continue with Google" - should redirect to Google consent
   - Click "Continue with GitHub" - should redirect to GitHub authorization

4. After authorization, verify:
   - New user is created in database
   - User is redirected to `/dashboard`
   - User session is active

### Testing Account Linking

1. Create a user with credentials (email/password)
2. Sign out
3. Sign in with Google/GitHub using the same email
4. Verify:
   - No duplicate user created
   - Profile picture updated from OAuth
   - User can sign in with both methods

## Troubleshooting

### OAuth buttons don't work
- Check environment variables are set correctly
- Verify OAuth app redirect URIs match your domain
- Check browser console for errors

### "Configuration" error
- Ensure `AUTH_SECRET` is set and is a strong random string
- Verify `NEXTAUTH_URL` matches your current domain

### Users not created
- Check database connection
- Verify Prisma schema includes all required User fields
- Check server logs for database errors

### Account linking issues
- Verify email is unique in database
- Check if OAuth provider returns email in profile
- Ensure `allowDangerousEmailAccountLinking` is set to `true`

## Production Considerations

1. **Environment Variables**
   - Set production OAuth credentials
   - Update redirect URIs to production domain
   - Generate new `AUTH_SECRET` for production

2. **HTTPS Required**
   - OAuth providers require HTTPS in production
   - Ensure `NEXTAUTH_URL` uses `https://`

3. **Email Verification**
   - Consider implementing email verification flow
   - Add confirmation step before account linking

4. **Rate Limiting**
   - Implement rate limiting on OAuth callbacks
   - Monitor for suspicious sign-in patterns

5. **Analytics**
   - Track OAuth sign-in success/failure rates
   - Monitor which providers users prefer

## Future Enhancements

- Add more OAuth providers (Apple, Microsoft, LinkedIn)
- Implement account unlinking in user settings
- Add profile completion flow for OAuth users
- Show connected accounts in user profile
- Allow users to set preferred sign-in method
