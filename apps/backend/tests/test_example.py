def test_health(client):
    response = client.get("/api/hello")

    assert response.status_code == 200


def test_profile(client, auth_headers):
    response = client.get(
        "/api/auth/me",
        headers=auth_headers
    )

    assert response.status_code == 200