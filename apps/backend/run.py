from colorama import init
from app import create_app
from app.constants import get_banner

app = create_app()

init(autoreset=True)

if __name__ == "__main__":
    print(get_banner())
    app.run(debug=False)
