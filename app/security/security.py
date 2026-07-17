"""FastAPI security primitives."""

from fastapi.security import OAuth2PasswordBearer

from app.core.constants import API_V1_PREFIX

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{API_V1_PREFIX}/auth/login")
