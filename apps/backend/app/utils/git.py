"""
Git metadata utilities.

Provides functions to retrieve the current commit hash and build timestamp
from the local Git repository.
"""

from pathlib import Path

GIT_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent / ".git"


def get_git_commit() -> str:
    """
    Get the short hash of the current Git commit.

    Returns:
        str: The first 7 characters of the commit hash, or "unknown" if
            the Git directory is not accessible.
    """
    try:
        head = (GIT_DIR / "HEAD").read_text().strip()
        if head.startswith("ref:"):
            ref = head.split(": ")[1].strip()
            return (GIT_DIR / ref).read_text().strip()[:7]
        return head[:7]
    except Exception:
        return "unknown"


def get_build_timestamp() -> str:
    """
    Get the modification timestamp of the Git directory as build time.

    Falls back to the current time if the Git directory is not accessible.

    Returns:
        str: ISO-formatted timestamp string.
    """
    try:
        import datetime
        ts = GIT_DIR.stat().st_mtime
        return datetime.datetime.fromtimestamp(ts).isoformat()
    except Exception:
        import datetime
        return datetime.datetime.now().isoformat()
