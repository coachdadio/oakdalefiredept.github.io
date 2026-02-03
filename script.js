// ====== SET YOUR LINKS HERE ======
const DONATE_URL = "https://example.com/donate"; // Replace with PayPal/Donorbox/Square link
const DEPT_EMAIL = "chief@oakdalefiredept.org"; // Replace with your real email
const NON_EMERGENCY_PHONE = "(423)369-3345";     // Replace
const MAILING_ADDRESS = "PO Box 247 Oakdale, TN 37829";            // Replace
// Option A: Formspree endpoint (recommended). Example: https://formspree.io/f/abcdwxyz
const FORMSPREE_ENDPOINT = ""; // leave blank to use mailto fallback

// ====== Wire up footer/header ======
document.getElementById("year").textContent = new Date().getFullYear();

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
setText("deptEmail", DEPT_EMAIL);
setText("nonEmergencyPhone", NON_EMERGENCY_PHONE);
setText("nonEmergencyPhone2", NON_EMERGENCY_PHONE);
setText("mailingAddress", MAILING_ADDRESS);

// Donate buttons
function setDonateLink(id){
  const el = document.getElementById(id);
  if (el) el.href = DONATE_URL;
}
setDonateLink("donateBtn");
setDonateLink("donateBtnMobile");
setDonateLink("donateBtnFooter");

// Mailto button
const mailto = `mailto:${encodeURIComponent(DEPT_EMAIL)}?subject=${encodeURIComponent("Oakdale VFD - Website Contact")}`;
const mailtoLink = document.getElementById("mailtoLink");
if (mailtoLink) mailtoLink.href = mailto;

// Mobile menu toggle
const toggle = document.querySelector(".nav-toggle");
const mobileNav = document.getElementById("mobileNav");
if (toggle && mobileNav) {
  toggle.addEventListener("click", () => {
    const isOpen = !mobileNav.hasAttribute("hidden");
    if (isOpen) {
      mobileNav.setAttribute("hidden", "");
      toggle.setAttribute("aria-expanded", "false");
    } else {
      mobileNav.removeAttribute("hidden");
      toggle.setAttribute("aria-expanded", "true");
    }
  });

  // Close mobile nav when clicking a link
  mobileNav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      mobileNav.setAttribute("hidden", "");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ====== Smoke alarm form submit ======
const form = document.getElementById("smokeAlarmForm");
const statusEl = document.getElementById("formStatus");

function setStatus(msg, isError=false) {
  if (!statusEl) return;
  statusEl.textContent = msg;
  statusEl.style.color = isError ? "rgba(255,120,120,.95)" : "rgba(200,220,255,.95)";
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());

    // Option A: Formspree (no backend)
    if (FORMSPREE_ENDPOINT && FORMSPREE_ENDPOINT.startsWith("https://")) {
      try {
        setStatus("Sending...");
        const resp = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { "Accept": "application/json" },
          body: new FormData(form)
        });

        if (resp.ok) {
          form.reset();
          setStatus("Request sent. We will contact you to schedule.");
        } else {
          setStatus("Could not send right now. Please try again or email us.", true);
        }
      } catch (err) {
        setStatus("Network error. Please try again or email us.", true);
      }
      return;
    }

    // Option B: mailto fallback
    const subject = "Smoke Alarm Installation Request";
    const body = [
      "Smoke Alarm Installation Request",
      "------------------------------",
      `Name: ${data.name || ""}`,
      `Phone: ${data.phone || ""}`,
      `Email: ${data.email || ""}`,
      `Address: ${data.address || ""}`,
      `Preferred time: ${data.preferred || ""}`,
      `Notes: ${data.notes || ""}`,
      "",
      "Sent from oakdalefiredept.org"
    ].join("\n");

    window.location.href =
      `mailto:${encodeURIComponent(DEPT_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setStatus("Opening your email app to send the request...");
  });
}
