// src/app/shared/store/authModalStore.ts
type Reason = "manual" | "session_expired" | "required";

type Handlers = {
  loginSuccess: Array<() => void>;
  loginCancelled: Array<() => void>;
};

class AuthModalController {
  private _isOpen = false;
  private _reason: Reason = "manual";
  private handlers: Handlers = { loginSuccess: [], loginCancelled: [] };

  open(reason: Reason = "manual") {
    this._reason = reason;
    this._isOpen = true;
    this.notify(); // optional: event for subscribers
  }
  close() {
    this._isOpen = false;
    this.notify();
  }

  get isOpen() {
    return this._isOpen;
  }
  get reason() {
    return this._reason;
  }

  onLoginSuccess(cb: () => void) {
    this.handlers.loginSuccess.push(cb);
  }
  onLoginCancelled(cb: () => void) {
    this.handlers.loginCancelled.push(cb);
  }
  emitLoginSuccess() {
    this.handlers.loginSuccess.forEach(f => f());
  }
  emitLoginCancelled() {
    this.handlers.loginCancelled.forEach(f => f());
  }

  // Simple subscription for React components if you want; or use a tiny Zustand wrapper.
  private listeners: Array<() => void> = [];
  subscribe(fn: () => void) {
    this.listeners.push(fn);
    return () => (this.listeners = this.listeners.filter(x => x !== fn));
  }
  private notify() {
    this.listeners.forEach(fn => fn());
  }
}

export const authModal = new AuthModalController();
