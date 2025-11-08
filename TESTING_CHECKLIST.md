# SQLite Migration Testing Checklist

This checklist should be completed after the PostgreSQL to SQLite migration is complete.

## Automated Testing

### Run Database Tests

```bash
bun run db:test
```

- [ ] All database operation tests pass
- [ ] Row counts displayed correctly
- [ ] Authentication tables accessible
- [ ] Array fields (JSON) parsed correctly
- [ ] User extended fields accessible

## Manual Testing Checklist

### Authentication Flow

- [ ] User can register with email/password
- [ ] User receives verification email (if configured)
- [ ] User can log in with correct credentials
- [ ] User cannot log in with incorrect credentials
- [ ] User can log out successfully
- [ ] Session persists across page reloads
- [ ] Logged-in state is maintained in database

### Onboarding Flow

- [ ] Onboarding form displays correctly
- [ ] All dietary preference fields work
- [ ] Physical stats fields (height, weight) save correctly
- [ ] Date of birth picker works
- [ ] Activity level selection saves
- [ ] Onboarding completion status updates
- [ ] User redirected to dashboard after onboarding

### Recipe Management

- [ ] User can view recipe list
- [ ] Recipe search filters work correctly
- [ ] Recipe sorting (newest, rating) works
- [ ] Recipe details display all fields correctly
- [ ] Ingredients array displays as comma-separated list
- [ ] Instructions array displays as numbered list
- [ ] Recipe images load correctly

### Recipe Generation (AI Chef)

- [ ] Chat interface loads
- [ ] User can send prompts to AI chef
- [ ] AI generates recipe correctly
- [ ] Generated recipe includes all required fields
- [ ] Recipe ingredients array is properly formatted
- [ ] Recipe instructions array is properly formatted
- [ ] User can accept/confirm generated recipe

### Recipe Persistence

- [ ] Generated recipes save to database
- [ ] Saved recipes appear in recipe list
- [ ] Recipe data loads correctly on detail page
- [ ] All fields persist (ingredients, instructions, metadata)
- [ ] Images persist after page reload

### File Uploads

- [ ] Recipe image upload works
- [ ] Images are stored in correct location (`uploads/recipes/[userId]/`)
- [ ] Image URLs are stored in database
- [ ] Images display on recipe pages
- [ ] Multiple recipes can have different images

### Database Performance

- [ ] App starts quickly
- [ ] Database queries complete in <100ms
- [ ] Large queries (100+ recipes) load smoothly
- [ ] No "database locked" errors during use
- [ ] Concurrent operations work (multiple tabs)

### Edge Cases

- [ ] Special characters in recipe names work
- [ ] Long ingredient lists (100+) handle correctly
- [ ] Long instruction lists (100+) handle correctly
- [ ] Unicode characters in text fields work
- [ ] Empty optional fields don't cause errors

### Error Handling

- [ ] Graceful error messages for failed operations
- [ ] Database errors don't crash the app
- [ ] Failed uploads show helpful messages
- [ ] Network errors are handled appropriately

## Production Readiness

### Deployment

- [ ] `DATABASE_URL` environment variable is set correctly
- [ ] Database file location is writable by app user
- [ ] Backup script runs successfully: `scripts/backup-sqlite.sh`
- [ ] Backup creates valid SQLite files
- [ ] Systemd service starts correctly: `systemctl start meal-prep-ai`

### Monitoring

- [ ] No console errors in production
- [ ] Database size is reasonable (<1GB)
- [ ] WAL checkpoint runs hourly without issues
- [ ] App responds to requests consistently
- [ ] CPU/Memory usage is acceptable

## Notes

- If any test fails, document the error and check the browser console
- For database issues, verify `DATABASE_URL` environment variable
- WAL mode allows concurrent reads during writes - expect this behavior
- Check database file exists: `file $DATABASE_URL | replace 'file:'`
- Database performance depends on index usage - run `db:generate` after schema changes

## Completion

Date Completed: **\*\***\_\_\_**\*\***
Tested By: **\*\***\_\_\_**\*\***
All Tests Passed: [ ] Yes [ ] No

Comments:

---
