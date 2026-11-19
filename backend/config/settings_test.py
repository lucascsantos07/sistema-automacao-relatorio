"""
Settings específicas para testes automatizados.
Usa SQLite em memória para não depender do PostgreSQL/Docker.
"""
import os

# Injeta variáveis mínimas antes de importar o settings principal
os.environ.setdefault("DJANGO_SECRET_KEY", "test-secret-key")
os.environ.setdefault("DB_NAME", "test")
os.environ.setdefault("DB_USER", "test")
os.environ.setdefault("DB_PASSWORD", "test")

from .settings import *  # noqa: F401, F403, E402

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}
