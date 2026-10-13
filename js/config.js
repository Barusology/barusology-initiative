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
   GOOGLE FORM — "Contact information"
   ------------------------------------------------------------
   Live form. The `action` is the /formResponse endpoint of the
   public viewform link; entry ids below were read out of the
   form's own FB_PUBLIC_LOAD_DATA_ schema, in question order:

     Name            short text   REQUIRED   entry.544302269
     Address         paragraph    REQUIRED   entry.1065046570
     Email           short text   REQUIRED   entry.1045781291
     Phone number    short text   optional   entry.1166974658
     Company/Startup short text   optional   entry.1510456028
     Service Needed  CHECKBOX     REQUIRED   entry.1092678833
     Project Details paragraph    optional   entry.2078994464
     Budget          paragraph    optional   entry.2081903089
     Comments        paragraph    optional   entry.839337160

   Two things about this list are easy to get wrong:

   1. Address is REQUIRED. Google silently refuses a POST that
      omits a required question — the row never reaches the
      sheet and the visitor still sees "thanks". The site asks
      for it as "Where are you based?".

   2. Service Needed is a checkbox, not a dropdown, so it takes
      one repeated entry.1092678833 per ticked box and only the
      exact stored labels are valid: "Mobile App",
      "Ai Automation", "Digital Product". Anything else fails
      validation the same way an empty answer does. The labels
      live in contact.html as option values; the friendlier
      wording a visitor reads is the label text beside it.

   Phone number and Comments are collected by the form but not
   by the site — leaving them out is valid, they are optional.

   ------------------------------------------------------------
   `enabled` — the anonymous-submission gate
   ------------------------------------------------------------
   Submissions were silently failing until the form stopped
   requiring a signed-in respondent. When it did, an anonymous POST
   to /formResponse returned 302 -> ServiceLogin?service=wise then
   401, and because the post runs in a hidden iframe the visitor saw
   "thanks" while no row reached the sheet.

   Fixed on the form side: Collect email addresses → Do not collect,
   plus "Limit to 1 response" off. Verified with a zero-write probe —
   the viewform page no longer renders data-sign-in-to-continue, and
   an empty POST now returns 400 with Google's own "This is a required
   question" page, which proves the request got as far as validation.

   If leads ever stop arriving, re-run that probe before touching this
   file; a 401 here means the setting has been switched back on
   (usually by a Workspace policy), not that the code broke:

     curl -s <viewform URL> | grep -c 'data-sign-in-to-continue="true"'

   Set `enabled` back to false to fall open onto the mailto: path,
   which still delivers enquiries — just by email instead of in the
   sheet.
   ------------------------------------------------------------ */
export const GOOGLE_FORM = {
    enabled: true,
    action:
        "https://docs.google.com/forms/d/e/1FAIpQLSdyAxLybRMU9oh44Fjz81ZR5Nlfrk3WO0UyGfvSVJC6p9fYRQ/formResponse",
    entries: {
        name: "entry.544302269",
        address: "entry.1065046570",
        email: "entry.1045781291",
        company: "entry.1510456028",
        service: "entry.1092678833",
        message: "entry.2078994464",
        budget: "entry.2081903089",
    },
};

