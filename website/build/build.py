"""Writes the five static pages of the SeeSight marketing site into website/.

Usage (from the website/ folder):  python3 build/build.py
"""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from partials import (  # noqa: E402
    ARROW, benefit_cards, browser, cta_band, demo_btn, faq, icon,
    logo_marquee, page, phone, steps,
)

OUT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def feature_blocks(items):
    """Revolut-style alternating text + screen blocks."""
    out = []
    for i, (num, title, lead, visual, tone) in enumerate(items):
        out.append(f"""<div class="feature">
      <div class="reveal">
        <span class="num-tag">{num}</span>
        <h3>{title}</h3>
        <p class="lead">{lead}</p>
      </div>
      <div class="feature-visual {tone} reveal" style="--d:.1s">{visual}</div>
    </div>""")
    return "".join(out)


# =====================================================================
# Home
# =====================================================================
home = f"""
<section class="hero hero-center">
  <div class="wrap">
    <span class="eyebrow reveal">Business travel expenses</span>
    <h1 class="display reveal" style="--d:.05s">Travel for work. <span class="serif">Not</span> for paperwork.</h1>
    <p class="lead reveal" style="--d:.1s">SeeSight removes the hidden financial stress of business travel. Add a receipt, SeeSight reads it,
      and your assigned accountant decides. Everyone always knows where a claim stands.</p>
    <div class="actions reveal" style="--d:.15s">
      {demo_btn(cls="btn btn-lg")}
      <a class="link-arrow" href="how-it-works.html">See how it works{ARROW}</a>
    </div>
    <div class="stage reveal" style="--d:.2s">
      {browser("web-1-overview", eager=True)}
      {phone("phone-1-receipt", eager=True)}
    </div>
  </div>
  {logo_marquee()}
</section>

<section class="section" aria-labelledby="problem-title">
  <div class="wrap problem">
    <div class="reveal">
      <span class="eyebrow">The problem</span>
      <h2 class="h2" id="problem-title" style="margin-top:18px">Travelers pay first and <span class="serif">hope</span> later.</h2>
      <p class="lead" style="margin-top:22px">Business travel quietly costs the people who do it. The process around it is the problem, and that is what SeeSight fixes.</p>
    </div>
    <ol class="pain-list reveal" style="--d:.1s">
      <li><span class="num">01</span><div><h3>Personal cards, company costs</h3><p>Flights, hotels and taxis often go on the traveler's own card.</p></div></li>
      <li><span class="num">02</span><div><h3>Weeks of waiting</h3><p>Repayment can take weeks, with no clear view of where the claim is.</p></div></li>
      <li><span class="num">03</span><div><h3>Lost receipts</h3><p>Paper slips go missing between the trip and the expense report.</p></div></li>
      <li><span class="num">04</span><div><h3>Unclear rules</h3><p>Travelers don't know the limits until something gets rejected.</p></div></li>
    </ol>
  </div>
</section>

<section class="section" aria-labelledby="roles-title">
  <div class="wrap">
    <div class="section-head center reveal">
      <span class="eyebrow">Built for every role</span>
      <h2 class="h2" id="roles-title">One flow. Three points of view.</h2>
      <p class="lead">Travelers, accountants and the company each get exactly what they need, and nothing they don't.</p>
    </div>
    <div class="tabs reveal" data-tabs>
      <div class="tablist" role="tablist" aria-label="Choose a role">
        <span class="tab-ind" aria-hidden="true"></span>
        <button class="tab" role="tab" id="tab-trav" aria-controls="panel-trav" aria-selected="true">Travelers</button>
        <button class="tab" role="tab" id="tab-acc" aria-controls="panel-acc" aria-selected="false" tabindex="-1">Accountants</button>
        <button class="tab" role="tab" id="tab-co" aria-controls="panel-co" aria-selected="false" tabindex="-1">Companies</button>
      </div>

      <div class="tabpanel" role="tabpanel" id="panel-trav" aria-labelledby="tab-trav" tabindex="0">
        <div>
          <h3>No receipt chaos. No guessing.</h3>
          <p class="lead">Snap a receipt in the phone browser. SeeSight builds the expense, warns you before you send, and shows the status at every step.</p>
          <ul class="checks">
            <li>Works in the phone browser, no app to install</li>
            <li>Over-limit and duplicate expenses flagged before sending</li>
            <li>Per diem and lost receipts in the same flow</li>
          </ul>
          <div class="actions" style="margin-top:28px"><a class="link-arrow" href="travelers.html">For travelers{ARROW}</a></div>
        </div>
        <div class="tab-visual">{phone("phone-2-claim")}</div>
      </div>

      <div class="tabpanel" role="tabpanel" id="panel-acc" aria-labelledby="tab-acc" tabindex="0" hidden>
        <div>
          <h3>One queue. Rules set once.</h3>
          <p class="lead">Every claim from your assigned travelers lands in one queue, already checked against your rules.</p>
          <ul class="checks">
            <li>Search and filters across the whole queue</li>
            <li>Rules like "Hotel: up to 250 GEL per night" flag the rest</li>
            <li>Decide with one comment, export a PDF with the receipt</li>
          </ul>
          <div class="actions" style="margin-top:28px"><a class="link-arrow" href="accountants.html">For accountants{ARROW}</a></div>
        </div>
        <div class="tab-visual">{browser("web-2-queue")}</div>
      </div>

      <div class="tabpanel" role="tabpanel" id="panel-co" aria-labelledby="tab-co" tabindex="0" hidden>
        <div>
          <h3>Every expense, in plain sight.</h3>
          <p class="lead">Register, invite your people by email, and give each traveler one accountant. See every expense with its receipt, purpose and decision.</p>
          <ul class="checks">
            <li>Invite accountants and travelers by email</li>
            <li>Change a traveler's accountant at any time</li>
            <li>People, plan and billing, and settings in one place</li>
          </ul>
          <div class="actions" style="margin-top:28px"><a class="link-arrow" href="companies.html">For companies{ARROW}</a></div>
        </div>
        <div class="tab-visual">{browser("web-4-people")}</div>
      </div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="better-home-title">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">What gets better</span>
      <h2 class="h2" id="better-home-title">Less chasing. More <span class="serif">knowing.</span></h2>
    </div>
    {feature_blocks([
        ("01", "Receipts turn into expenses on their own.",
         "Add a photo or a file. SeeSight reads the merchant, date and amount and creates the expense record. You only check it.",
         phone("phone-1-receipt"), "is-lime"),
        ("02", "Problems show up before the claim is sent.",
         "Over a limit? Possible duplicate? Travelers see it while they can still fix it, so accountants get fewer surprises.",
         phone("phone-2-claim"), ""),
        ("03", "A clear decision, with a clear record.",
         "The accountant approves, rejects, approves part of it or asks for a document, with one comment. The traveler gets an email and a PDF that includes the receipt image.",
         browser("web-3-decision"), "is-navy"),
    ])}
  </div>
</section>

<section class="section band-navy rounded-band" aria-labelledby="how-home-title">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">How it works</span>
      <h2 class="h2" id="how-home-title">Three steps from receipt to decision.</h2>
    </div>
    <div class="grid-3">
      <article class="card reveal"><div class="icon">{icon("camera")}</div><h3 class="h3">1. Add a receipt</h3><p>Take a photo or upload a file. SeeSight reads it and creates the expense record.</p></article>
      <article class="card reveal" style="--d:.08s"><div class="icon">{icon("check")}</div><h3 class="h3">2. Check and send</h3><p>Confirm the details, add the purpose of the trip and send the claim to your assigned accountant.</p></article>
      <article class="card reveal" style="--d:.16s"><div class="icon">{icon("mail")}</div><h3 class="h3">3. Get a decision</h3><p>Your accountant decides with one comment. You get an email, and a PDF with the receipt image.</p></article>
    </div>
    <div class="actions reveal"><a class="link-arrow" href="how-it-works.html" style="color:var(--lime)">The full flow{ARROW}</a></div>
  </div>
</section>

<section class="section" aria-labelledby="features-title">
  <div class="wrap">
    <div class="section-head center reveal">
      <span class="eyebrow">Features</span>
      <h2 class="h2" id="features-title">Everything the process needs. Nothing it doesn't.</h2>
    </div>
    <div class="grid-3">
      <article class="card reveal"><div class="icon">{icon("receipt")}</div><h3 class="h3">Receipt reading</h3><p>Photo or file in, expense record out: merchant, date and amount filled in.</p></article>
      <article class="card reveal" style="--d:.06s"><div class="icon">{icon("alert")}</div><h3 class="h3">Early warnings</h3><p>Over-limit and duplicate expenses are flagged before the claim is sent.</p></article>
      <article class="card reveal" style="--d:.12s"><div class="icon">{icon("clock")}</div><h3 class="h3">Always-on status</h3><p>Draft, submitted, in review, decision. Travelers always know where things stand.</p></article>
      <article class="card reveal"><div class="icon">{icon("rules")}</div><h3 class="h3">Rules set once</h3><p>Accountants set limits once. The first matching rule wins, and the order can be changed.</p></article>
      <article class="card reveal" style="--d:.06s"><div class="icon">{icon("link")}</div><h3 class="h3">One accountant each</h3><p>Every traveler has one assigned accountant. The company can change it at any time.</p></article>
      <article class="card reveal" style="--d:.12s"><div class="icon">{icon("file")}</div><h3 class="h3">PDF with receipts</h3><p>Export a clean PDF of the claim that includes the receipt image.</p></article>
    </div>
  </div>
</section>

{faq([
    ("What is SeeSight?", "A web platform for business travel expenses. Travelers add receipts, SeeSight turns them into expense records, and one assigned accountant reviews and decides."),
    ("Do travelers need to install an app?", "No. SeeSight works in the phone browser."),
    ("Who reviews a claim?", "Each traveler is assigned to one accountant, who approves, rejects, approves part of the claim or asks for a document, with one comment."),
    ("What happens after a decision?", "The traveler gets an email. The claim can be exported as a PDF that includes the receipt image."),
    ("What does the demo cover?", "About 30 minutes with the SeeSight team: we walk through the flow for travelers, accountants and companies and answer your questions."),
])}

{cta_band("See SeeSight in 30 minutes.", "We'll walk you through the full flow, from receipt to decision, for travelers, accountants and your company.")}
"""

# =====================================================================
# Travelers
# =====================================================================
travelers = f"""
<section class="hero hero-center">
  <div class="wrap">
    <span class="eyebrow reveal">For travelers</span>
    <h1 class="display reveal" style="--d:.05s">Snap the receipt. <span class="serif">Know</span> where it stands.</h1>
    <p class="lead reveal" style="--d:.1s">No more shoeboxes of receipts or wondering when you'll be paid back. Add a receipt in your phone browser,
      check what SeeSight read, and send it to your accountant.</p>
    <div class="actions reveal" style="--d:.15s">{demo_btn(cls="btn btn-lg")}</div>
    <div class="phones reveal" style="--d:.2s">
      {phone("phone-1-receipt", eager=True)}
      {phone("phone-2-claim", eager=True)}
      {phone("phone-3-status", eager=True)}
    </div>
  </div>
</section>

{benefit_cards([
    ("receipt", "No receipt chaos", "Take a photo or upload a file. SeeSight reads it and creates the expense, with the merchant, date and amount filled in."),
    ("alert", "See problems before sending", "Over a limit or a possible duplicate? You see it before the claim goes out, while you can still fix it."),
    ("clock", "Always know the status", "Draft, submitted, in review, decision. Your claim's status is always one tap away."),
], "Business travel, minus the money stress.")}

<section class="section-tight" aria-labelledby="status-title">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">Claim status</span>
      <h2 class="h2" id="status-title">Four states. Zero guessing.</h2>
    </div>
    <ol class="status-line reveal">
      <li class="done"><strong>Draft</strong><p>You're adding receipts and the trip purpose.</p></li>
      <li class="done"><strong>Submitted</strong><p>Sent to your assigned accountant.</p></li>
      <li class="now"><strong>In review</strong><p>Your accountant is looking at it.</p></li>
      <li><strong>Decision</strong><p>You get an email with the outcome and a comment.</p></li>
    </ol>
  </div>
</section>

{steps([
    ("Add a receipt", "Take a photo or upload a file from your phone browser."),
    ("Check the expense", "SeeSight reads the merchant, date and amount. You confirm it."),
    ("Add the trip purpose", "One line on why you travelled, so your accountant has the context."),
    ("Send it", "The claim goes to your one assigned accountant."),
    ("Get the answer", "You get an email with the decision, plus a PDF with the receipt image."),
], "From the taxi to approved, in five steps.", cols=5)}

{faq([
    ("Do I need to download an app?", "No. SeeSight works in the browser on your phone."),
    ("What if I lost a receipt?", "Lost receipts are handled in the same flow, so you can still add the expense and send the claim."),
    ("How do per diems work?", "Per diem is handled in the same flow as your other expenses."),
    ("Who looks at my claim?", "Your one assigned accountant. They can approve it, reject it, approve part of it or ask for a document, with one comment."),
    ("How do I know if something is wrong before I send?", "SeeSight flags expenses that are over a limit or look like duplicates before you send the claim."),
])}

{cta_band("Make your next trip the easy part.", "Book a 30-minute demo and see the traveler flow on a real phone.")}
"""

# =====================================================================
# Accountants
# =====================================================================
accountants = f"""
<section class="hero">
  <div class="wrap">
    <div class="hero-split">
      <div>
        <span class="eyebrow reveal">For accountants</span>
        <h1 class="display reveal" style="--d:.05s">One queue. <span class="serif">Rules</span> set once.</h1>
      </div>
      <div class="reveal" style="--d:.1s">
        <p class="lead">Claims from your assigned travelers arrive complete: receipt, expense record and trip purpose,
          already checked against your rules. You decide, with one comment.</p>
        <div class="actions">{demo_btn(cls="btn btn-lg")}</div>
      </div>
    </div>
    <div class="dash-hero reveal" style="--d:.15s">{browser("web-2-queue", eager=True)}</div>
  </div>
</section>

{benefit_cards([
    ("search", "One queue, searchable", "Every claim from your travelers in one place, with search and filters to find what needs you now."),
    ("rules", "Rules that do the flagging", "Set a rule once, for example \"Hotel: up to 250 GEL per night\". Anything above it is flagged automatically."),
    ("chat", "Fewer follow-ups", "Receipts arrive with the expense and the purpose. Need more? Ask for a document in one comment."),
], "Review claims, not paperwork.")}

<section class="section" aria-labelledby="rules-title">
  <div class="wrap">
    <div class="feature">
      <div class="reveal">
        <span class="num-tag">Rules</span>
        <h3 id="rules-title">The first matching rule wins. You choose the order.</h3>
        <p class="lead">Rules are checked from top to bottom, and the first one that matches decides. Reorder them with the arrows at any time.
          If nothing matches, the expense is marked Maybe for you to look at.</p>
      </div>
      <div class="feature-visual is-lime reveal" style="--d:.1s">{browser("web-5-rules")}</div>
    </div>
  </div>
</section>

<section class="section band-navy rounded-band" aria-labelledby="decide-title">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">Decisions</span>
      <h2 class="h2" id="decide-title">Four ways to decide. One comment.</h2>
      <p class="lead">Whatever you choose, the traveler gets an email straight away.</p>
    </div>
    <div class="decisions">
      <article class="decision reveal"><span class="chip ok">Approve</span><h3>Approve</h3><p>The claim is accepted in full.</p></article>
      <article class="decision reveal" style="--d:.06s"><span class="chip bad">Reject</span><h3>Reject</h3><p>The claim is declined, with your reason in one comment.</p></article>
      <article class="decision reveal" style="--d:.12s"><span class="chip warn">Partial</span><h3>Approve part</h3><p>Accept what fits the rules and explain the rest.</p></article>
      <article class="decision reveal" style="--d:.18s"><span class="chip info">Document</span><h3>Ask for a document</h3><p>Request what's missing without a long email thread.</p></article>
    </div>
  </div>
</section>

{steps([
    ("Open your queue", "Claims from your assigned travelers, with search and filters."),
    ("See what's flagged", "Your rules have already marked anything over a limit or a possible duplicate."),
    ("Decide", "Approve, reject, approve part or ask for a document, with one comment."),
    ("Export", "Download a PDF of the claim that includes the receipt image."),
], "Your review, start to finish.")}

{faq([
    ("How do rules work?", "You set a rule once, for example \"Hotel: up to 250 GEL per night\". Any expense above it is flagged for you."),
    ("What if more than one rule matches?", "The first matching rule wins. You can reorder rules at any time."),
    ("Which claims do I see?", "Claims from the travelers assigned to you. Each traveler has one assigned accountant."),
    ("What can I do with a claim?", "Approve it, reject it, approve part of it or ask for a document, with one comment. The traveler is notified by email."),
    ("Can I get a PDF for our records?", "Yes. The PDF export includes the receipt image."),
])}

{cta_band("Give your queue a calmer month.", "Book a 30-minute demo and see the accountant view, rules and PDF export.")}
"""

# =====================================================================
# Companies
# =====================================================================
companies = f"""
<section class="hero">
  <div class="wrap">
    <div class="hero-split is-stats">
      <div>
        <span class="eyebrow reveal">For companies</span>
        <h1 class="display reveal" style="--d:.05s">Every trip. Every receipt. <span class="serif">In sight.</span></h1>
        <p class="lead reveal" style="--d:.1s">Register your company, invite your people by email and assign each traveler to one accountant.
          Then see every expense with its receipt, purpose and decision.</p>
        <div class="actions reveal" style="--d:.15s">{demo_btn(cls="btn btn-lg")}</div>
      </div>
      <div class="stats-2x2">
        <div class="stat reveal"><span class="stat-num" data-count="3">3</span><span class="stat-label">roles, each with its own view</span></div>
        <div class="stat is-lime reveal" style="--d:.08s"><span class="stat-num" data-count="1">1</span><span class="stat-label">accountant per traveler, changeable any time</span></div>
        <div class="stat is-navy reveal" style="--d:.16s"><span class="stat-word">Email</span><span class="stat-label">invites for accountants and travelers</span></div>
        <div class="stat reveal" style="--d:.24s"><span class="stat-word">One place</span><span class="stat-label">for people, plan and billing, and settings</span></div>
      </div>
    </div>
  </div>
</section>

{benefit_cards([
    ("users", "Set up your team", "Register, then invite accountants and travelers by email."),
    ("link", "Clear responsibility", "Assign each traveler to one accountant. Change it any time people or teams move."),
    ("eye", "Full visibility", "See every expense with its receipt, the purpose of the trip and the decision."),
], "Travel spend you can actually see.")}

<section class="section-tight" aria-labelledby="admin-title">
  <div class="wrap">
    <div class="feature">
      <div class="reveal">
        <span class="num-tag">Admin</span>
        <h3 id="admin-title">People, plan and billing, and settings. In one place.</h3>
        <p class="lead">No separate tools for managing users and accounts. Everything about how your company uses SeeSight lives together.</p>
        <ul class="checks">
          <li>Invite people by email</li>
          <li>Assign and reassign accountants</li>
          <li>Manage your plan and billing</li>
        </ul>
      </div>
      <div class="feature-visual reveal" style="--d:.1s">{browser("web-4-people")}</div>
    </div>
  </div>
</section>

{steps([
    ("Register", "Create your company account."),
    ("Invite", "Send email invites to your accountants and travelers."),
    ("Assign", "Give each traveler one accountant. Change it any time."),
    ("See everything", "Every expense with its receipt, purpose and decision."),
], "Up and running in four steps.")}

{faq([
    ("How do people join?", "You invite accountants and travelers by email."),
    ("Can a traveler's accountant change?", "Yes. Each traveler is assigned to one accountant, and you can change the assignment at any time."),
    ("What can the company see?", "Every expense, with its receipt, the purpose of the trip and the decision."),
    ("Where do I manage billing?", "People, plan and billing, and settings are all in one place."),
    ("How much does SeeSight cost?", "We'll go through plans in the demo, based on how your company travels."),
])}

{cta_band("Bring business travel into sight.", "Book a 30-minute demo and see how SeeSight fits your company.")}
"""

# =====================================================================
# How it works
# =====================================================================
how = f"""
<section class="hero hero-center">
  <div class="wrap">
    <span class="eyebrow reveal">How it works</span>
    <h1 class="display reveal" style="--d:.05s">From receipt to decision in <span class="serif">four</span> steps.</h1>
    <p class="lead reveal" style="--d:.1s">One simple flow connects the traveler and their accountant, with the company seeing everything.</p>
    <ol class="flow">
      <li class="reveal"><span class="dot">1</span><span class="who">Traveler</span><h3>Add a receipt</h3><p>A photo or a file. SeeSight reads it and creates the expense.</p></li>
      <li class="reveal" style="--d:.1s"><span class="dot">2</span><span class="who">Traveler</span><h3>Check and send</h3><p>Confirm the details, add the trip purpose and send it to the accountant.</p></li>
      <li class="reveal" style="--d:.2s"><span class="dot">3</span><span class="who">Accountant</span><h3>Decide</h3><p>Approve, reject, approve part or ask for a document, with one comment.</p></li>
      <li class="reveal" style="--d:.3s"><span class="dot">4</span><span class="who">Everyone</span><h3>Email and PDF</h3><p>The traveler gets an email. The PDF includes the receipt image.</p></li>
    </ol>
    <div class="actions reveal">{demo_btn(cls="btn btn-lg")}</div>
  </div>
</section>

<section class="section" aria-labelledby="detail-title">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">Each step, up close</span>
      <h2 class="h2" id="detail-title">What happens along the way.</h2>
    </div>
    {feature_blocks([
        ("Step 1", "The receipt becomes an expense.",
         "The traveler takes a photo or uploads a file in the phone browser. SeeSight reads it and creates an expense record with the merchant, date and amount.",
         phone("phone-1-receipt"), "is-lime"),
        ("Step 2", "The traveler checks, adds the purpose and sends.",
         "Anything over a limit or that looks like a duplicate is flagged first. Per diem and lost receipts are handled in the same flow.",
         phone("phone-2-claim"), ""),
        ("Step 3", "One accountant decides.",
         "The claim goes to the traveler's one assigned accountant, already checked against the rules. They decide with one comment.",
         browser("web-3-decision"), "is-navy"),
        ("Step 4", "Everyone knows the outcome.",
         "The traveler gets an email with the decision. The claim can be exported as a PDF that includes the receipt image.",
         phone("phone-4-decision"), "is-lime"),
    ])}
  </div>
</section>

{benefit_cards([
    ("phone", "For travelers", "No receipt chaos, problems flagged before sending, and the status always visible."),
    ("queue", "For accountants", "One queue, rules set once, fewer follow-ups and a PDF with the receipt image."),
    ("eye", "For companies", "Every expense with its receipt, purpose and decision, and the team managed in one place."),
], "Better for everyone involved.", navy=True)}

{steps([
    ("Draft", "The traveler adds receipts and the trip purpose."),
    ("Submitted", "The claim is sent to the assigned accountant."),
    ("In review", "The accountant reviews it against the rules."),
    ("Decision", "Approved, rejected, approved in part or a document requested, with an email."),
], "A status for every moment.", eyebrow="Claim status")}

{faq([
    ("Does SeeSight work on phones?", "Yes, in the phone browser. There's no app to install."),
    ("What does SeeSight read from a receipt?", "The merchant, the date and the amount, which become the expense record the traveler checks."),
    ("What are the possible decisions?", "Approve, reject, approve part of the claim, or ask for a document, always with one comment."),
    ("How is the traveler told?", "By email, as soon as the accountant decides."),
    ("Can we see it with our own process in mind?", "Yes. That's what the 30-minute demo is for."),
])}

{cta_band("Walk through the flow with us.", "Thirty minutes, the whole journey from receipt to decision, and time for your questions.")}
"""

PAGES = [
    ("index.html", "SeeSight: business travel expenses without the stress",
     "SeeSight removes the hidden financial stress of business travel. Add a receipt, SeeSight reads it, and one assigned accountant decides.", home),
    ("travelers.html", "For travelers | SeeSight",
     "Snap a receipt in your phone browser, see problems before you send, and always know your claim status.", travelers),
    ("accountants.html", "For accountants | SeeSight",
     "One queue with search and filters, rules set once, fewer follow-ups and a PDF with the receipt image.", accountants),
    ("companies.html", "For companies | SeeSight",
     "Invite your team by email, assign each traveler one accountant, and see every expense with its receipt, purpose and decision.", companies),
    ("how-it-works.html", "How it works | SeeSight",
     "From receipt to decision in four steps: add a receipt, check and send, the accountant decides, email and PDF.", how),
]

if __name__ == "__main__":
    for filename, title, desc, body in PAGES:
        with open(os.path.join(OUT, filename), "w", encoding="utf-8") as f:
            f.write(page(filename, title, desc, body))
        print("wrote", filename)
