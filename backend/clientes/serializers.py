from rest_framework import serializers

from .models import Cliente


class ClienteSerializer(serializers.ModelSerializer):
    """Serializador completo para leitura e escrita do model Cliente."""

    tipo = serializers.CharField(read_only=True)

    class Meta:
        model = Cliente
        fields = [
            "id",
            "nome",
            "email",
            "cpf_cnpj",
            "username",
            "telefone",
            "endereco",
            "ativo",
            "justificativa_exclusao",
            "justificativa_ativacao",
            "tipo",
        ]
        read_only_fields = ["id", "tipo"]

    # ------------------------------------------------------------------ #
    # Validações de campo                                                  #
    # ------------------------------------------------------------------ #

    def validate_cpf_cnpj(self, value: str) -> str:
        """Aceita apenas dígitos com 11 (CPF) ou 14 (CNPJ) caracteres."""
        digits = "".join(filter(str.isdigit, value))
        if len(digits) not in (11, 14):
            raise serializers.ValidationError(
                "cpf_cnpj deve ter 11 dígitos (CPF) ou 14 dígitos (CNPJ)."
            )
        return digits

    def validate_username(self, value: str) -> str:
        """Remove o símbolo '@' caso o frontend o envie."""
        return value.lstrip("@").strip()


class ClienteListSerializer(serializers.ModelSerializer):
    """Serializador resumido para a listagem de clientes (sem justificativas)."""

    tipo = serializers.CharField(read_only=True)

    class Meta:
        model = Cliente
        fields = [
            "id",
            "nome",
            "email",
            "cpf_cnpj",
            "username",
            "telefone",
            "endereco",
            "ativo",
            "tipo",
        ]


class AlterarStatusSerializer(serializers.Serializer):
    """Serializador para o endpoint PATCH /clientes/<id>/status."""

    ativo = serializers.BooleanField()
    justificativa_exclusao = serializers.CharField(
        max_length=250, required=False, allow_null=True, allow_blank=True
    )
    justificativa_ativacao = serializers.CharField(
        max_length=250, required=False, allow_null=True, allow_blank=True
    )

    def validate(self, data):
        ativo = data.get("ativo")
        if ativo is False and not data.get("justificativa_exclusao"):
            raise serializers.ValidationError(
                {"justificativa_exclusao": "Obrigatória ao inativar o cliente."}
            )
        if ativo is True and not data.get("justificativa_ativacao"):
            raise serializers.ValidationError(
                {"justificativa_ativacao": "Obrigatória ao reativar o cliente."}
            )
        return data
