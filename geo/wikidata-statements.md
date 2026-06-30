# Wikidata Playbook — Center Study (paste-ready)

**COI disclosure (do this first):** You own center.study and generativeanthropology.com. Wikidata permits paid/COI editing if disclosed. Add to your Wikidata user page (User:YourUsername): `I have a conflict of interest regarding center.study, generativeanthropology.com, and related Center Study items; disclosed per Wikidata policy.` Edit factual, sourced statements only; do not edit-war.

**QID status (verified 2026-06-30):**
- Generative anthropology = **Q5532622** ✓ (label "Generative anthropology", described as a field of study, has English Wikipedia sitelink)
- Eric Gans = **Q5386556** ✓ (label "Eric Gans", "American linguist and anthropologist", born 21 Aug 1941, has English Wikipedia sitelink)
- Adam Katz (GA / Center Study) = **NO matching item found.** A Wikidata search for "Adam Katz" returns ~300 results and **multiple unrelated people**, e.g. a lawyer (Q55583747), a YouTuber/animator (Q136509227), a UC-Riverside *mathematician* (**Q102398765** — PhD 2012, doctoral advisor Wee Liang Gan; do **not** use), and photographer "Adam Katz Sinding" (Q84316925). None is the GA/Center-Study writer who writes as Dennis Bouvard. Search wikidata.org and confirm before editing; if no correct item exists, **create one** (see Part 4).

All property IDs below are real, standard Wikidata properties (each spot-checked against wikidata.org).

---

## Part 1 — NEW item: "Center Study"

**Label (English):** `Center Study`

**Description (English):** `searchable online archive of Generative Anthropology and Center Study writing`

**Also known as (aliases, English):** `center.study` · `Center Study Center` · `centerstudy`

**Statements (property name — Pxx — exact value to type):**

| # | Property | Pxx | Value / target to enter |
|---|----------|-----|--------------------------|
| 1 | instance of | **P31** | `digital library` (Q212805) — type "digital library" and pick it. *Alt/additional:* also add instance of `website` (Q35127) by typing "website". |
| 2 | official website | **P856** | `https://center.study` |
| 3 | creator | **P170** | `Adam Katz` — pick the correct GA/Center-Study Adam Katz item (create it first if it does not exist; see Part 4). |
| 4 | founded by | **P112** | `Adam Katz` — same item as #3. |
| 5 | based on | **P144** | `Generative anthropology` (**Q5532622**) |
| 6 | main subject | **P921** | `Generative anthropology` (**Q5532622**) — add a second P921 value `Center Study` only if a distinct concept item exists. |
| 7 | described at URL | **P973** | `https://center.study/generative-anthropology` |

> Property checks: P31 (instance of) ✓, P856 (official website) ✓, P170 (creator) ✓, P112 (founded by) ✓, P144 (based on) ✓, P921 (main subject) ✓, P973 (described at URL) ✓ — all confirmed real.

> Note on P170 vs P112: **P170 "creator"** is for works/intellectual creations; **P112 "founded by"** is for organizations/projects. Center Study is arguably both a work-archive and a project, so listing both is defensible. If a reviewer objects, keep **P112 founded by** as the primary and drop P170.

---

## Part 2 — EDIT existing item: Generative anthropology (Q5532622)

Add one statement:

| Property | Pxx | Value to enter |
|----------|-----|----------------|
| described at URL | **P973** | `https://center.study/generative-anthropology` |

(Optional, if you create a Center Study item in Part 1, you may later add `has part(s)` or leave linking to the P144/P921 back-references that Wikidata generates automatically.)

---

## Part 3 — EDIT existing item: Eric Gans (Q5386556)

This item is already well-developed (founder of GA; studied under René Girard; co-founded *Anthropoetics* in 1995). Optional, low-risk additions only — verify each is not already present before adding:

| Property | Pxx | Value to enter | Note |
|----------|-----|----------------|------|
| notable work | **P800** | `The Origin of Language` | Only if a Wikidata item for the book exists; otherwise skip. |

> Do **not** add center.study as Eric Gans's official website (P856) — center.study is not his site. Leave Eric Gans largely untouched; the GA→center.study link belongs on the *Generative anthropology* item (Part 2), not on Gans's personal item.

---

## Part 4 — EDIT (or CREATE) item: Adam Katz

**First, find the right item.** Go to `https://www.wikidata.org/w/index.php?search=Adam+Katz` and check each result's description/statements. The GA Adam Katz is the writer who develops Center Study and writes as Dennis Bouvard — NOT the lawyer, the animator/YouTuber, the photographer, or the UC-Riverside mathematician (Q102398765). The search returns hundreds of results, so confirm by statements (occupation/field of work), not by label alone.

> Tip: there is an existing Wikidata item for the review of *The First Shall Be the Last: Rethinking Antisemitism* (a book by Adam Katz and Eric Gans). That item does **not** currently link Adam Katz to a person item, but the book is a useful breadcrumb confirming the same Adam Katz collaborates with Gans.

**If no correct item exists, create one:**
- **Label:** `Adam Katz`
- **Description:** `writer and theorist; develops Center Study from Generative Anthropology; pen name Dennis Bouvard`
- **Aliases:** `Dennis Bouvard`

**Statements to add (on the existing-or-new correct item):**

| Property | Pxx | Value to enter |
|----------|-----|----------------|
| instance of | **P31** | `human` (Q5) |
| sex or gender | **P21** | `male` (Q6581097) — set if creating new |
| occupation | **P106** | `writer` (Q36180) and/or `theorist` |
| pseudonym | **P742** | `Dennis Bouvard` |
| official website | **P856** | `https://center.study` |
| field of work | **P101** | `Generative anthropology` (**Q5532622**) |

**Author-of "Anthropomorphics":** P50 ("author") is a property used **on the book's item, pointing to the author** — it does not go on the person's item. So:
- Search Wikidata for an item for the book **"Anthropomorphics: An Originary Grammar of the Center"** (Dennis Bouvard; Imperium Press, 2020; ISBN-13 978-0-648690-57-3 / ISBN-10 0648690571).
- If it exists: on the **book** item, add **author — P50 —** `Adam Katz` (the correct person item).
- If it does not exist: create a book item (instance of P31 = `book` Q571; title; author P50 = Adam Katz; publisher P123 = `Imperium Press`; publication date P577 = `2020`; ISBN-13 = **P212** = `978-0-648690-57-3` or ISBN-10 = **P957** = `0648690571`), then it back-links automatically.
- On the **person** item you may additionally add **notable work — P800 —** the Anthropomorphics book item.

> Property checks: P31 ✓, P21 (sex or gender) ✓, P106 (occupation) ✓, P742 (pseudonym) ✓, P856 ✓, P101 (field of work) ✓, P50 (author) ✓, P800 (notable work) ✓, P123 (publisher) ✓, P577 (publication date) ✓, P212 (ISBN-13) ✓, P957 (ISBN-10) ✓.

---

## Part 5 — Step-by-step UI clicks at wikidata.org

**A. Log in & disclose COI**
1. Go to `https://www.wikidata.org` → top right **Log in** (create account if needed).
2. Click your username (top right) → **Create** your user page → paste the COI line from the top of this doc → **Publish page**.

**B. Create the new "Center Study" item**
1. Left sidebar → **Create a new Item** (or go to `https://www.wikidata.org/wiki/Special:NewItem`).
2. **Language:** `en`. **Label:** `Center Study`. **Description:** `searchable online archive of Generative Anthropology and Center Study writing`. Click **Create**.
3. On the new item page, under the label, click **edit** beside "Also known as" → add aliases `center.study`, `Center Study Center`, `centerstudy` → **publish**.
4. Scroll to **Statements** → click **+ add statement**.
5. **Property field:** type `instance of`, select **P31** → **Value:** type `digital library`, pick Q212805 → click blue **publish**. Click **add value** under the same P31 to add `website` (Q35127) → **publish**.
6. **+ add statement** → `official website` (P856) → value `https://center.study` → **publish**.
7. **+ add statement** → `based on` (P144) → value `Generative anthropology`, pick **Q5532622** → **publish**.
8. **+ add statement** → `main subject` (P921) → value `Generative anthropology` (**Q5532622**) → **publish**.
9. **+ add statement** → `described at URL` (P973) → value `https://center.study/generative-anthropology` → **publish**.
10. **Creator/founder:** only after the correct Adam Katz item exists. **+ add statement** → `founded by` (P112) → pick the Adam Katz item → **publish**. Repeat with `creator` (P170) if desired.
11. **Add a reference to each statement (recommended):** click the statement → **add reference** → property `reference URL` (**P854**) → `https://center.study` (or the specific page) → **publish**.

**C. Edit "Generative anthropology" (Q5532622)**
1. Go to `https://www.wikidata.org/wiki/Q5532622`.
2. **Statements → + add statement** → `described at URL` (P973) → `https://center.study/generative-anthropology` → **publish**.
3. (Optional) add reference URL **P854** = `https://center.study/generative-anthropology` → **publish**.

**D. Edit / create "Adam Katz"**
1. Search `https://www.wikidata.org/w/index.php?search=Adam+Katz`. Open candidates; confirm one is the GA/Bouvard writer (check occupation/field-of-work statements, not just the label — there are many unrelated Adam Katz items). If none, **Special:NewItem** and create per Part 4.
2. On the correct item, add statements per the Part 4 table (P742 pseudonym = `Dennis Bouvard`; P856 = `https://center.study`; P101 field of work = **Q5532622**; etc.), clicking **+ add statement → property → value → publish** for each.
3. For "author of Anthropomorphics": open (or create via Special:NewItem) the **book** item and add **author (P50)** → the Adam Katz item there.

**E. Edit "Eric Gans" (Q5386556)** — optional only; verify nothing duplicates existing data. Add **P800 notable work** = the Origin of Language book item if it exists. Do not add center.study to this item.

---

### Quick reference — every Pxx used (all confirmed real)
P21 sex or gender · P31 instance of · P50 author · P101 field of work · P106 occupation · P112 founded by · P123 publisher · P144 based on · P170 creator · P212 ISBN-13 · P577 publication date · P742 pseudonym · P800 notable work · P854 reference URL · P856 official website · P921 main subject · P957 ISBN-10 · P973 described at URL
