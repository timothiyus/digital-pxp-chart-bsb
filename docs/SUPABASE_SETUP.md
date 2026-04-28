# Supabase + Resend Setup

One-time wiring for the cloud-sync pattern. Mirrors the stingray tracker.

## 1. Run the schema

In the Supabase dashboard:

- **SQL Editor → New query**
- Paste the contents of [`supabase-schema.sql`](../supabase-schema.sql)
- Run

This creates the `app_state` table, RLS policies (each user sees only their own row), and adds the table to the realtime publication.

## 2. Enable realtime on the table

If the SQL block at the bottom of the schema didn't take (Supabase sometimes scopes differently per project):

- **Database → Replication**
- Find `app_state` in the list and toggle **Realtime: On**

Without this, other devices won't get live updates — they'll still sync on next login, but not instantly.

## 3. Wire up Resend as the email sender

The 8-digit codes go through Supabase Auth. Point Auth at Resend's SMTP so emails actually deliver.

- **Project Settings → Auth → SMTP Settings**
- **Enable Custom SMTP**
- Fill in:
  - Host: `smtp.resend.com`
  - Port: `465`
  - Username: `resend`
  - Password: `<your Resend API key>` (starts with `re_`)
  - Sender email: the address you verified in Resend (e.g. `kvancamp1999@gmail.com`)
  - Sender name: `PxP Baseball Chart`
- Save

## 4. Switch the email template to an 8-digit code

By default Supabase sends a magic link. We want a code instead.

- **Authentication → Email Templates → Magic Link**
- Replace the body with something like:

  ```html
  <h2>Your sign-in code</h2>
  <p>Use this code to sign in to PxP Baseball Chart:</p>
  <p style="font-size:28px;letter-spacing:8px;font-weight:900">{{ .Token }}</p>
  <p>This code expires shortly. If you didn't ask for it, ignore this email.</p>
  ```

The key bit is `{{ .Token }}` — that's what surfaces the 8-digit code to the email body. The app calls `verifyOtp({ type: "email", token })` to consume it.

## 5. Set the site URL + redirect URLs

- **Authentication → URL Configuration**
- **Site URL:** the GitHub Pages origin (e.g. `https://timothyius.github.io/digital-pxp-chart-bsb/`) or wherever the app is hosted
- **Redirect URLs:** add the same plus any local dev origin you use (e.g. `http://localhost:5173`)

This isn't strictly required for OTP-code flow but it keeps the auth machinery happy if you ever switch back to magic-link clicks.

## 6. Sanity check

- Open the deployed app
- Enter your email → click **Send code**
- Inbox should get a Resend-sourced email with an 8-digit code
- Enter the code → app loads

If the email never arrives, check **Authentication → Logs** in Supabase — usually it's an SMTP setting.
