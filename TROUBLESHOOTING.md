# Troubleshooting Guide

## Contact Form Issues

### Issue: "Nu s-a putut trimite mesajul" Error

**Cause**: The `contact_submissions` table doesn't exist in Supabase.

**Solution**:
1. Open `SETUP_CONTACT_TABLE.md`
2. Follow the instructions to create the table manually in Supabase SQL Editor
3. The form will work immediately after the table is created

### Issue: "Tabelul de contact nu este configurat corect"

**Cause**: Supabase schema cache can't find the table (error code PGRST205).

**Solutions**:
1. Verify the table exists: Run `SELECT * FROM public.contact_submissions;` in Supabase SQL Editor
2. If it doesn't exist, run the full SQL from `SETUP_CONTACT_TABLE.md`
3. If it exists but still shows the error, restart your Next.js dev server: `pkill -9 -f "next dev" && npm run dev`

### Issue: Admin Panel Shows "Nu există mesaje de contact"

**Possible Causes**:
1. No submissions have been made yet
2. Authentication issue
3. RLS policies blocking access

**Solutions**:
1. Try submitting a test message from the contact form
2. Check if you're logged in as admin
3. Verify RLS policies in Supabase:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'contact_submissions';
   ```

## Authentication Issues

### Issue: Redirected to Login After Refresh

**Cause**: Session cookies not persisting correctly.

**Solution**: Already fixed in the codebase. If still occurring:
1. Clear browser cookies for localhost
2. Restart the dev server
3. Log in again

### Issue: "User not allowed" When Creating Admin

**Cause**: Using anon key instead of service role key for admin operations.

**Solution**: Already fixed - `admin-utils.ts` now uses service role client.

## Image Upload Issues

### Issue: Images Not Loading

**Possible Causes**:
1. Supabase Storage bucket doesn't exist
2. Images not uploaded to Supabase
3. `next.config.ts` missing remote patterns

**Solutions**:
1. Run: `npm run upload-images` to upload images to Supabase Storage
2. Verify `next.config.ts` includes:
   ```typescript
   images: {
     remotePatterns: [
       {
         protocol: "https",
         hostname: "your-project-id.supabase.co",
         pathname: "/storage/v1/object/public/**",
       },
     ],
   }
   ```

## Database Issues

### Issue: "cms_snapshots" Table Not Found

**Solution**: Run `npm run seed` to create and seed the table.

### Issue: Artwork Images Missing

**Solution**:
1. Run `npm run upload-images` first
2. Then run `npm run seed`
3. Or run both: `npm run setup-all`

## Development Server Issues

### Issue: Port 3000 Already in Use

**Solution**:
```bash
pkill -9 -f "next dev"
npm run dev
```

### Issue: Changes Not Reflecting

**Solutions**:
1. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows/Linux)
2. Clear `.next` cache: `rm -rf .next && npm run dev`
3. Clear all caches: `rm -rf .next node_modules/.cache && npm run dev`

## Supabase Configuration Issues

### Issue: Environment Variables Not Loading

**Checklist**:
- [ ] `.env` file exists in project root
- [ ] All required variables are set (see `.env.example`)
- [ ] Variables starting with `NEXT_PUBLIC_` for client-side access
- [ ] Server restarted after changing `.env`

**Test**:
```bash
export $(cat .env | xargs) && env | grep SUPABASE
```

## Performance Issues

### Issue: Slow Image Loading

**Solutions**:
1. Images are compressed automatically using `browser-image-compression`
2. CDN caching is enabled in Supabase Storage
3. Consider adding `priority` prop to above-the-fold images

## Common Error Codes

- **PGRST116**: Table/row not found
- **PGRST205**: Table not in schema cache
- **23505**: Unique constraint violation (duplicate)
- **42P01**: Undefined table
- **42501**: Insufficient privilege (RLS policy issue)

## Getting Help

If none of these solutions work:

1. Check browser console for errors (F12)
2. Check Next.js terminal logs
3. Check Supabase logs: Dashboard → Logs → PostgreSQL Logs
4. Verify RLS policies: Dashboard → Database → Policies

