# 🗺️ AidAtlas — Find your route to an affordable education

**AidAtlas** is a student-focused web application designed to demystify university admissions and financial aid for international students. 

Built specifically with the Nigerian and broader African context in mind, AidAtlas replaces fragmented research with a centralized, verified, and highly structured database of US universities, testing policies, deadlines, and financial aid opportunities.

---

## 💡 The Problem

For international students requiring significant financial aid, researching universities is a full-time job. The information needed to make an informed decision is scattered across dozens of different university websites:
- Does this school offer need-based aid to internationals?
- Are they need-blind or need-aware?
- What is the actual cost of attendance vs. the sticker price?
- Are SATs required for the Fall 2027 cycle?
- What documents are needed for the CSS Profile?

Most scholarship directories just list generic deadlines. AidAtlas helps students answer the most important question: **"Given my profile, is this university actually a realistic and affordable option?"**

---

## ✨ Core Features

- **Verified University Database:** A curated, expanding list of top US universities. Every piece of data (costs, deadlines, test policies, aid availability) is manually verified against official university sources. 
- **The AidAtlas Match Engine:** A deterministic, rule-based algorithm (no unpredictable AI) that scores universities from 0-100 based on a student's GPA, intended major, test scores, and financial need.
- **Match Breakdown Charts:** Visualizes exactly *why* a university received its score (Academic Fit, Financial Fit, International Fit, etc.).
- **AI Essay Reviewer:** Integrated with a local Large Language Model (via Ollama) to provide real-time, constructive feedback on student essays without sending data to a paid API.
- **Application Tracker & Checklists:** A dashboard to track document checklists (Common App, transcripts, recommendations), essay drafts, and upcoming deadlines.
- **Shortlist Export:** Generate a clean, print-ready PDF of a student's college list with match scores, aid data, and deadlines.

---

## 🎨 Design System: "Desert Rose & Teal"

AidAtlas does not look like a generic SaaS dashboard. It uses a custom, editorial-inspired design system.

- **Warm Sand Background:** `#F4F1DE` (Reduces eye strain compared to pure white).
- **Terracotta Primary:** `#E07A5F` (Used for main actions and match scores).
- **Deep Teal Secondary:** `#0F766E` (Used for success states and strong fit indicators).
- **Deep Slate Text:** `#3D405B` (For high contrast and readability).
- **Typography:** `Plus Jakarta Sans` for UI and `DM Serif Display` for editorial headings.

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 18 + Vite
- **Styling:** Tailwind CSS (Custom token configuration)
- **Routing:** React Router DOM
- **Icons:** Lucide React
- **State Management:** React Context API + LocalStorage (Offline-first, no backend required)
- **AI Integration:** Ollama (Local LLM runner)

---

## 🧠 How the Matching Engine Works

The AidAtlas Match is **not** an admission prediction. It is a rule-based planning tool. The score is calculated out of 100 points:
1. **Academic Fit (25 pts):** Compares the student's GPA to general thresholds.
2. **Financial Fit (30 pts):** Prioritizes schools that meet 100% demonstrated need or offer full-ride scholarships.
3. **International Fit (20 pts):** Checks if the school is need-blind and offers institutional aid to non-citizens.
4. **Major Fit (15 pts):** Checks if the intended major is offered.
5. **Application Fit (10 pts):** Considers test-optional policies, fee waivers, and deadlines.
6. **Preferences Fit (10 pts):** Matches class size and location preferences.

Every score is accompanied by a list of **✓ Strong Fits** and **⚠️ Concerns** so the student understands the score.

---

## 🚀 Running Locally

### Prerequisites
- Node.js (v18 or higher)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/GiftOnyinye/aidatlas.git
   cd aidatlas