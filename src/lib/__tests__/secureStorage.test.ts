import { secureStorage } from '../secureStorage';

const mockMem = new Map<string, string>();
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async (k: string) => mockMem.get(k) ?? null),
  setItemAsync: jest.fn(async (k: string, v: string) => { mockMem.set(k, v); }),
  deleteItemAsync: jest.fn(async (k: string) => { mockMem.delete(k); }),
}));
jest.mock('@react-native-async-storage/async-storage', () => ({ __esModule: true, default: {} }));

beforeEach(() => mockMem.clear());

describe('secureStorage', () => {
  it('round-trips a value larger than the SecureStore limit using chunks', async () => {
    const big = 'x'.repeat(5000) + 'END';
    await secureStorage.setItem('sb', big);
    expect([...mockMem.values()].every((v) => v.length <= 1800)).toBe(true);
    expect(await secureStorage.getItem('sb')).toBe(big);
  });
  it('returns null when nothing is stored', async () => {
    expect(await secureStorage.getItem('missing')).toBeNull();
  });
  it('overwrites without leaving stale chunks', async () => {
    await secureStorage.setItem('sb', 'y'.repeat(4000));
    await secureStorage.setItem('sb', 'short');
    expect(await secureStorage.getItem('sb')).toBe('short');
    expect(mockMem.size).toBe(2); // one chunk + count
  });
  it('removeItem deletes all chunks', async () => {
    await secureStorage.setItem('sb', 'z'.repeat(4000));
    await secureStorage.removeItem('sb');
    expect(mockMem.size).toBe(0);
    expect(await secureStorage.getItem('sb')).toBeNull();
  });
  it('treats a partially written value as signed out', async () => {
    await secureStorage.setItem('sb', 'q'.repeat(4000));
    mockMem.delete('sb.1');
    expect(await secureStorage.getItem('sb')).toBeNull();
  });
});
