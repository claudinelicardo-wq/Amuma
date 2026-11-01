import { friendlyAuthError } from '../api';

jest.mock('@/lib/supabase', () => ({ supabase: {} }));
jest.mock('@/lib/env', () => ({ isSupabaseConfigured: true, env: {} }));

describe('friendlyAuthError', () => {
  it.each([
    ['Invalid login credentials', 'do not match'],
    ['User already registered', 'already exists'],
    ['Email not confirmed', 'confirm your email'],
    ['email rate limit exceeded', 'Too many'],
    ['Network request failed', 'connection'],
    ['database exploded: select * from secrets', 'Something went wrong'],
  ])('maps %s', (raw, expected) => {
    expect(friendlyAuthError(raw)).toContain(expected);
  });
  it('never leaks raw backend text', () => {
    expect(friendlyAuthError('pg error 42501 row-level security')).not.toMatch(/42501|row-level/);
  });
});
