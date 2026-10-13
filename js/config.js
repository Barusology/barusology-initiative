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
   WHY `enabled` IS STILL false
   ------------------------------------------------------------
   The live form currently renders these attributes:

     data-sign-in-to-continue="true"
     data-email-from-recipient-required="true"

   That means it is set to collect the respondent's Google email
   and require a signed-in account. POSTing to /formResponse
   anonymously therefore does not record a response — Google
   answers 302 -> accounts.google.com/ServiceLogin?service=wise
   and then 401, exactly what we measured. Because the post
   happens in a hidden iframe, a visitor would see "thanks, we'll
   be in touch" while nothing reaches the sheet.

   To turn real submissions on, in Google Forms:

     Settings → Responses → Collect email addresses → Do not collect
     Settings → Responses → turn OFF "Only allow respondents
                     within my domain and organization"
     Responses → ⋮ → Confirm "Accepting responses" is on

   Then flip `enabled` below to true. Re-check without submitting
   anything: the viewform page should no longer contain
   data-sign-in-to-continue="true".

   While `enabled` is false the site uses its mailto: fallback, so
   enquiries still arrive — just by email instead of in the sheet.
   ------------------------------------------------------------ */
export const GOOGLE_FORM = {
    enabled: false,
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

