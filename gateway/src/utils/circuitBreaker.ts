type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';
type AsyncFunction<T> = () => Promise<T>;

export class CircuitBreaker<T> {
  private failureCount: number = 0;
  private successCount: number = 0;
  private lastFailureTime: number | null = null;
  private state: CircuitState = 'CLOSED';
  private pendingRequests: number = 0;
  private readonly maxPendingRequests: number;

  constructor(
      private readonly threshold: number = 5,
      private readonly timeout: number = 60000,
      private readonly fallback?: () => Promise<T> | T,
      options: {
        maxPendingRequests?: number;
        halfOpenMaxRequests?: number;
      } = {}
  ) {
    this.maxPendingRequests = options.maxPendingRequests || 10;
  }

  async call(fn: AsyncFunction<T>): Promise<T> {
    if (this.state === 'OPEN') {
      // Check if timeout has elapsed for transition to HALF_OPEN
      if (this.lastFailureTime && Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        return this.handleFallback('Circuit breaker is OPEN');
      }
    }

    // Check for too many pending requests (bulkhead pattern)
    if (this.pendingRequests >= this.maxPendingRequests) {
      return this.handleFallback('Too many pending requests');
    }

    this.pendingRequests++;
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error; // Re-throw after handling so caller knows about the failure
    } finally {
      this.pendingRequests--;
    }
  }

  private onSuccess(): void {
    this.successCount++;
    this.failureCount = 0;

    if (this.state === 'HALF_OPEN') {
      // If we got a success in HALF_OPEN state, return to CLOSED
      this.state = 'CLOSED';
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    this.successCount = 0;

    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
    } else if (this.state === 'HALF_OPEN') {
      // If HALF_OPEN request fails, go back to OPEN
      this.state = 'OPEN';
    }
  }

  private async handleFallback(reason: string): Promise<T> {
    if (this.fallback) {
      console.warn(`Circuit breaker: ${reason}. Using fallback.`);
      return this.fallback();
    }
    throw new Error(`Circuit breaker: ${reason} and no fallback provided`);
  }

  // Additional useful methods
  getState(): CircuitState {
    return this.state;
  }

  getMetrics() {
    return {
      failures: this.failureCount,
      successes: this.successCount,
      state: this.state,
      lastFailure: this.lastFailureTime,
      pendingRequests: this.pendingRequests
    };
  }
}