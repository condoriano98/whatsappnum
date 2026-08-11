/* ============================================================
   hey Cia — a tiny WhatsApp "will you?" page
   ------------------------------------------------------------
   CONFIG: set SEND_TO to your own WhatsApp number (digits only,
   with country code, no +) so the final "Open WhatsApp" button
   starts a chat with YOU. Leave it "" to just open WhatsApp
   with a pre-filled message she can send.
   ============================================================ */
const SEND_TO = ""; // e.g. "6281234567890"
const NAME = "Cia";

/* A small, friendly set of country dial codes */
const COUNTRIES = [
  { flag: "🇮🇩", code: "62", label: "Indonesia" },
  { flag: "🇺🇸", code: "1", label: "USA / Canada" },
  { flag: "🇬🇧", code: "44", label: "UK" },
  { flag: "🇸🇬", code: "65", label: "Singapore" },
  { flag: "🇲🇾", code: "60", label: "Malaysia" },
  { flag: "🇦🇺", code: "61", label: "Australia" },
  { flag: "🇮🇳", code: "91", label: "India" },
  { flag: "🇵🇭", code: "63", label: "Philippines" },
  { flag: "🇩🇪", code: "49", label: "Germany" },
  { flag: "🇳🇱", code: "31", label: "Netherlands" },
  { flag: "🇦🇪", code: "971", label: "UAE" },
  { flag: "🇯🇵", code: "81", label: "Japan" },
];

/* --- element refs --- */
const $ = (id) => document.getElementById(id);
const stepAsk = $("step-ask");
const stepNumber = $("step-number");
const stepDone = $("step-done");
const yesBtn = $("yesBtn");
const noBtn = $("noBtn");
const teaser = $("teaser");
const form = $("phoneForm");
const countrySel = $("country");
const numberField = $("number");
const errorEl = $("error");
const waLink = $("waLink");
const doneNumber = $("doneNumber");
const restartBtn = $("restart");

/* --- populate country dropdown --- */
COUNTRIES.forEach((c, i) => {
  const opt = document.createElement("option");
  opt.value = c.code;
  opt.textContent = `${c.flag} +${c.code}`;
  opt.title = c.label;
  if (i === 0) opt.selected = true;
  countrySel.appendChild(opt);
});

/* --- step switching --- */
function showStep(el) {
  [stepAsk, stepNumber, stepDone].forEach((s) => {
    s.hidden = true;
    s.classList.remove("is-active");
  });
  el.hidden = false;
  el.classList.add("is-active");
}

/* ============================================================
   STEP 1 — the flirty "No" button that refuses to be clicked
   ============================================================ */
const teases = [
  "no pressure... okay, a little pressure 💚",
  "you sure? 👀",
  "the No button is shy, try again 😌",
  "come onnn 🥺",
  "it keeps running for a reason 😅",
  "yes is right there ➡️",
  "playing hard to get, huh? 💚",
];
let teaseIndex = 0;
let yesScale = 1;

function dodge() {
  // grow the yes button, shrink the mood of the no button
  yesScale = Math.min(yesScale + 0.12, 1.9);
  yesBtn.style.transform = `scale(${yesScale})`;

  teaseIndex = (teaseIndex + 1) % teases.length;
  teaser.textContent = teases[teaseIndex];

  // jump to a random on-screen spot
  const btn = noBtn;
  const pad = 12;
  const w = btn.offsetWidth;
  const h = btn.offsetHeight;
  const maxX = window.innerWidth - w - pad;
  const maxY = window.innerHeight - h - pad;
  const x = Math.max(pad, Math.floor(Math.random() * maxX));
  const y = Math.max(pad, Math.floor(Math.random() * maxY));

  btn.classList.add("dodging");
  btn.style.left = `${x}px`;
  btn.style.top = `${y}px`;
}

// dodge on hover (desktop) and on touch/click attempts (mobile)
noBtn.addEventListener("mouseenter", dodge);
noBtn.addEventListener("touchstart", (e) => { e.preventDefault(); dodge(); }, { passive: false });
noBtn.addEventListener("click", (e) => { e.preventDefault(); dodge(); });

yesBtn.addEventListener("click", () => {
  burst(18);
  showStep(stepNumber);
  setTimeout(() => numberField.focus(), 300);
});

/* ============================================================
   STEP 2 — collect + validate the number
   ============================================================ */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const dial = countrySel.value;
  const raw = numberField.value.replace(/[^\d]/g, "").replace(/^0+/, "");

  if (raw.length < 6 || raw.length > 14) {
    errorEl.hidden = false;
    numberField.focus();
    return;
  }
  errorEl.hidden = true;

  const full = `${dial}${raw}`;
  const pretty = `+${dial} ${raw}`;
  doneNumber.textContent = pretty;

  const msg = encodeURIComponent(`hey! it's ${NAME} — I moved to WhatsApp 💚`);
  waLink.href = SEND_TO
    ? `https://wa.me/${SEND_TO}?text=${msg}`
    : `https://wa.me/${full}?text=${encodeURIComponent("hey Cia 💚")}`;

  showStep(stepDone);
  celebrate();
});

/* live-clean input & clear error while typing */
numberField.addEventListener("input", () => {
  numberField.value = numberField.value.replace(/[^\d\s+-]/g, "");
  if (!errorEl.hidden) errorEl.hidden = true;
});

/* ============================================================
   STEP 3 — restart
   ============================================================ */
restartBtn.addEventListener("click", () => {
  form.reset();
  countrySel.selectedIndex = 0;
  yesScale = 1;
  yesBtn.style.transform = "";
  teaseIndex = 0;
  teaser.textContent = teases[0];
  noBtn.classList.remove("dodging");
  noBtn.style.left = noBtn.style.top = "";
  showStep(stepAsk);
});

/* ============================================================
   Confetti 🎉  (tiny self-contained canvas)
   ============================================================ */
const canvas = $("confetti");
const ctx = canvas.getContext("2d");
let pieces = [];
let raf = null;

function sizeCanvas() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
sizeCanvas();
window.addEventListener("resize", sizeCanvas);

const COLORS = ["#25d366", "#128c7e", "#075e54", "#dcf8c6", "#ffd166", "#ff6b9d"];

function burst(n = 40, originY = 0.35) {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight * originY;
  for (let i = 0; i < n; i++) {
    pieces.push({
      x: cx,
      y: cy,
      vx: (Math.random() - 0.5) * 9,
      vy: Math.random() * -9 - 3,
      g: 0.22 + Math.random() * 0.12,
      size: 6 + Math.random() * 7,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      life: 120 + Math.random() * 40,
    });
  }
  if (!raf) loop();
}

function celebrate() {
  burst(80, 0.3);
  setTimeout(() => burst(50, 0.25), 220);
  setTimeout(() => burst(50, 0.4), 440);
}

function loop() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  pieces.forEach((p) => {
    p.vy += p.g;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life--;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    ctx.restore();
  });
  pieces = pieces.filter((p) => p.life > 0 && p.y < window.innerHeight + 40);
  if (pieces.length) {
    raf = requestAnimationFrame(loop);
  } else {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    raf = null;
  }
}
