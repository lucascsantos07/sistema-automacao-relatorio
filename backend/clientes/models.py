from django.db import models

from django.db.models.functions import Length
from django.db.models.lookups import In


class Cliente(models.Model):
    nome = models.CharField(max_length=150)
    email = models.EmailField(max_length=150)
    cpf_cnpj = models.CharField(max_length=14, unique=True)
    username = models.CharField(max_length=30, unique=True)
    telefone = models.CharField(max_length=15)
    endereco = models.CharField(max_length=200)
    ativo = models.BooleanField(default=True)
    justificativa_exclusao = models.CharField(max_length=250, null=True, blank=True)
    justificativa_ativacao = models.CharField(max_length=250, null=True, blank=True)

    class Meta:
        db_table = "cliente"
        ordering = ["nome"]
        constraints = [
            models.CheckConstraint(
                condition=In(Length("cpf_cnpj"), [11, 14]),
                name="cliente_cpf_cnpj_tamanho_valido",
            ),
        ]

    @property
    def tipo(self):
        """CPF (11 dígitos) ou CNPJ (14). Deduzido do documento, não é coluna."""
        return "CPF" if len(self.cpf_cnpj) == 11 else "CNPJ"

    def __str__(self):
        return f"{self.nome} (@{self.username})"
