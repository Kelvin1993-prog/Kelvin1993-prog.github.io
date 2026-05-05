"""
Portfolio forensic eval — run this any time before pushing.
Checks that no original template content survives and that copy reads naturally.

Usage:
    python evals.py
"""

import re
import sys
from pathlib import Path

PORTFOLIO_DIR = Path(__file__).parent
SOURCE_FILES  = ["index.html", "script.js", "style.css"]

# ── 1. Template identity leakage ─────────────────────────────────────────────
FORBIDDEN_STRINGS = [
    # Original author names / handles
    "Barbara",
    "Obayi",
    "ouyale",
    "barbarabracie",
    "Obayi_Barbara",
    "barbara",
    # Original job title
    "ML & AI Engineer",
    "Data Scientist",
    "Machine Learning Engineer",
    # Original links
    "ouyale.github.io",
    "barbara-weroba",
    "linkedin.com/in/barbara",
    # Original asset filenames
    "Obayi_Barbara_Resume",
    "profile photo.jpg",   # original filename with space
    # Original university
    "MSc in Machine Learning",
    "MSc Machine Learning",
    # Original project links (ouyale repos)
    "ouyale/Early",
    "ouyale/Predicting",
    "ouyale/Data_Visualisation",
    "ouyale/sustainable",
    "ouyale/Spotify",
    "ouyale/Maji",
    "ouyale/Machine-Learning",
    "ouyale/Exploratory",
    "ouyale/Data-Mining",
    "ouyale/Movie",
    "ouyale/Sales",
    # Original skill tags
    "MATLAB",
    "MLflow",
    "SciPy",
    "BigQuery",
    "DataProc",
    "Google Cloud",
    "DagsHub",
    "Kenyan farmers",
    "smallholder farms",
    "Gen Z",
    "Millennial shopping",
]

# ── 2. Em dash usage ─────────────────────────────────────────────────────────
EM_DASH_PATTERN = re.compile(r"—")

# ── 3. AI cliché phrases ─────────────────────────────────────────────────────
AI_CLICHES = [
    r"\bleverage[sd]?\b",
    r"\bdelve[sd]?\b",
    r"\bseamlessly\b",
    r"\bcutting.edge\b",
    r"\brobust\b",
    r"\bpassionate about\b",
    r"\bin today.s (fast.paced|digital|data.driven)\b",
    r"\bin the realm of\b",
    r"\bfoster(ing)? (a )?(culture|environment|mindset)\b",
    r"\blandscape\b",
    r"\bsynergy\b",
    r"\bpivot(al|ing)?\b",
    r"\bholistic(ally)?\b",
    r"\btailored solution\b",
    r"\bworld.class\b",
]

# ── 4. Required identity strings (must be present) ───────────────────────────
REQUIRED_STRINGS = {
    "index.html": [
        "Chukwuebuka Nnabugwu",
        "Kelvin1993-prog",
        "nnabugwukelvin.chukwuebuka@gmail.com",
        "nnabugwu-chukwuebuka",
        "JadaSquad",
        "dbt_analytics",
        "dbt_projects",
        "Chinook-Business-Analysis",
        "NYC-analysis-using-python",
        "Gym-User-Web-App",
        "World-cup-Football-Analysis",
        "University of Salford",
    ],
    "script.js": [
        "dbt run",
        "CLUSTER BY",
        "fct_transactions",
    ],
}

# ── Runner ────────────────────────────────────────────────────────────────────

def check_file(filename: str) -> list[str]:
    path = PORTFOLIO_DIR / filename
    if not path.exists():
        return [f"MISSING FILE: {filename}"]

    text = path.read_text(encoding="utf-8")
    issues = []

    # 1. Forbidden strings
    for token in FORBIDDEN_STRINGS:
        if token.lower() in text.lower():
            issues.append(f"[TEMPLATE LEAK] '{token}' found in {filename}")

    # 2. Em dashes
    matches = list(EM_DASH_PATTERN.finditer(text))
    if matches:
        for m in matches:
            line_no = text[: m.start()].count("\n") + 1
            snippet = text[max(0, m.start()-30): m.end()+30].replace("\n", " ").strip()
            issues.append(f"[EM DASH] line {line_no} in {filename}: ...{snippet}...")

    # 3. AI clichés (HTML/text content only, skip JS/CSS logic lines)
    if filename.endswith(".html"):
        for pattern in AI_CLICHES:
            found = re.search(pattern, text, re.IGNORECASE)
            if found:
                line_no = text[: found.start()].count("\n") + 1
                issues.append(
                    f"[AI CLICHE] '{found.group()}' at line {line_no} in {filename} — rephrase naturally"
                )

    # 4. Required strings
    required = REQUIRED_STRINGS.get(filename, [])
    for token in required:
        if token not in text:
            issues.append(f"[MISSING CONTENT] '{token}' not found in {filename}")

    return issues


def main():
    print("\n" + "=" * 60)
    print("  PORTFOLIO FORENSIC EVAL")
    print("=" * 60)

    all_issues = []
    for f in SOURCE_FILES:
        file_issues = check_file(f)
        all_issues.extend(file_issues)

    # Check assets
    assets_dir = PORTFOLIO_DIR / "assets"
    for required_asset in ["profile.png", "cv.pdf"]:
        if not (assets_dir / required_asset).exists():
            all_issues.append(
                f"[MISSING ASSET] assets/{required_asset} — add your photo/CV before deploying"
            )

    if not all_issues:
        print("\n  ALL CHECKS PASSED — portfolio is clean and ready.\n")
    else:
        print(f"\n  {len(all_issues)} issue(s) found:\n")
        for issue in all_issues:
            category = issue.split("]")[0].lstrip("[")
            colours = {
                "TEMPLATE LEAK": "\033[91m",   # red
                "EM DASH":       "\033[93m",   # yellow
                "AI CLICHE":     "\033[94m",   # blue
                "MISSING CONTENT": "\033[91m", # red
                "MISSING FILE":  "\033[91m",   # red
                "MISSING ASSET": "\033[93m",   # yellow
            }
            colour = colours.get(category, "\033[0m")
            print(f"  {colour}{issue}\033[0m")
        print()

    print("=" * 60 + "\n")
    sys.exit(1 if all_issues else 0)


if __name__ == "__main__":
    main()
