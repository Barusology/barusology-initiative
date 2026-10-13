import { SITE, GOOGLE_FORM } from "./config.js";

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------- header state ---------------- */
const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 12);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* ---------------- mobile nav ---------------- */
const nav = document.getElementById("nav");
const navToggle = document.getElementById("nav-toggle");
if (navToggle) {
    navToggle.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", () => {
            nav.classList.remove("open");
            navToggle.setAttribute("aria-expanded", "false");
        }),
    );
}

/* ---------------- scroll reveal ---------------- */
const revealables = document.querySelectorAll(".reveal");
if (reduced || !("IntersectionObserver" in window)) {
    revealables.forEach((el) => el.classList.add("in"));
} else {
    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
                if (!e.isIntersecting) return;
                e.target.classList.add("in");
                io.unobserve(e.target);
            });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    revealables.forEach((el) => io.observe(el));
}

/* ---------------- count-up figures ---------------- */
const figures = document.querySelectorAll("[data-count]");
const runCount = (el) => {
    const to = Number(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    if (reduced) {
        el.textContent = to.toLocaleString() + suffix;
        return;
    }
    const start = performance.now();
    const dur = 1250;
    const tick = (now) => {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 4);
        el.textContent = Math.round(to * eased).toLocaleString() + suffix;
        if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
};
if (!("IntersectionObserver" in window)) {
    figures.forEach(runCount);
} else {
    const co = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
                if (!e.isIntersecting) return;
                runCount(e.target);
                co.unobserve(e.target);
            });
        },
        { threshold: 0.5 },
    );
    figures.forEach((el) => co.observe(el));
}

/* ---------------- cursor spotlight on cards ---------------- */
if (!reduced && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".card").forEach((card) => {
        card.addEventListener("pointermove", (e) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
            card.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
        });
    });
}

/* ---------------- footer year ---------------- */
document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
});

/* ============================================================
   Contact form
   Posts silently into a Google Form via a hidden iframe so the
   visitor never leaves the page. Falls back to a pre-filled
   email until config.js carries a real Form action.
   ============================================================ */
const form = document.getElementById("contact-form");

if (form) {
    const status = document.getElementById("form-status");
    const formReady = Boolean(
        GOOGLE_FORM.action &&
            Object.values(GOOGLE_FORM.entries).every(Boolean),
    );

    const showStatus = (kind, text) => {
        status.className = `form-status show ${kind}`;
        status.querySelector("span").textContent = text;
    };

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const validate = () => {
        let ok = true;
        form.querySelectorAll("[data-required]").forEach((input) => {
            const field = input.closest(".field");
            const value = input.value.trim();
            const bad =
                !value ||
                (input.type === "email" && !EMAIL_RE.test(value));
            field.classList.toggle("invalid", bad);
            if (bad) ok = false;
        });
        return ok;
    };

    form.querySelectorAll("input, select, textarea").forEach((el) => {
        el.addEventListener("input", () => {
            el.closest(".field")?.classList.remove("invalid");
        });
    });

    /* builds the payload once, reused by both submit paths */
    const payload = () => {
        const data = new FormData(form);
        return {
            name: (data.get("name") || "").toString().trim(),
            email: (data.get("email") || "").toString().trim(),
            company: (data.get("company") || "").toString().trim(),
            service: (data.get("service") || "").toString(),
            budget: (data.get("budget") || "").toString(),
            message: (data.get("message") || "").toString().trim(),
        };
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!validate()) {
            showStatus(
                "bad",
                "Please fill the highlighted fields — a valid email lets us reply.",
            );
            form.querySelector(".invalid input, .invalid select, .invalid textarea")?.focus();
            return;
        }

        const values = payload();

        if (!formReady) {
            const body = [
                `Name: ${values.name}`,
                `Email: ${values.email}`,
                `Company / Startup: ${values.company || "—"}`,
                `Service needed: ${values.service || "—"}`,
                `Budget: ${values.budget || "—"}`,
                "",
                values.message,
            ].join("\n");
            window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
                `New project enquiry — ${values.service || "Barusology Initiative"}`,
            )}&body=${encodeURIComponent(body)}`;
            showStatus(
                "warn",
                `Your email app should be opening with the details filled in. The site is not wired to a Google Form yet — add the Form URL in js/config.js to collect leads automatically.`,
            );
            return;
        }

        form.classList.add("is-busy");
        const frameName = "bf-sink";
        let frame = document.getElementById(frameName);
        if (!frame) {
            frame = document.createElement("iframe");
            frame.name = frameName;
            frame.id = frameName;
            frame.setAttribute("aria-hidden", "true");
            frame.tabIndex = -1;
            frame.style.cssText =
                "position:absolute;width:0;height:0;border:0;opacity:0";
            document.body.appendChild(frame);
        }

        const poster = document.createElement("form");
        poster.action = GOOGLE_FORM.action;
        poster.method = "POST";
        poster.target = frameName;
        poster.style.display = "none";
        Object.entries(GOOGLE_FORM.entries).forEach(([key, entryId]) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = entryId;
            input.value = values[key] || "";
            poster.appendChild(input);
        });
        /* optional extra question: which page the lead came from */
        if (GOOGLE_FORM.entries.source) {
            const origin = document.createElement("input");
            origin.type = "hidden";
            origin.name = GOOGLE_FORM.entries.source;
            origin.value = window.location.href;
            poster.appendChild(origin);
        }

        document.body.appendChild(poster);
        poster.submit();
        poster.remove();

        window.setTimeout(() => {
            form.classList.remove("is-busy");
            form.reset();
            showStatus(
                "ok",
                "Thanks — your enquiry is in. Expect a reply within one business day.",
            );
        }, 1200);
    });
}
