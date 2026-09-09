# Email Automation Setup Guide

## 📧 Overview

Drive Exotiq uses **Resend** for automated email notifications. The system automatically sends emails when:
- ✅ New applications are submitted (confirmation to applicant + notification to admin)
- ✅ Applications are approved (welcome email to applicant)
- ✅ Applications are rejected (graceful rejection email to applicant)

---

## 🚀 Quick Setup

### 1. Get Resend API Key

1. Sign up at [resend.com](https://resend.com) (free tier: 3,000 emails/month)
2. Go to **API Keys** → **Create API Key**
3. Copy your API key (starts with `re_`)

### 2. Add Environment Variables

Add to your `.env.local` file:

```bash
# Resend Email Service
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Optional: Customize email addresses
ADMIN_EMAIL=hello@exotiq.ai          # Where admin notifications go
FROM_EMAIL=Drive Exotiq <hello@exotiq.ai>  # Sender name and email
NEXT_PUBLIC_SITE_URL=https://driveexotiq.com  # For email links
```

**For Netlify deployment:**
- Add these same variables in **Site Settings** → **Environment Variables**

### 3. Verify Domain (Optional but Recommended)

For better deliverability:
1. In Resend dashboard, go to **Domains**
2. Add `exotiq.ai` (or your domain)
3. Add the DNS records Resend provides
4. Wait for verification (usually 5-10 minutes)

**Note:** You can use `onboarding@resend.dev` for testing without domain verification.

---

## 📨 Email Types

### 1. Application Confirmation (to Applicant)
- **Trigger:** When form is submitted
- **Subject:** "We received your Drive Exotiq application! 🚗"
- **Content:** Thank you message, timeline, next steps, application details

### 2. Admin Notification (to Team)
- **Trigger:** When new application is submitted
- **Subject:** "New Application: [Name] - [City]"
- **Content:** Full application details, link to admin dashboard

### 3. Approval Email (to Applicant)
- **Trigger:** When admin changes status to "approved"
- **Subject:** "Welcome to Drive Exotiq! 🎉"
- **Content:** Congratulations, next steps, CTA to get started

### 4. Rejection Email (to Applicant)
- **Trigger:** When admin changes status to "rejected"
- **Subject:** "Update on your Drive Exotiq application"
- **Content:** Graceful rejection, waitlist option, reapply info

---

## 🔧 How It Works

### Architecture

```
User Submits Form
    ↓
Supabase Insert
    ↓
API Route: /api/send-email
    ↓
Resend API
    ↓
Emails Sent (Applicant + Admin)
```

### Code Flow

1. **Form Submission** (`components/forms/ApplicationForm.tsx`)
   - Submits to Supabase
   - Calls `/api/send-email` with `type: 'new_application'`
   - Doesn't block user if email fails

2. **Status Updates** (`app/api/admin/applications/route.ts`)
   - Admin changes status in dashboard
   - API route detects status change
   - Calls `/api/send-email` with `type: 'status_update'`
   - Sends approval or rejection email

3. **Email Service** (`app/api/send-email/route.ts`)
   - Receives email request
   - Generates HTML using templates
   - Sends via Resend API
   - Returns success/failure status

---

## 🧪 Testing

### Test Application Submission

1. Go to `/apply` page
2. Fill out and submit the form
3. Check:
   - ✅ You receive confirmation email
   - ✅ Admin receives notification email
   - ✅ Application appears in Supabase

### Test Status Updates

1. Go to `/admin` dashboard
2. Change an application status to "approved"
3. Check:
   - ✅ Applicant receives approval email
4. Change another to "rejected"
5. Check:
   - ✅ Applicant receives rejection email

### Test Email Templates

You can preview templates by checking `lib/email-templates.ts`:
- `applicationConfirmationEmail()`
- `adminNotificationEmail()`
- `approvalEmail()`
- `rejectionEmail()`

---

## 🐛 Troubleshooting

### Emails Not Sending

**Check:**
1. ✅ `RESEND_API_KEY` is set in `.env.local`
2. ✅ Resend API key is valid (check Resend dashboard)
3. ✅ Check browser console for errors
4. ✅ Check server logs for API errors

**Common Issues:**

**"Email service not configured"**
- `RESEND_API_KEY` is missing or invalid
- Add to `.env.local` and restart dev server

**"Invalid API key"**
- Regenerate API key in Resend dashboard
- Update `.env.local`

**"Domain not verified"**
- Use `onboarding@resend.dev` for testing
- Or verify your domain in Resend dashboard

### Email Delivery Issues

**Check Resend Dashboard:**
- Go to **Logs** → See delivery status
- Check for bounces or spam reports
- Verify sender email is correct

**Improve Deliverability:**
- Verify your domain in Resend
- Use SPF/DKIM records
- Warm up your sending domain gradually

---

## 📊 Monitoring

### Resend Dashboard
- **Logs:** See all sent emails
- **Analytics:** Open rates, click rates (if tracking enabled)
- **Bounces:** Failed deliveries

### Application Logs
Check server console for:
- Email send attempts
- Success/failure status
- Error messages

---

## 🎨 Customizing Emails

### Edit Templates

Edit `lib/email-templates.ts`:
- Change colors, fonts, layout
- Update copy and messaging
- Add/remove sections

### Change Email Addresses

Update `.env.local`:
```bash
ADMIN_EMAIL=your-team@exotiq.ai
FROM_EMAIL=Drive Exotiq <noreply@exotiq.ai>
```

### Add New Email Types

1. Create new template function in `lib/email-templates.ts`
2. Add case in `app/api/send-email/route.ts`
3. Call from appropriate trigger point

---

## 🔒 Security

- ✅ API key stored in environment variables (never in code)
- ✅ Email API route is server-side only
- ✅ No sensitive data exposed in email templates
- ✅ Admin notifications only sent to configured email

---

## 💰 Cost

**Resend Pricing:**
- **Free Tier:** 3,000 emails/month
- **Pro:** $20/month for 50,000 emails
- **Enterprise:** Custom pricing

**For Drive Exotiq:**
- ~100 applications/month = ~200 emails (confirmation + admin)
- ~50 status updates/month = ~50 emails
- **Total: ~250 emails/month** → **FREE** ✅

---

## 🚀 Future Enhancements

**Possible additions:**
- [ ] Email tracking (opens, clicks)
- [ ] A/B testing subject lines
- [ ] Scheduled follow-up emails
- [ ] Unsubscribe handling
- [ ] Email preferences page
- [ ] Rich text editor for templates
- [ ] Email queue for retries
- [ ] Multi-language support

---

## 📚 Resources

- [Resend Documentation](https://resend.com/docs)
- [Resend Dashboard](https://resend.com/emails)
- [Email Templates Guide](https://resend.com/docs/send-with-nodejs)

---

## ✅ Checklist

Before going live:
- [ ] Resend account created
- [ ] API key added to `.env.local`
- [ ] Test email sent successfully
- [ ] Domain verified (optional but recommended)
- [ ] Admin email address configured
- [ ] Test application submission
- [ ] Test status update emails
- [ ] Environment variables added to Netlify
- [ ] Production emails tested

---

**Questions?** Check the code in:
- `lib/email-templates.ts` - Email HTML templates
- `app/api/send-email/route.ts` - Email sending logic
- `components/forms/ApplicationForm.tsx` - Form submission trigger
- `app/api/admin/applications/route.ts` - Status update trigger


