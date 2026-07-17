"""API response envelope tests."""

import json

from app.core.responses import error_response, success_response


def test_success_response_contract() -> None:
    """Success responses should use the standard envelope."""

    response = success_response("ok", {"id": "1"})
    payload = json.loads(response.body)

    assert payload == {
        "success": True,
        "message": "ok",
        "data": {"id": "1"},
        "errors": None,
    }


def test_error_response_contract() -> None:
    """Error responses should use the standard envelope."""

    response = error_response("bad", [{"field": "x", "message": "bad", "code": "bad"}])
    payload = json.loads(response.body)

    assert payload["success"] is False
    assert payload["data"] is None
    assert payload["errors"][0]["field"] == "x"
