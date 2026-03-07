export async function simulateRequest<T>(value: T, delay = 200): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), delay);
  });
}
