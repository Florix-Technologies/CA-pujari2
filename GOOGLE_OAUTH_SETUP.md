# Google OAuth Setup Guide

## 🔐 Prerequisites

To enable Google Sign-In/Sign-Up, you need to:
1. Configure Google OAuth credentials
2. Add redirect URLs to Supabase
3. Add environment variables

---

## Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Go to **APIs & Services** → **Credentials**

### 1.2 Create OAuth 2.0 Client ID
1. Click **+ Create Credentials** → **OAuth client ID**
2. If prompted, configure the OAuth consent screen:
   - **User Type**: External
   - **App Name**: Shobha Pujari Trading Platform
   - **User Support Email**: your-email@example.com
   - **Add Scopes**: 
     - `email`
     - `profile`
     - `openid`
3. Click **Create**
4. Select **Web application**
5. Add Authorized redirect URIs:
   ```
   https://your-project.supabase.co/auth/v1/callback?provider=google
   http://localhost:3000/auth/callback
   https://yourdomain.com/auth/callback
   ```
6. Copy your **Client ID** and **Client Secret**

---

## Step 2: Configure Supabase

### 2.1 Add Google Provider
1. Go to your [Supabase Dashboard](https://supabase.com)
2. Select your project
3. Go to **Authentication** → **Providers**
4. Find **Google** and enable it
5. Paste your Google OAuth credentials:
   - **Client ID**: (from Step 1.6)
   - **Client Secret**: (from Step 1.6)

### 2.2 Set Redirect URLs
1. In Supabase, go to **Authentication** → **URL Configuration**
2. Add your redirect URLs:
   ```
   Redirected URLs:
   - http://localhost:3000/auth/callback
   - https://yourdomain.com/auth/callback
   ```

---

## Step 3: Environment Variables

### Add to `.env.local`
```env
# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: For production redirects
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## Step 4: Test Google Sign-In

1. Start the dev server:
   ```bash
   pnpm dev
   ```

2. Go to [http://localhost:3000/login](http://localhost:3000/login)

3. Click **"Continue with Google"**

4. Sign in with a Google account

5. Check Supabase:
   - Go to **Authentication** → **Users**
   - Your Google user should appear
   - Check **profiles** table - new profile should be created

---

## 🔧 Troubleshooting

### Issue: "Invalid OAuth Code"
- **Solution**: Make sure redirect URLs match exactly in both Google Console and Supabase
- Check for trailing slashes and protocol (http vs https)

### Issue: "Redirect URL mismatch"
- **Solution**: Add the exact URL you're testing to both:
  - Google Cloud Console (Authorized redirect URIs)
  - Supabase (URL Configuration → Redirected URLs)

### Issue: User created but no profile
- **Solution**: Check that `/auth/callback` route is properly configured
- Ensure `/app/auth/callback/route.ts` file exists
- Check browser console for errors

### Issue: Profile not created automatically
- **Solution**: Verify the `profiles` table exists in Supabase
- Check RLS (Row Level Security) policies allow inserts
- Review server logs for any errors

### Issue: Email not showing in profile
- **Solution**: Google OAuth may not always return email
- Check user metadata in Supabase: **Auth** → **Users** → click user
- User metadata should contain `email`, `full_name`, etc.

---

## 📊 Expected Behavior

### On successful Google Sign-In:

1. **Login Page** (`/login`):
   - User clicks "Continue with Google"
   - Redirected to Google login
   - After approval, redirected to `/auth/callback`
   - Profile created automatically
   - User redirected to home or saved redirect URL

2. **Signup Page** (`/signup`):
   - User clicks "Continue with Google"
   - Same flow as login
   - New profile created with role `student`
   - Registration email sent to admin

3. **Database**:
   - User appears in `auth.users` table
   - New row in `profiles` table:
     ```
     id: (UUID from auth.users)
     email: (from Google account)
     full_name: (from Google account)
     role: 'student'
     created_at: (timestamp)
     ```

---

## 🔒 Security Notes

1. **Client Secret**: Keep this secret - never expose in frontend
2. **Scopes**: Only request necessary permissions (email, profile)
3. **RLS**: Ensure Row Level Security is configured properly
4. **Redirect URLs**: Only add trusted URLs

---

## 📱 Supported Platforms

Google Sign-In works on:
- ✅ Web (desktop)
- ✅ Mobile browsers
- ✅ PWA
- ✅ Both light and dark themes

---

## 🌍 Production Checklist

- [ ] Google OAuth credentials created
- [ ] Google credentials added to Supabase
- [ ] Production domain added to Google Console
- [ ] Production domain added to Supabase
- [ ] Callback route deployed
- [ ] NEXT_PUBLIC_APP_URL set in production env
- [ ] Test login/signup in production
- [ ] Admin receives registration emails
- [ ] User profiles visible in Supabase dashboard

---

## 📚 Resources

- [Supabase OAuth Documentation](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [OAuth 2.0 Playground](https://developers.google.com/oauthplayground)

---

## 🆘 Support

If Google Sign-In still doesn't work:

1. **Check Supabase Logs**: 
   - Go to **Logs** in Supabase dashboard
   - Look for auth-related errors

2. **Check Browser Console**:
   - Open DevTools (F12)
   - Look for errors in Console tab
   - Check Network tab for failed requests

3. **Verify Configuration**:
   - Supabase provider enabled? ✓
   - Client ID and Secret added? ✓
   - Redirect URLs match? ✓
   - Environment variables set? ✓

4. **Common Solutions**:
   - Clear browser cache and cookies
   - Try an incognito/private window
   - Test on a different device
   - Check that Supabase project is active

---

**Last Updated**: April 14, 2026
