const EVENT_PREFIX = "duck:";
const EVENT_GROUPS = [
  ["duck:identity:change", "duck:identity"],
  ["duck:production", "duck:process-output"],
  ["duck:sonic-output", "duck:module:04:output", "duck:lab:output"]
];

const EVENT_ALIASES = new Map(
  EVENT_GROUPS.flatMap(group => group.map(name => [name, group.filter(alias => alias !== name)]))
);

export function createDuckBus(target = document) {
  const state = new Map();
  const subscriptions = new Set();

  function emit(name, detail = {}) {
    const eventName = name.startsWith(EVENT_PREFIX) ? name : `${EVENT_PREFIX}${name}`;
    return dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  function dispatchEvent(event) {
    const names = [event.type, ...(EVENT_ALIASES.get(event.type) ?? [])];
    names.forEach(name => {
      state.set(name, structuredCloneSafe(event.detail));
      target.dispatchEvent(new CustomEvent(name, { detail: event.detail }));
    });
    target.documentElement?.setAttribute("data-duck-last-event", event.type.replace(EVENT_PREFIX, ""));
    return true;
  }

  function on(name, listener, options) {
    const eventName = name.startsWith(EVENT_PREFIX) ? name : `${EVENT_PREFIX}${name}`;
    const wrapped = event => listener(event.detail, event);
    target.addEventListener(eventName, wrapped, options);
    const unsubscribe = () => target.removeEventListener(eventName, wrapped, options);
    subscriptions.add(unsubscribe);
    return () => { unsubscribe(); subscriptions.delete(unsubscribe); };
  }

  function read(name) {
    const eventName = name.startsWith(EVENT_PREFIX) ? name : `${EVENT_PREFIX}${name}`;
    return state.get(eventName);
  }

  function destroy() {
    subscriptions.forEach(unsubscribe => unsubscribe());
    subscriptions.clear();
    state.clear();
  }

  return Object.freeze({
    emit,
    on,
    read,
    destroy,
    dispatchEvent,
    addEventListener: target.addEventListener.bind(target),
    removeEventListener: target.removeEventListener.bind(target)
  });
}

function structuredCloneSafe(value) {
  if (typeof structuredClone === "function") {
    try { return structuredClone(value); } catch { return value; }
  }
  return value;
}
