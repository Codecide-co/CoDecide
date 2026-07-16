"""
Application entry point.

Creates and runs the Flask application with a colored ASCII banner
displaying the app name, version, and current Git commit hash.
"""

from colorama import init, Fore, Style

from app import create_app
from app.utils.git import get_git_commit
from app.constants import (
    APP_NAME, APP_VERSION
)

app = create_app()

init(autoreset=True)

def get_banner() -> str:
    """
    Generate the ASCII startup banner with version and commit info.

    Returns:
        str: Colored banner string with app name, version, and commit hash.
    """

    commit: str = get_git_commit()
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

if __name__ == "__main__":
    print(get_banner())
    app.run(debug=False)
