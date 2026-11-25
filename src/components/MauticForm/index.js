import React, { useEffect } from "react";
import { translate } from "@docusaurus/Translate";

// reCAPTCHA v3 tokens expire after two minutes, but Mautic fetches one only
// when the form loads. Refresh it well before it expires.
const RECAPTCHA_REFRESH_MS = 90 * 1000;

// Mautic renders `<form id="mauticform_<name>">` and defines a global
// `onLoad_<name>()` that fetches a fresh token into the hidden field.
function refreshRecaptchaTokens(container) {
  if (!container || !window.grecaptcha) return;
  container.querySelectorAll('form[id^="mauticform_"]').forEach((form) => {
    const refresh = window[`onLoad_${form.id.replace(/^mauticform_/, "")}`];
    if (typeof refresh === "function") refresh();
  });
}

/**
 * Embedded Mautic form from hey.cardano.org, rendered by Mautic's script.
 *
 * @param {object} props
 * @param {number|string} props.id Mautic form id.
 */
function MauticForm({ id }) {
  const containerId = `mautic-form-container-${id}`;

  useEffect(() => {
    const existing = document.querySelector(`script[src*="form/generate.js?id=${id}"]`);
    if (!existing) {
      const script = document.createElement("script");
      script.src = `https://hey.cardano.org/form/generate.js?id=${id}`;
      script.type = "text/javascript";
      script.async = true;
      document.getElementById(containerId)?.appendChild(script);
    }
  }, [id, containerId]);

  useEffect(() => {
    const refresh = () => refreshRecaptchaTokens(document.getElementById(containerId));
    // Timers pause while a laptop sleeps, so also refresh when the tab comes back.
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    const timer = setInterval(refresh, RECAPTCHA_REFRESH_MS);
    document.addEventListener("visibilitychange", onVisible);

    // Mautic shows a terse "reCAPTCHA wasn't successful." and keeps the used
    // token, so a second submit fails too. Replace the message and fetch a new
    // token, so that submitting again works without a reload.
    const message = translate({
      id: "mauticForm.recaptchaError",
      message: "We couldn't confirm you're human. Please click Submit again. If it still fails, reload the page and try once more.",
    });
    const container = document.getElementById(containerId);
    const observer = new MutationObserver(() => {
      container.querySelectorAll('input[type="hidden"][name*="recaptcha"]').forEach((input) => {
        const error = input.closest(".mauticform-row")?.querySelector(".mauticform-errormsg");
        if (!error || error.style.display === "none") return;
        const text = error.textContent.trim();
        if (text && text !== message) {
          error.textContent = message;
          refresh();
        }
      });
    });
    if (container) {
      observer.observe(container, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["style"] });
    }

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      observer.disconnect();
    };
  }, [containerId]);

  return <div id={containerId} style={{ marginTop: "2rem" }} />;
}

export default MauticForm;
