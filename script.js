(function () {
    'use strict';

    const CASE_STUDIES = {
        claimlab: {
            title: 'ClaimLab — Source-Grounded Teaching & Numerical Verification Workstation',
            repoUrl: 'https://github.com/Hellinferno/ClaimLab',
            stack: ['Python 3.12', 'FastAPI', 'React 19', 'TypeScript 6', 'NumPy float64', 'Meta muse-spark-1.3', 'pytest'],
            metrics: [
                { val: '123 + 2', lbl: 'Offline + Live Passing Tests' },
                { val: '1e-10', lbl: 'Float64 Reference Tolerance' },
                { val: '3 Recipes', lbl: 'Verified Attention NumPy Labs' },
            ],
            tabs: {
                overview: {
                    heading: 'Overview & Problem Statement',
                    paragraphs: [
                        'Generative AI tutors often hallucinate mathematical charts, blend speculative claims with paper citations, and deliver superficial chat replies that fail to adapt to what a student actually understood.',
                        'ClaimLab couples Meta\'s muse-spark-1.3 model with a transactional SVG whiteboard engine, three reviewed float64 NumPy numerical recipes, isolated sandboxed experiments for any uploaded PDF paper, and a strict closed-loop pedagogical state machine.'
                    ],
                    bullets: [
                        '<strong>100% Measured Visuals:</strong> Every plot, curve, and heatmap is rendered exclusively from retained NumPy run outputs—never fabricated by the LLM.',
                        '<strong>Strict Epistemic Partitioning:</strong> Teacher utterances carry explicit <code>[Source]</code>, <code>[Experiment]</code>, or <code>[Background]</code> grounding badges with character-level offsets.',
                        '<strong>Two-Variant Mastery Rule:</strong> Advancing to <code>supported_independently</code> strictly requires solving two distinct mathematical variants (<code>v1-a</code> and <code>v1-b</code>).'
                    ],
                    codeTitle: 'BoardPatch Protocol & Mastery State Machine',
                    code: `interface BoardPatch {
  session_id: string;
  base_revision: number;
  ops: Array<
    | { op: "upsert_node"; node: SceneNode }
    | { op: "upsert_edge"; edge: SceneEdge }
    | { op: "delete_node"; id: string } // cascades edges
  >;
}

// Progression Invariant:
// Introduced -> Needs Check -> Supported w/ Help -> Supported Independently
// Requires BOTH Variant v1-a AND Variant v1-b passed.`
                },
                problem: {
                    heading: 'Engineering Challenges & Security Invariants',
                    paragraphs: [
                        'Running student-facing LLM tutors alongside arbitrary paper uploads and live code execution introduces multi-tenant state isolation, CSRF, and duplicate-mutation risks.',
                        'ClaimLab enforces boundary guarantees directly in FastAPI middleware and deterministic state reducers rather than relying on prompt rules.'
                    ],
                    bullets: [
                        '<strong>HMAC-SHA256 Tenant Isolation:</strong> Ephemeral guest cookies (<code>claimlab_guest</code>) scope every PDF, board snapshot, and run; cross-tenant reads return <code>404 Not Found</code>.',
                        '<strong>SHA-256 Idempotency Fingerprinting:</strong> Requests with <code>Idempotency-Key</code> replay cached responses on exact match or reject payload mismatches with <code>HTTP 409</code>.',
                        '<strong>Complete Data Purge (<code>DELETE /api/v1/me/data</code>):</strong> Increments fencing generation numbers to invalidate inflight background jobs and deletes physical PDFs, leaving only a content-free receipt.'
                    ],
                    codeTitle: 'Verified Numerical Invariants (Float64)',
                    code: `# Recipe A: softmax_sensitivity_v1
p = softmax(alpha * scores)
assert abs(sum(p) - 1.0) < 1e-10
assert entropy(p_scaled) < entropy(p_base) # alpha > 1

# Recipe B: attention_scaling_v1
# Var(Q @ K.T) ~= d_k  vs  Var((Q @ K.T) / sqrt(d_k)) ~= 1.0

# Recipe C: causal_masking_v1
# Upper-triangle (j > i) receives strictly 0.0 weight`
                },
                architecture: {
                    heading: 'System Architecture',
                    paragraphs: [
                        'ClaimLab separates PDF extraction and character-offset anchoring from deterministic numerical execution and the transactional React SVG whiteboard.',
                        'For papers outside the three reviewed attention recipes, tutor-written NumPy scripts execute inside an isolated sandbox with inputs, code, and checks exposed to the learner.'
                    ],
                    bullets: [
                        '<strong>Source Grounding Layer:</strong> Native PDF extraction, deterministic content hashes, verbatim anchor verification, and out-of-domain boundary gate.',
                        '<strong>Numerical Lab Kernel:</strong> Reviewed float64 recipes (<code>softmax_sensitivity_v1</code>, <code>attention_scaling_v1</code>, <code>causal_masking_v1</code>) with deterministic seed PRNG.',
                        '<strong>Evidence Adaptation Engine:</strong> 12 canonical interactive tasks tracked via idempotent event persistence.'
                    ],
                    codeTitle: 'ClaimLab Data Flow',
                    code: `PDF Note ──▶ [Anchor Engine (char offsets + SHA256)]
                     │
                     ▼
┌────────────────────┴────────────────────┐
│  Neural Orchestrator (muse-spark-1.3)   │
└───────┬─────────────────────────┬───────┘
        ▼                         ▼
[Atomic SVG Whiteboard]   [Float64 NumPy Kernel]
 (Revisioned BoardPatch)   (Reviewed + Sandbox)
        └───────────┬─────────────┘
                    ▼
     [2-Variant Mastery State Machine]`
                },
                verification: {
                    heading: 'Verification & CI Results',
                    paragraphs: [
                        'Every numerical recipe is cross-checked against an independent scalar reference implementation within 1e-10 tolerance, and the end-to-end backend/frontend integration runs under GitHub Actions CI.',
                        'Real UI renders captured during verification (including desktop workspace and welcome views) live in the repository under reports/.'
                    ],
                    bullets: [
                        '<strong>Test Matrix:</strong> 123 offline tests + 2 live model verification tests passing via pytest.',
                        '<strong>CSRF & Fencing Tests:</strong> Verified state-mutating <code>X-CSRF-Token</code> checks and generation-fenced purge behavior.',
                        '<strong>CI Pipeline:</strong> Automated workflow configured at <code>.github/workflows/ci.yml</code> on <code>main</code>.'
                    ],
                    codeTitle: 'Verified Test Execution',
                    code: `$ pytest -v
# 123 offline + 2 live tests passed
# Tolerance check: |numpy_val - scalar_ref| < 1e-10
# UI visual snapshots:
#   reports/ui-welcome.png
#   reports/ui-workspace-desktop.png
#   reports/ui-workspace-mobile.png`
                }
            }
        },
        aegisgraph: {
            title: 'AegisGraph — MCP-Native Graph Incident-Response Agent',
            repoUrl: 'https://github.com/Hellinferno/graph-hack-',
            stack: ['Python 3.12', 'FalkorDB', 'Cypher', 'MCP (stdio)', 'FastAPI', 'React', 'Docker'],
            metrics: [
                { val: '13 Tools', lbl: 'MCP Graph Tool Surface' },
                { val: '6 → 0', lbl: 'PII Exposure Paths Cut' },
                { val: '4 / 4', lbl: 'Critical Flows Intact' },
            ],
            tabs: {
                overview: {
                    heading: 'Overview & Incident Scenario (INC-2026-091)',
                    paragraphs: [
                        'Answering "what customer data can an attacker reach through a CVE, and what can we cut without taking checkout down?" spans three disconnected silos: source code imports, runtime service mesh routes, and cloud IAM database permissions.',
                        'AegisGraph models all three inside FalkorDB and exposes 13 Model Context Protocol (MCP) tools so an agent (or deterministic doctrine) can trace blast radius, prove a remediation safe in a sandbox clone, and execute reversible fixes.'
                    ],
                    bullets: [
                        '<strong>Hybrid Vector + Full-Text Anchoring:</strong> Maps a raw WAF/CVE alert to <code>CVE-2026-8841</code> in <code>jwt-crypto-core</code> using HNSW vector + full-text indexes.',
                        '<strong>Multi-Hop Blast Radius:</strong> Single Cypher traversal across 5–8 hops uncovers 6 active attack paths reaching 3 PII databases.',
                        '<strong>Chokepoint Discovery:</strong> Runs <code>algo.betweenness</code> to rank <code>legacy-billing-bridge</code> (score 6.0) while protecting critical-tier <code>payment-orchestrator</code> (score 5.83).'
                    ],
                    codeTitle: 'Multi-Hop Attack Path Cypher Query',
                    code: `MATCH (v:Vulnerability {id: $cve_id})-[:AFFECTS]->(pkg:Package)
      <-[:IMPORTS]-(f:Function)<-[:DEPLOYS_CODE]-(origin:Service)
WITH DISTINCT origin
MATCH attack = (origin)-[:ROUTES_TO*0..3]->(pivot:Service)
               -[:ASSUMES_ROLE]->(role:IAMRole)
               -[acc:CAN_ACCESS]->(db:Database {contains_pii: true})
WHERE ALL(r IN relationships(attack)
          WHERE coalesce(r.status, 'ACTIVE') = 'ACTIVE')
RETURN origin.name, pivot.name, role.name, db.name,
       length(attack) AS total_hops
ORDER BY total_hops;`
                },
                problem: {
                    heading: 'Why Vector Search & SQL Fall Short',
                    paragraphs: [
                        'Vector stores only surface text chunks that resemble JWT vulnerabilities; they cannot compute transitive reachability across code, runtime mesh, and IAM roles.',
                        'Relational SQL requires brittle recursive joins whenever a new node or edge type is introduced. In FalkorDB, multi-hop traversals and graph algorithms execute natively in milliseconds.'
                    ],
                    bullets: [
                        '<strong>Hard Guardrails in Tool Code:</strong> Critical-tier services and IAM roles shared with critical services can never be quarantined, regardless of LLM prompts.',
                        '<strong>Simulate-Before-Act Gate:</strong> <code>execute_remediation</code> refuses to run unless a passing <code>GRAPH.COPY</code> sandbox simulation exists for the exact incident, CVE, bridge, and role.',
                        '<strong>Single-Call Rollback:</strong> Every mutation writes an <code>ActionAudit</code> node linked via <code>RESOLVED_BY</code> and <code>MODIFIED_ENTITY</code>, enabling full reversal.'
                    ],
                    codeTitle: 'Chokepoint Centrality & Counterfactual Gate',
                    code: `CALL algo.betweenness({
  nodeLabels: ['Service'],
  relationshipTypes: ['ROUTES_TO']
}) YIELD node, score
RETURN node.name, node.tier, node.rps, score
ORDER BY score DESC;

-- Counterfactual Proof:
-- GRAPH.COPY prod -> aegis_sim_INC_2026_091
-- Sever legacy-billing-bridge -> check PII paths == 0
-- Verify algo.WCC preserves 4/4 critical customer flows`
                },
                architecture: {
                    heading: 'Graph Topology & MCP Architecture',
                    paragraphs: [
                        'One FalkorDB instance hosts three graphs: production topology (aegis_prod_graph), episodic/procedural memory (aegis_memory_graph), and ephemeral counterfactual clones (aegis_sim_*).',
                        'The FastAPI orchestrator supports deterministic mode (no LLM key required) as well as Claude or free OpenRouter models selecting the exact same 13 MCP tools over stdio.'
                    ],
                    bullets: [
                        '<strong>Schema Scale:</strong> 9 node labels, 11 relationship types, 10 range indexes, 2 HNSW 384-d cosine vector indexes, 1 full-text index.',
                        '<strong>Ad-hoc Safety:</strong> Exploration queries run via FalkorDB <code>GRAPH.RO_QUERY</code>, which rejects writes at the database layer.',
                        '<strong>Dual-Client Compatibility:</strong> Same MCP server works from the React console, CLI, and Claude Desktop.'
                    ],
                    codeTitle: 'AegisGraph Component Flow',
                    code: `Console UI ──(REST+SSE)──▶ FastAPI ──▶ AgentRunner (Deterministic / LLM)
                                              │
                                         (MCP stdio)
                                              ▼
                                  AegisGraph MCP (13 tools)
                                              │
                                              ▼
                       FalkorDB [prod | memory | GRAPH.COPY sandbox]`
                },
                verification: {
                    heading: 'Demo Incident Verification & Walkthrough',
                    paragraphs: [
                        'Verified end-to-end on seeded incident INC-2026-091 across 49 nodes and 69 relationships, including full deterministic mode (9 MCP tool calls) and reversible rollback.',
                        'A 1080p walkthrough video (aegisgraph_demo.mp4) and auto-generated Cypher audit reference (docs/CYPHER_QUERIES.md) are committed in the repository.'
                    ],
                    bullets: [
                        '<strong>Exposure Reduction:</strong> 6 active PII attack paths reduced to 0 across <code>customer-kyc-vault-db</code>, <code>global-settlement-ledger</code>, and <code>reporting-warehouse</code>.',
                        '<strong>Zero Critical Downtime:</strong> 4 of 4 critical checkout/customer flows verified intact via <code>algo.WCC</code> prior to execution.',
                        '<strong>Owner Routing:</strong> Automatically resolved <code>@aarav-sec</code> via <code>MAINTAINED</code> edges to open a remediation PR draft.'
                    ],
                    codeTitle: 'CLI Verification Commands',
                    code: `$ python -m aegis seed
$ python -m aegis tools          # Lists 13 MCP tools
$ python -m aegis run INC-2026-091 --mode deterministic
# Result: 9 MCP calls | Exposure 6 -> 0 | Flows 4/4 intact`
                }
            }
        },
        studylab: {
            title: 'StudyLab — Modular AI Learning, Hybrid RAG & Verified Solver',
            repoUrl: 'https://github.com/Hellinferno/Tutor-AI-',
            stack: ['Python', 'Hybrid RAG', 'FastAPI', 'SQLite / Postgres', 'AST Sandbox', 'Docker Compose'],
            metrics: [
                { val: '0.0', lbl: 'False Verified Rate Gate' },
                { val: '3 Services', lbl: 'Gateway, RAG & Solver' },
                { val: 'python -I -S', lbl: 'Isolated Exec Sandbox' },
            ],
            tabs: {
                overview: {
                    heading: 'Overview & Core Capabilities',
                    paragraphs: [
                        'StudyLab is a NotebookLM-inspired learning and research platform built specifically for AI, data science, analytics, and finance learners.',
                        'Rather than returning unverified prose, it separates document-grounded retrieval from deterministic symbolic, finance-formula, and sandboxed Python code execution.'
                    ],
                    bullets: [
                        '<strong>Hybrid Grounded Q&A:</strong> Combines sparse keyword matching for formulas/tickers/symbols with dense semantic retrieval and reranking.',
                        '<strong>Verified Solver Engine:</strong> Handles symbolic/math, financial formulas, and sandboxed code execution with cacheable reveal-ready step explanations.',
                        '<strong>Complete Learning Surfaces:</strong> Supports notebooks, source guides, teaching whiteboards, verified-key quizzes, question papers, and Notion export.'
                    ],
                    codeTitle: 'Local Verification & Eval Gate',
                    code: `python -m unittest discover tests
python packages/eval/run_eval.py
# Required gate: false_verified_rate == 0`
                },
                problem: {
                    heading: 'Safety & Verification Design',
                    paragraphs: [
                        'Educational AI platforms face two critical failure modes: inventing citations from uploaded notes, and marking wrong numerical answers as verified.',
                        'StudyLab resolves both using strict character-offset citations with low-confidence rejection and a sandboxed execution pipeline.'
                    ],
                    bullets: [
                        '<strong>AST Allowlist Enforcement:</strong> Before running <code>code_exec</code>, user/model snippets pass an AST validator allowing only safe standard-library modules with zero filesystem or network escapes.',
                        '<strong>Isolated Subprocess Execution:</strong> Approved snippets run under <code>python -I -S</code> (isolated mode, no site-packages); failing or rejected runs are marked <code>unverified</code>.',
                        '<strong>Evaluation Harness Gate:</strong> <code>packages/eval/run_eval.py</code> enforces <code>false_verified_rate == 0</code> so unverified outputs never masquerade as checked answer keys.'
                    ],
                    codeTitle: 'Hybrid Retrieval & Citation Contract',
                    code: `1. Sparse keyword scoring (exact formulas, tickers, definitions)
2. Dense semantic scoring (embedding provider interface)
3. Reranking over candidate chunks
4. Citation output: { source_id, chunk_index, start_char, end_char, score }
5. Low-confidence rejection -> refuse unsupported grounded answers`
                },
                architecture: {
                    heading: 'Three-Service Modular Architecture',
                    paragraphs: [
                        'The dependency-light Python core (packages/studylab_core) powers three independently runnable HTTP services backed by either an ephemeral in-memory store or durable SQLite persistence.',
                        'The SQLite schema mirrors the production PostgreSQL migrations (packages/db/migrations), while the retriever mirrors Qdrant named vectors (dense, sparse, late_interaction).'
                    ],
                    bullets: [
                        '<strong><code>gateway</code> (Port 8000):</strong> Full unified API surface for notebooks, sessions, whiteboards, quizzes, and Notion export.',
                        '<strong><code>rag</code> (Port 8001):</strong> Dedicated ingestion, source guides, hybrid retrieval, and artifact generation.',
                        '<strong><code>solver</code> (Port 8002):</strong> Isolated symbolic, finance-formula, and AST-sandboxed code verification service.'
                    ],
                    codeTitle: 'Service & Persistence Layout',
                    code: `apps/web/                # Frontend web client
services/
  ├── gateway/           # :8000 unified surface
  ├── rag/               # :8001 notebooks, sources, ask, artifacts
  └── solver/            # :8002 solve & reveal
packages/
  ├── studylab_core/     # Hybrid RAG, sandbox, prompt registry
  ├── db/migrations/     # SQLite <-> Postgres parity contract
  └── eval/run_eval.py   # Zero false-verified gate`
                },
                verification: {
                    heading: 'Persistence, Prompts & Docker Deployment',
                    paragraphs: [
                        'StudyLab runs zero-dependency locally for rapid testing or across Docker Compose containers with shared volume persistence.',
                        'Prompt templates are versioned and indexed in packages/prompts/registry.json and loaded deterministically via load_prompt / render_prompt.'
                    ],
                    bullets: [
                        '<strong>Durable Local Runs:</strong> Set <code>STUDYLAB_SQLITE_PATH=data/studylab.db</code> to persist notebooks and attempts across restarts.',
                        '<strong>Containerized Stack:</strong> <code>docker compose -f infra/compose/docker-compose.yml up --build</code>.',
                        '<strong>Web Build Verified:</strong> Frontend production bundle builds via <code>apps/web</code> (<code>npm run build</code>).'
                    ],
                    codeTitle: 'Durable Startup (PowerShell)',
                    code: `$env:STUDYLAB_SQLITE_PATH = "data/studylab.db"
$env:NOTION_MOCK_EXPORT = "true"
python -m services.gateway.app.main`
                }
            }
        },
        finmod: {
            title: 'FinMod-Agent (FMVA) — Financial Modeling & Valuation Engine',
            repoUrl: 'https://github.com/Hellinferno/finmod-agent',
            stack: ['Python', 'FastAPI', 'Pydantic', 'React', 'Tailwind CSS', 'Recharts', 'yfinance', 'pytest'],
            metrics: [
                { val: '40 / 40', lbl: 'Passing Pytest Modules' },
                { val: '500+', lbl: 'Schema Field Aliases' },
                { val: '9 Screens', lbl: 'React Valuation Cockpit' },
            ],
            tabs: {
                overview: {
                    heading: 'Overview & Institutional Valuation Pipeline',
                    paragraphs: [
                        'FinMod-Agent (FMVA) is a deterministic financial modeling and valuation engine paired with a 9-screen interactive React workstation.',
                        'It ingests raw JSON financial statements, normalizes 500+ line-item aliases into canonical Pydantic schemas, runs full DCF and Comparable Company valuations, and records an immutable audit trail.'
                    ],
                    bullets: [
                        '<strong>Balance Sheet Checker:</strong> Automatically detects Assets != Liabilities + Equity imbalances and suggests accounting plugs before valuation runs.',
                        '<strong>Dual Terminal Value DCF:</strong> Computes Unlevered Free Cash Flow (UFCF) and Enterprise Value via both Gordon Growth and Exit Multiple methodologies.',
                        '<strong>Live Market Inputs:</strong> Calculates CAPM WACC using live beta and peer multiples fetched via <code>yfinance</code>.'
                    ],
                    codeTitle: 'One-Command Full Valuation Pipeline',
                    code: `from fmva.pipeline import run_full_pipeline

result = run_full_pipeline("data/fixtures/techcorp.json", scenario="base")
print(f"Company:            {result.metadata.company_name}")
print(f"EV (Gordon Growth): \${result.dcf.enterprise_value_gordon:,.0f}M")
print(f"EV (Exit Multiple): \${result.dcf.enterprise_value_exit_multiple:,.0f}M")`
                },
                problem: {
                    heading: 'Eliminating Black-Box Financial Math',
                    paragraphs: [
                        'Applying LLMs directly to financial statements causes silent arithmetic drift, inconsistent line-item naming, and unexplainable valuation numbers.',
                        'FMVA strictly isolates deterministic financial math (Pydantic + NumPy/Python engines) from optional Jinja2/LLM narrative generation, logging every calculation step.'
                    ],
                    bullets: [
                        '<strong>500+ Field Alias Normalization:</strong> Maps heterogeneous corporate reporting labels into a single validated canonical schema.',
                        '<strong>Sensitivity Monotonicity Checks:</strong> Verifies WACC vs. Terminal Growth Rate (TGR) 2D valuation matrices satisfy economic monotonicity.',
                        '<strong>Immutable Audit Trail:</strong> Every assumption, intermediate UFCF, discount factor, and output is captured in <code>audit/trail.py</code> and exported.'
                    ],
                    codeTitle: 'FMVA Engine Modules',
                    code: `fmva/
├── core/       # ingestion, normalization (500+ aliases), checker, schemas
├── engines/    # assumptions (Bear/Base/Bull), projection, dcf, wacc, comps, sensitivity
├── audit/      # immutable calculation log (trail.py)
├── export/     # multi-sheet Excel workbook & structured JSON
└── llm/        # Jinja2 prompts & narrative synthesis (scaffolded)`
                },
                architecture: {
                    heading: 'Backend Engines & 9-Screen React Cockpit',
                    paragraphs: [
                        'The FastAPI backend exposes the full valuation pipeline over REST, feeding a Vite + React + Tailwind + Recharts frontend designed with a crisp black/white/light-blue institutional interface.',
                        'Users can step through every stage of an investment banking model interactively in the browser.'
                    ],
                    bullets: [
                        '<strong>Interactive Views:</strong> Dashboard, Data Ingestion, Assumptions Engine (Bear/Base/Bull), DCF Valuation, 3-Statement Model, Trading Comps, Sensitivity Analysis, Audit Trail, and Export Center.',
                        '<strong>Fixture Coverage:</strong> Ships with three complete company profiles across SaaS (TechCorp Inc), Industrials (ManufactureCo Ltd), and Retail (RetailChain Corp).',
                        '<strong>Multi-Sheet Excel Export:</strong> Produces formatted workbooks covering financials, DCF schedules, comps tables, and audit logs.'
                    ],
                    codeTitle: 'Running Backend + Frontend Locally',
                    code: `# Terminal 1: FastAPI Valuation Engine
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2: 9-Screen React Cockpit
cd frontend && npm install && npm run dev  # http://localhost:5173`
                },
                verification: {
                    heading: 'Test Suite & Validation Coverage',
                    paragraphs: [
                        'All core modeling, normalization, balance sheet checking, DCF/WACC math, comparable multiples, sensitivity monotonicity, and audit immutability rules are verified by 40 automated pytest tests.',
                        'Six step-by-step interactive notebooks in colab/ allow reproducing each stage from data ingestion to full valuation.'
                    ],
                    bullets: [
                        '<strong><code>test_audit.py</code> (6 tests):</strong> Audit trail logging, immutability, and export validation.',
                        '<strong><code>test_comps_sensitivity.py</code> (9 tests):</strong> Comps statistics, multiples, and 2D sensitivity matrices.',
                        '<strong><code>test_dcf.py</code> (10 tests) + <code>test_ingestion.py</code> (11 tests) + <code>test_integration.py</code> (4 tests):</strong> Full pipeline verification across all 3 fixture companies.'
                    ],
                    codeTitle: 'Pytest Verification Output',
                    code: `$ pytest -v
# test_audit.py ............... 6 passed
# test_comps_sensitivity.py ... 9 passed
# test_dcf.py ................. 10 passed
# test_ingestion.py ........... 11 passed
# test_integration.py ......... 4 passed
# ================= 40 passed in 9.22s =================`
                }
            }
        }
    };

    const htmlEl = document.documentElement;
    const themeButtons = document.querySelectorAll('[data-theme-choice]');
    const motionButtons = document.querySelectorAll('[data-motion-toggle]');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');

    // ── Theme Management ──
    function applyTheme(themeName) {
        const valid = ['obsidian', 'editorial', 'daylight'].includes(themeName) ? themeName : 'obsidian';
        htmlEl.setAttribute('data-theme', valid);
        localStorage.setItem('ravi_theme', valid);

        themeButtons.forEach((btn) => {
            const isMatch = btn.getAttribute('data-theme-choice') === valid;
            btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
        });

        if (window.SymbiontControl && typeof window.SymbiontControl.setTheme === 'function') {
            window.SymbiontControl.setTheme(valid);
        }
    }

    const savedTheme = localStorage.getItem('ravi_theme') || 'obsidian';
    applyTheme(savedTheme);

    themeButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            applyTheme(btn.getAttribute('data-theme-choice'));
        });
    });

    // ── Motion Toggle Management ──
    function updateMotionLabels() {
        const running = window.SymbiontControl ? window.SymbiontControl.isRunning() : true;
        motionButtons.forEach((btn) => {
            btn.textContent = running ? 'Pause BG' : 'Play BG';
            btn.setAttribute('aria-pressed', running ? 'false' : 'true');
        });
    }

    motionButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            if (window.SymbiontControl && typeof window.SymbiontControl.toggleMotion === 'function') {
                window.SymbiontControl.toggleMotion();
                updateMotionLabels();
            }
        });
    });
    updateMotionLabels();

    // ── Mobile Drawer ──
    if (mobileMenuBtn && mobileDrawer) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = mobileDrawer.classList.toggle('open');
            mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        mobileDrawer.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                mobileDrawer.classList.remove('open');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
                mobileDrawer.classList.remove('open');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ── Interactive Case Studies Workbench ──
    let activeStudy = 'claimlab';
    let activeTab = 'overview';

    const studyButtons = document.querySelectorAll('[data-case-select]');
    const tabButtons = document.querySelectorAll('[data-case-tab]');
    const studyPanel = document.getElementById('case-study-panel');

    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function renderCaseStudy() {
        if (!studyPanel) return;
        const study = CASE_STUDIES[activeStudy];
        if (!study) return;
        const tab = study.tabs[activeTab] || study.tabs.overview;

        studyButtons.forEach((btn) => {
            btn.setAttribute('aria-selected', btn.getAttribute('data-case-select') === activeStudy ? 'true' : 'false');
        });
        tabButtons.forEach((btn) => {
            btn.setAttribute('aria-selected', btn.getAttribute('data-case-tab') === activeTab ? 'true' : 'false');
        });

        const paragraphsHtml = tab.paragraphs.map((p) => `<p>${p}</p>`).join('');
        const bulletsHtml = tab.bullets.map((b) => `<li>${b}</li>`).join('');
        const metricsHtml = study.metrics
            .map((m) => `<div class="metric-box"><div class="val">${m.val}</div><div class="lbl">${m.lbl}</div></div>`)
            .join('');
        const stackHtml = study.stack.map((s) => `<span class="tag">${s}</span>`).join('');

        studyPanel.innerHTML = `
            <div class="case-grid">
                <div>
                    <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;margin-bottom:12px;">
                        <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--accent-primary);text-transform:uppercase;letter-spacing:0.08em;">${study.title}</span>
                        <a href="${study.repoUrl}" target="_blank" rel="noopener noreferrer" class="link-pill primary">View Repository ↗</a>
                    </div>
                    <h3>${tab.heading}</h3>
                    ${paragraphsHtml}
                    <ul class="case-list">${bulletsHtml}</ul>
                    <div class="case-metrics-row">${metricsHtml}</div>
                </div>
                <div>
                    <div style="font-family:var(--font-mono);font-size:0.75rem;color:var(--text-muted);margin-bottom:8px;">// ${tab.codeTitle}</div>
                    <pre class="code-block"><code>${escapeHtml(tab.code)}</code></pre>
                    <div style="margin-top:16px;">
                        <div style="font-family:var(--font-mono);font-size:0.72rem;color:var(--text-muted);margin-bottom:8px;">VERIFIED STACK</div>
                        <div class="tag-row">${stackHtml}</div>
                    </div>
                </div>
            </div>
        `;
    }

    studyButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            activeStudy = btn.getAttribute('data-case-select');
            renderCaseStudy();
        });
    });

    tabButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            activeTab = btn.getAttribute('data-case-tab');
            renderCaseStudy();
        });
    });

    document.querySelectorAll('[data-inspect-study]').forEach((btn) => {
        btn.addEventListener('click', () => {
            activeStudy = btn.getAttribute('data-inspect-study');
            activeTab = 'overview';
            renderCaseStudy();
            const target = document.getElementById('case-studies');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    renderCaseStudy();

    // ── Copy Email Helper ──
    const copyEmailBtn = document.getElementById('copy-email-btn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', async () => {
            const email = 'b25bs1273@iitj.ac.in';
            try {
                await navigator.clipboard.writeText(email);
                copyEmailBtn.textContent = 'Copied b25bs1273@iitj.ac.in ✓';
                setTimeout(() => {
                    copyEmailBtn.textContent = 'Copy Email';
                }, 2200);
            } catch {
                copyEmailBtn.textContent = email;
            }
        });
    }

    // ── Scroll Reveal & Active Nav Scroll-Spy ──
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
        );
        revealEls.forEach((el) => revealObserver.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add('is-visible'));
    }

    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const sections = Array.from(navLinks)
        .map((a) => document.querySelector(a.getAttribute('href')))
        .filter(Boolean);

    if ('IntersectionObserver' in window && sections.length > 0) {
        const spyObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = '#' + entry.target.id;
                        navLinks.forEach((link) => {
                            link.classList.toggle('active', link.getAttribute('href') === id);
                        });
                    }
                });
            },
            { rootMargin: '-30% 0px -55% 0px' }
        );
        sections.forEach((sec) => spyObserver.observe(sec));
    }

    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
})();
