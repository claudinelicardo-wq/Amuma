import { signInSchema, signUpSchema } from '../schemas';

const valid = {
  displayName: 'Ana', email: ' Ana@Example.com ', password: 'longenough1',
  confirmPassword: 'longenough1', acceptedPrivacy: true,
};

describe('signUpSchema', () => {
  it('accepts valid input and normalizes email', () => {
    const r = signUpSchema.safeParse(valid);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.email).toBe('ana@example.com');
  });
  it('requires no health information and allows empty name', () => {
    expect(signUpSchema.safeParse({ ...valid, displayName: undefined }).success).toBe(true);
  });
  it('rejects short passwords', () => {
    expect(signUpSchema.safeParse({ ...valid, password: 'short', confirmPassword: 'short' }).success).toBe(false);
  });
  it('rejects mismatched passwords on confirmPassword', () => {
    const r = signUpSchema.safeParse({ ...valid, confirmPassword: 'different123' });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0].path).toEqual(['confirmPassword']);
  });
  it('requires privacy acceptance', () => {
    expect(signUpSchema.safeParse({ ...valid, acceptedPrivacy: false }).success).toBe(false);
  });
  it('rejects invalid email', () => {
    expect(signUpSchema.safeParse({ ...valid, email: 'nope' }).success).toBe(false);
  });
});

describe('signInSchema', () => {
  it('requires email and password', () => {
    expect(signInSchema.safeParse({ email: 'a@b.co', password: '' }).success).toBe(false);
    expect(signInSchema.safeParse({ email: 'a@b.co', password: 'x' }).success).toBe(true);
  });
});
