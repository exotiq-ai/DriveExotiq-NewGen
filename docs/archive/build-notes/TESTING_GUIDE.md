# Testing Guide for Drive Exotiq

This guide will walk you through testing all the features of the Drive Exotiq website.

---

## Prerequisites

Before testing, ensure:
1. ✅ `.env.local` is set up with Supabase credentials
2. ✅ Supabase database table is created with RLS policies
3. ✅ Dev server is running: `npm run dev`

---

## Test 1: Application Form Submission

### Steps:

1. **Navigate to the application page:**
   - Open: `http://localhost:3000/apply`

2. **Fill out the form with test data:**
   - Full Name: `John Doe`
   - Email: `john.doe@example.com`
   - Phone: `(555) 123-4567`
   - Current City: `Los Angeles`
   - City of Interest: `Denver`
   - Why Drive Exotiq?: `Passionate car enthusiast looking to join an exclusive community.`
   - Invite Code: (leave blank or enter `TEST2025`)
   - Check the terms agreement box

3. **Submit the form:**
   - Click "Submit Application"
   - Should see loading state: "Submitting..."
   - Should redirect to `/thank-you` page

4. **Verify thank you page:**
   - Should display success message
   - Should show next steps
   - Should have social media links

### Validation Testing:

Test form validation by:
- Submitting empty form (should show required field errors)
- Entering invalid email (should show email format error)
- Entering short phone number (should show phone error)
- Entering brief intro < 10 characters (should show min length error)
- Entering brief intro > 200 characters (should show max length error)
- Not checking terms box (should show terms error)

### Expected Results:
- ✅ Form validates correctly
- ✅ Submission succeeds with valid data
- ✅ Redirects to thank you page
- ✅ No console errors

---

## Test 2: Verify Data in Supabase

### Option A: Via Supabase Dashboard

1. Go to your Supabase project
2. Click **Table Editor** → `applications`
3. Find your test submission
4. Verify all fields match what you entered
5. Check `status` is `pending`
6. Check `created_at` is recent

### Option B: Via SQL Editor

1. Go to **SQL Editor** in Supabase
2. Run this query:
   ```sql
   SELECT * FROM applications 
   ORDER BY created_at DESC 
   LIMIT 5;
   ```
3. Your test submission should appear at the top

### Expected Results:
- ✅ Application appears in database
- ✅ All fields saved correctly
- ✅ Status is 'pending'
- ✅ Timestamps are correct

---

## Test 3: Admin Dashboard Login

### Steps:

1. **Navigate to admin page:**
   - Open: `http://localhost:3000/admin`

2. **Test invalid password:**
   - Enter wrong password
   - Click "Login"
   - Should show "Invalid password" error

3. **Login with correct password:**
   - Enter the password from your `.env.local` (`ADMIN_PASSWORD`)
   - Click "Login"
   - Should authenticate and show dashboard

### Expected Results:
- ✅ Login page displays correctly
- ✅ Invalid password shows error
- ✅ Correct password authenticates
- ✅ Dashboard loads after successful login

---

## Test 4: Admin Dashboard Features

### Test Statistics Cards:

1. Verify stats display:
   - Total applications count
   - Pending applications count
   - Approved applications count (should be 0 initially)
   - Rejected applications count (should be 0 initially)

### Test Search Functionality:

1. Enter applicant name in search box
2. Table should filter to show only matching applications
3. Clear search - all applications should appear again
4. Search by email - should work
5. Search by phone - should work

### Test Status Filter:

1. Click "Status" dropdown
2. Select "Pending" - should show only pending apps
3. Select "All Statuses" - should show all apps

### Test City Filter:

1. Click "City" dropdown
2. Select "Denver" - should show only Denver apps
3. Select "All Cities" - should show all apps

### Test Sorting:

1. Click "Date" column header - should sort by date
2. Click again - should reverse sort order (↑/↓ indicator)
3. Click "Name" column - should sort alphabetically
4. Click "City" column - should sort by city
5. Click "Status" column - should sort by status

### Test View Details:

1. Click "View Details" on any application
2. Modal should open showing:
   - Full application details
   - All applicant information
   - Brief intro message
   - Timestamps
   - Admin notes textarea
3. Close modal by clicking X or outside

### Test Status Updates:

1. Open an application detail modal
2. Add admin notes: `Test note - reviewing application`
3. Click "Approve" button
4. Modal should close
5. Application status should update to "Approved"
6. Green badge should display
7. Click "Refresh" to reload data
8. Status should persist

### Test Different Status Changes:

1. Open another application
2. Click "Reject" - status should change to "Rejected" (red badge)
3. Open it again
4. Click "Mark Pending" - status should change back to "Pending" (orange badge)

### Test Logout:

1. Click "Logout" button
2. Should return to login page
3. Session should be cleared
4. Navigating back to `/admin` should require login again

### Expected Results:
- ✅ All statistics display correctly
- ✅ Search filters applications properly
- ✅ Dropdown filters work
- ✅ Sorting works on all columns
- ✅ Application details modal opens/closes
- ✅ Status updates save successfully
- ✅ Admin notes save with status changes
- ✅ Refresh button reloads data
- ✅ Logout clears session

---

## Test 5: Multiple Applications

Submit 3-5 more test applications with different:
- Cities (Denver, Scottsdale, Miami)
- Names and emails
- Brief intro messages

Then verify in admin dashboard:
- All applications appear
- Sorting works correctly
- Filtering by city works
- Search finds correct applications
- Statistics update correctly

---

## Test 6: Responsive Design

Test on different screen sizes:

1. **Desktop (1920px):**
   - Layout should be wide with all columns visible
   - Admin table should be fully readable

2. **Tablet (768px):**
   - Mobile menu should appear in header
   - Admin table should scroll horizontally if needed
   - Filters should stack properly

3. **Mobile (375px):**
   - All content should be readable
   - Forms should be single column
   - Admin table should be usable with horizontal scroll
   - Buttons should be full-width

### Expected Results:
- ✅ All pages responsive
- ✅ No horizontal scroll on mobile (except tables)
- ✅ Touch targets are adequate size
- ✅ Text is readable on all devices

---

## Test 7: Error Handling

### Test Supabase Connection Error:

1. Temporarily change `NEXT_PUBLIC_SUPABASE_URL` in `.env.local` to invalid URL
2. Restart dev server
3. Try submitting application
4. Should show error message
5. Revert the URL and restart

### Test Admin Auth Error:

1. Login to admin dashboard
2. In another tab, go to Supabase and pause the project
3. Try updating an application status
4. Should handle error gracefully
5. Unpause Supabase project

### Expected Results:
- ✅ Errors are caught and displayed to user
- ✅ No silent failures
- ✅ Console shows useful error messages
- ✅ App doesn't crash

---

## Test 8: Browser Compatibility

Test in multiple browsers:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari

Verify:
- Forms work
- Styles render correctly
- Admin dashboard functions
- No console errors

---

## Test 9: Performance

Check performance:

1. Open DevTools → Network tab
2. Navigate to home page
3. Check load times
4. Navigate to `/apply`
5. Submit form and check request time
6. Login to admin
7. Check applications load time

### Expected Results:
- ✅ Home page loads < 2s
- ✅ Form submission < 1s
- ✅ Admin dashboard loads < 2s
- ✅ No unnecessary network requests

---

## Checklist Summary

After completing all tests, verify:

- [ ] Application form submits successfully
- [ ] Data appears in Supabase
- [ ] Form validation works correctly
- [ ] Thank you page displays
- [ ] Admin login works
- [ ] Admin dashboard displays all applications
- [ ] Search and filters work
- [ ] Sorting works on all columns
- [ ] Application details modal works
- [ ] Status updates save correctly
- [ ] Admin notes save correctly
- [ ] Logout clears session
- [ ] Responsive design works on mobile/tablet
- [ ] Error handling works
- [ ] No console errors
- [ ] Works in multiple browsers

---

## Troubleshooting

If tests fail, check:

1. **Console Errors:** Open browser DevTools → Console
2. **Network Tab:** Check for failed requests
3. **Supabase Logs:** View Supabase project logs
4. **Environment Variables:** Verify `.env.local` is correct
5. **Database Table:** Verify table exists and has correct structure

Refer to:
- [`README.md`](README.md) - Main documentation
- [`ENV_SETUP_INSTRUCTIONS.md`](ENV_SETUP_INSTRUCTIONS.md) - Environment setup
- [`DATABASE_SETUP_INSTRUCTIONS.md`](DATABASE_SETUP_INSTRUCTIONS.md) - Database setup

---

## Next Steps After Testing

Once all tests pass:

1. ✅ Deploy to Vercel (production testing)
2. ✅ Set up custom domain
3. ✅ Add production environment variables
4. ✅ Test production deployment
5. ✅ Set up monitoring/analytics (optional)
6. ✅ Configure email notifications (optional)

---

**Happy Testing! 🚀**





