from pathlib import Path

GIT_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent / ".git"


def get_git_commit() -> str:
    try:
        head = (GIT_DIR / "HEAD").read_text().strip()
        if head.startswith("ref:"):
            ref = head.split(": ")[1].strip()
            return (GIT_DIR / ref).read_text().strip()[:7]
        return head[:7]
    except Exception:
        return "unknown"


def get_build_timestamp() -> str:
    try:
        import datetime
        ts = GIT_DIR.stat().st_mtime
        return datetime.datetime.fromtimestamp(ts).isoformat()
    except Exception:
        import datetime
        return datetime.datetime.now().isoformat()
