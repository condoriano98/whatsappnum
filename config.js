/* ============================================================
   Config — edit these, nothing else.
   ============================================================ */
window.APP_CONFIG = {
  /* Who the page is asking */
  NAME: "Cia",

  /* Where the "Open WhatsApp" button goes.
     This is YOUR number, so she lands straight in a chat with you. */
  WHATSAPP_URL:
    "https://api.whatsapp.com/send/?phone=6285244054540&text=hey+Cia+%F0%9F%92%9A&type=phone_number&app_absent=0",

  /* Supabase — publishable (anon) key is safe in the browser.
     The submissions table is insert-only for the public: numbers can be
     written, but never read back through this key. */
  SUPABASE_URL: "https://izibwdzlrbdzfcihsphs.supabase.co",
  SUPABASE_KEY: "sb_publishable_4xawL8H-8xy3pNtGNErlYA_yzceTurW",
  SUPABASE_TABLE: "submissions",
};
