from fastapi import FastAPI

from app.core.config import get_settings

settings = get_settings()

app = FastAPI(title=settings.app_name, version="0.1.0")


@app.get("/health", tags=["health"])
def healthcheck() -> dict[str, str]:
    """Return process health without checking future domain dependencies."""
    return {"status": "ok", "environment": settings.environment}
