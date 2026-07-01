from colorama import Fore, Style

from app.utils.git import get_git_commit

APP_NAME: str = "CokeDecide"
APP_VERSION: str = "0.1.0"


def get_banner() -> str:
    commit = get_git_commit()
    return rf"""{Fore.CYAN}
 ██████╗ ██████╗ ██╗  ██╗███████╗██████╗ ███████╗ ██████╗██╗██████╗ ███████╗
██╔════╝██╔═══██╗██║ ██╔╝██╔════╝██╔══██╗██╔════╝██╔════╝██║██╔══██╗██╔════╝
██║     ██║   ██║█████╔╝ █████╗  ██║  ██║█████╗  ██║     ██║██║  ██║█████╗
██║     ██║   ██║██╔═██╗ ██╔══╝  ██║  ██║██╔══╝  ██║     ██║██║  ██║██╔══╝
╚██████╗╚██████╔╝██║  ██╗███████╗██████╔╝███████╗╚██████╗██║██████╔╝███████╗
 ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═════╝ ╚══════╝ ╚═════╝╚═╝╚═════╝ ╚══════╝
{Style.RESET_ALL}
    {Fore.YELLOW}{APP_NAME} v{APP_VERSION}{Style.RESET_ALL}
    {Fore.CYAN}──────────────────────────────────────{Style.RESET_ALL}
    Commit: {Fore.GREEN}{commit}{Style.RESET_ALL}
"""
