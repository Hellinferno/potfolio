# Ravi — Applied AI & Software Engineering Portfolio

Personal engineering portfolio for **Ravi** (B.Sc. in Applied AI & Data Science @ IIT Jodhpur, CA Intermediate @ ICAI), hosted on **Cloudflare Pages**.

- **Live Portfolio (Cloudflare Pages):** https://ravi-portfolio-3zi.pages.dev
- **GitHub:** https://github.com/Hellinferno
- **LinkedIn:** https://www.linkedin.com/in/raviiitcaintermidiate/
- **Email:** b25bs1273@iitj.ac.in

## Architecture & Files

- `index.html` — Semantic 7-section portfolio layout (`About`, `Featured Projects`, `Interactive Case Studies`, `Technical Skills`, `Open Source & Certifications`, `Education`, `Contact & Resume`).
- `style.css` — Linked stylesheet supporting three live visual directions (`Obsidian`, `Editorial`, `Daylight`), responsive desktop/mobile grids, accessible focus rings, and `prefers-reduced-motion` fallbacks.
- `script.js` — Theme switcher (`localStorage`), interactive case study workbench (`ClaimLab`, `AegisGraph`, `StudyLab`, `FinMod-Agent`), scroll-spy navigation, and clipboard helpers.
- `symbiont.js` — Theme-aware, performance-tuned particle constellation with visibility pausing and motion toggle controls.
- `resume.html` & `assets/Ravi_Resume.pdf` — Print-ready web resume and downloadable single-page PDF resume.
- `assets/` — Real project screenshots and credential artifacts.

## Featured Projects

1. **[ClaimLab](https://github.com/Hellinferno/ClaimLab)** — Source-grounded AI teaching & verified float64 NumPy numerical learning workstation.
2. **[AegisGraph](https://github.com/Hellinferno/graph-hack-)** — MCP-native graph incident-response agent built on FalkorDB with `GRAPH.COPY` counterfactual sandboxes.
3. **[StudyLab](https://github.com/Hellinferno/Tutor-AI-)** — Modular 3-service AI learning platform with hybrid RAG, character-offset citations, and AST-sandboxed Python solving.
4. **[FinMod-Agent (FMVA)](https://github.com/Hellinferno/finmod-agent)** — Deterministic financial modeling and valuation engine (DCF, CAPM WACC, Comps, Sensitivity, Audit Trails).

## Local Preview

```powershell
python -u -m http.server 8000
```

Then open `http://localhost:8000`.

## Cloudflare Pages Deployment

```powershell
npx wrangler pages deploy . --project-name=ravi-portfolio --branch=main
```
