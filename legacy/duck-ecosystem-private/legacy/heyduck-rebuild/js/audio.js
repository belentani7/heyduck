/**
 * DUCK - Audio Player Module v2.0
 * Sound pad with play/pause/restart controls
 */

function initAudioPad() {
  const audio = new Audio("audio/duck.mp3");
  audio.preload = "auto";

  const pad1 = document.getElementById("duckPad1");
  const pad2 = document.getElementById("duckPad2");
  const pad3 = document.getElementById("duckPad3");

  if (!pad1 || !pad2 || !pad3) return;

  function clearActive() {
    pad1.classList.remove("playing");
    pad2.classList.remove("playing");
    pad3.classList.remove("playing");
  }

  // DUCK - Restart from beginning
  pad1.addEventListener("click", () => {
    audio.currentTime = 0;
    audio.play().catch(() => {});
    clearActive();
    pad1.classList.add("playing");
  });

  // PLAY - Continue/resume
  pad2.addEventListener("click", () => {
    audio.play().catch(() => {});
    clearActive();
    pad2.classList.add("playing");
  });

  // STOP - Pause and reset
  pad3.addEventListener("click", () => {
    audio.pause();
    audio.currentTime = 0;
    clearActive();
    pad3.classList.add("playing");
    setTimeout(() => pad3.classList.remove("playing"), 300);
  });

  // Auto-clear on ended
  audio.addEventListener("ended", () => {
    clearActive();
  });
}
