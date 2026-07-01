"""
Custom logger with tag and level filtering for CokeDecide.

Provides thread-safe logging with color-coded output, tag-based
filtering, and per-tag level suppression rules.
"""

import threading
from enum import StrEnum, unique
from typing import Literal, Final, Dict, Set
from datetime import datetime
from colorama import Fore, Style

# Global lock to prevent interleaved output across threads.
_log_lock = threading.Lock()

# If non-empty, only these tags will produce output. Empty = show all.
ENABLED_TAGS: Final[Set[str]] = set()

# Levels globally suppressed for all tags.
DISABLED_LEVELS: Final[Set[str]] = set()

# Per-tag rules: maps a tag to the set of levels to suppress for that tag.
TAG_LEVEL_RULES: Dict[str, Set[str]] = {
    "DEBUG": {"DEBUG"},
}

LogLevel = Literal["INFO", "SUCCESS", "WARNING", "ERROR", "DEBUG", "CRITICAL"]


@unique
class Tags(StrEnum):
    """Tags matching CokeDecide backend modules and domains."""

    MAIN = "MAIN"
    AUTH = "AUTH"
    REPORTS = "REPORTS"
    COMUNICADOS = "COMUNICADOS"
    ROUTES = "ROUTES"
    MODELS = "MODELS"
    SERVICES = "SERVICES"
    MIDDLEWARE = "MIDDLEWARE"
    SCHEMAS = "SCHEMAS"
    MONGO = "MONGO"
    CONFIG = "CONFIG"
    DB = "DATABASE"
    API = "API"
    ADMIN = "ADMIN"
    UTILS = "UTILS"


def log(level: LogLevel, tag: Tags | str, message: str) -> None:
    """
    Print a log message filtered by level and tag.

    The message is suppressed if:
    - The level is in DISABLED_LEVELS.
    - ENABLED_TAGS is non-empty and the tag is not in it.
    - The tag has a rule in TAG_LEVEL_RULES that suppresses this level.

    Args:
        level: Log level (INFO, SUCCESS, WARNING, ERROR, DEBUG, CRITICAL).
        tag: Module or domain tag identifying the source.
        message: The message to print.

    Returns:
        None
    """
    level_up: str = level.upper()
    tag_up: str = tag.upper() if not isinstance(tag, Tags) else tag.value

    if level_up in DISABLED_LEVELS:
        return

    if ENABLED_TAGS and tag_up not in ENABLED_TAGS:
        return

    if tag_up in TAG_LEVEL_RULES and level_up in TAG_LEVEL_RULES[tag_up]:
        return

    timestamp: str = datetime.now().strftime("%H:%M:%S")

    colors: Final[Dict[str, str]] = {
        "INFO": Fore.CYAN,
        "SUCCESS": Fore.GREEN,
        "WARNING": Fore.YELLOW,
        "ERROR": Fore.RED,
        "DEBUG": Fore.MAGENTA,
        "CRITICAL": Fore.RED + Style.BRIGHT,
    }

    color: str = colors.get(level_up, Fore.WHITE)

    lvl_fmt: str = f"{level_up:^9}"
    tag_fmt: str = f"{tag_up:^20}"

    with _log_lock:
        print(
            f"{Style.DIM}{timestamp}{Style.RESET_ALL} "
            f"[{color}{lvl_fmt}{Style.RESET_ALL}] "
            f"[{Fore.WHITE}{Style.BRIGHT}{tag_fmt}{Style.RESET_ALL}] "
            f"{message}"
        )
