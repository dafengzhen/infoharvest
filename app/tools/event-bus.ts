class EventBus extends EventTarget {
  emit(eventName: string, detail?: unknown) {
    this.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  off(eventName: string, callback: (event: Event) => void) {
    this.removeEventListener(eventName, callback);
  }

  on(eventName: string, callback: (event: Event) => void) {
    this.addEventListener(eventName, callback);
  }
}

export const eventBus = new EventBus();
