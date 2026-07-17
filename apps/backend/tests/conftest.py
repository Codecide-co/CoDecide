import pytest

from app import create_app


@pytest.fixture
def app():
    app = create_app()

    app.config.update(
        TESTING=True,
        SQLALCHEMY_DATABASE_URI="sqlite:///:memory:"
    )

    yield app


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def test_user(client):
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "password123",
            "apartment": "101",
            "tower": "A",
        },
    )

    return response


@pytest.fixture
def login(client, test_user):
    def _login(email, password):
        return client.post(
            "/api/auth/login",
            json={
                "email": email,
                "password": password,
            },
        )

    return _login


@pytest.fixture
def auth_headers(login):
    response = login("test@example.com", "password123")

    token = response.get_json()["token"]

    return {
        "Authorization": f"Bearer {token}"
    }