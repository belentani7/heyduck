export function mountLifecycle(bus, modules) {
  const mounted = [];
  const signal = document.querySelector(".duck-machine__signal");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  modules.forEach(({ id, mount, destroy }) => {
    const root = document.querySelector(`[data-duck-module="${id}"]`);
    if (!root) return;
    root.dataset.moduleState = "loading";
    try {
      mount(root, bus);
      root.dataset.moduleState = "ready";
      mounted.push({ id, root, destroy });
      bus.emit("module:ready", { id });
    } catch (error) {
      root.dataset.moduleState = "error";
      bus.emit("module:error", { id, message: error instanceof Error ? error.message : String(error) });
    }
  });

  function updateProgress() {
    const maximum = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const progress = Math.max(0, Math.min(1, scrollY / maximum));
    signal?.style.setProperty("--duck-progress", progress.toFixed(4));
    document.documentElement.dataset.duckProgress = progress.toFixed(3);
  }

  updateProgress();
  addEventListener("scroll", updateProgress, { passive: true });
  addEventListener("resize", updateProgress, { passive: true });
  bus.emit("system:ready", { modules: mounted.map(item => item.id), reducedMotion });

  return () => {
    removeEventListener("scroll", updateProgress);
    removeEventListener("resize", updateProgress);
    mounted.reverse().forEach(item => item.destroy?.());
  };
}
