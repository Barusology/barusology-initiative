/* ============================================================
   Barusology Initiative — site config
   The only file you need to edit to go live.
   ============================================================ */

export const SITE = {
    name: "Barusology Initiative",
    /* REPLACE with the address that should receive enquiries */
    email: "hello@barusologyinitiative.com",
    /* optional — leave "" to hide from the footer */
    whatsapp: "",
    location: "Remote · working with founders worldwide",
};

/* ------------------------------------------------------------
   GOOGLE FORM
   ------------------------------------------------------------
   A browser cannot write straight into a Google Sheet — Google
   Forms is the service that does the writing, and it can be
   pointed at your existing spreadsheet:

     1. forms.google.com → Blank form
     2. Add these 6 questions (exact wording does not matter,
        but keep them in this order and all "Required" off):
            Name (Short answer)
            Email (Short answer)
            Company / Startup (Short answer)
            Service needed (Dropdown)
            Budget (Dropdown)
            Project details (Paragraph)
     3. Responses tab → ⋮ (top right) → Select response
        destination → Existing spreadsheet → pick
        "Barusology Initiative" sheet.
     4. ⋮ (top right of the form editor) → Send → </> (embed)
        → copy the URL in src="..." up to /formResponse.
        That is your `action`.
     5. Still needed: each question has an internal id like
        entry.1234567890. Open the live form in a new tab,
        right-click → View page source, find each question's
        name="entry.…" and paste it below.

   Until `action` is filled in the contact form falls back to
   opening a pre-filled email, so the site is never dead.
   ------------------------------------------------------------ */
export const GOOGLE_FORM = {
    action: "",
    entries: {
        name: "",
        email: "",
        company: "",
        service: "",
        budget: "",
        message: "",
    },
};
