"""Logging configuration for API, access, and security logs."""

import logging
from logging.handlers import RotatingFileHandler

from app.config.settings import Settings


def configure_logging(settings: Settings) -> None:
    """Configure rotating file logs and console output."""

    settings.log_dir.mkdir(parents=True, exist_ok=True)

    formatter = logging.Formatter(
        "%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    )
    root = logging.getLogger()
    root.setLevel(settings.log_level)
    root.handlers.clear()

    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    root.addHandler(console_handler)

    app_handler = RotatingFileHandler(
        settings.log_dir / "app.log",
        maxBytes=10 * 1024 * 1024,
        backupCount=5,
        encoding="utf-8",
    )
    app_handler.setFormatter(formatter)
    root.addHandler(app_handler)

    for logger_name, file_name in {
        "access": "access.log",
        "security": "security.log",
    }.items():
        logger = logging.getLogger(logger_name)
        logger.setLevel(settings.log_level)
        logger.propagate = False
        logger.handlers.clear()

        file_handler = RotatingFileHandler(
            settings.log_dir / file_name,
            maxBytes=10 * 1024 * 1024,
            backupCount=5,
            encoding="utf-8",
        )
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
        logger.addHandler(console_handler)
