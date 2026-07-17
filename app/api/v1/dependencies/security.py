"""Security dependencies for request payloads."""

from fastapi import Request

from app.validators.security import reject_nosql_injection


async def validate_safe_json_payload(request: Request) -> None:
    """Validate JSON request bodies against simple NoSQL injection patterns."""

    if request.method not in {"POST", "PUT", "PATCH"}:
        return
    content_type = request.headers.get("content-type", "")
    if "application/json" not in content_type:
        return
    body = await request.json()
    reject_nosql_injection(body)
