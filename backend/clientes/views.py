from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .models import Cliente
from .serializers import (
    AlterarStatusSerializer,
    ClienteListSerializer,
    ClienteSerializer,
)


class ClienteViewSet(ModelViewSet):
    """
    ViewSet do CRUD de Clientes.

    Rotas geradas pelo router:
        GET    /clientes/              → list
        POST   /clientes/              → create
        GET    /clientes/<id>/         → retrieve
        PUT    /clientes/<id>/         → update
        PATCH  /clientes/<id>/         → partial_update
        DELETE /clientes/<id>/         → destroy (desabilitado)
        PATCH  /clientes/<id>/status/  → alterar_status
    """

    queryset = Cliente.objects.all()

    def get_serializer_class(self):
        if self.action == "list":
            return ClienteListSerializer
        if self.action == "alterar_status":
            return AlterarStatusSerializer
        return ClienteSerializer

    # ------------------------------------------------------------------ #
    # Listagem com filtros e paginação manual                              #
    # ------------------------------------------------------------------ #

    def list(self, request, *args, **kwargs):
        qs = Cliente.objects.all()

        # Busca textual: nome, e-mail, username ou cpf_cnpj
        q = request.query_params.get("q", "").strip()
        if q:
            qs = qs.filter(
                Q(nome__icontains=q)
                | Q(email__icontains=q)
                | Q(username__icontains=q)
                | Q(cpf_cnpj__icontains="".join(filter(str.isdigit, q)) or q)
            )

        # Filtro por tipo (PF = 11 dígitos / PJ = 14 dígitos)
        tipo = request.query_params.get("tipo", "").upper()
        if tipo == "PF":
            qs = qs.extra(where=["LENGTH(cpf_cnpj) = 11"])  # noqa: S610
        elif tipo == "PJ":
            qs = qs.extra(where=["LENGTH(cpf_cnpj) = 14"])  # noqa: S610

        # Filtro por status
        status_param = request.query_params.get("status", "").lower()
        if status_param == "ativo":
            qs = qs.filter(ativo=True)
        elif status_param == "inativo":
            qs = qs.filter(ativo=False)

        # Paginação manual para manter o contrato { clientes: [...], total: N }
        total = qs.count()
        try:
            limit = max(1, int(request.query_params.get("limit", 10)))
            page = max(1, int(request.query_params.get("page", 1)))
        except (ValueError, TypeError):
            limit, page = 10, 1

        offset = (page - 1) * limit
        qs = qs[offset : offset + limit]  # noqa: E203

        serializer = ClienteListSerializer(qs, many=True)
        return Response({"clientes": serializer.data, "total": total})

    # ------------------------------------------------------------------ #
    # Criação                                                              #
    # ------------------------------------------------------------------ #

    def create(self, request, *args, **kwargs):
        serializer = ClienteSerializer(data=request.data)
        if serializer.is_valid():
            cliente = serializer.save()
            return Response(
                ClienteSerializer(cliente).data, status=status.HTTP_201_CREATED
            )
        return Response(
            {"erro": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
        )

    # ------------------------------------------------------------------ #
    # Atualização                                                          #
    # ------------------------------------------------------------------ #

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        # Campos imutáveis via PUT/PATCH: cpf_cnpj e ativo
        data = {
            k: v
            for k, v in request.data.items()
            if k not in ("cpf_cnpj", "ativo", "justificativa_exclusao", "justificativa_ativacao")
        }
        serializer = ClienteSerializer(instance, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(
            {"erro": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
        )

    # ------------------------------------------------------------------ #
    # Alteração de status (inativação / reativação com justificativa)      #
    # ------------------------------------------------------------------ #

    @action(detail=True, methods=["patch"], url_path="status")
    def alterar_status(self, request, pk=None):
        cliente = self.get_object()
        serializer = AlterarStatusSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"erro": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
            )

        novo_status = serializer.validated_data["ativo"]

        if novo_status == cliente.ativo:
            estado = "ativo" if cliente.ativo else "inativo"
            return Response(
                {"erro": f"O cliente já está {estado}."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cliente.ativo = novo_status
        if novo_status is False:
            cliente.justificativa_exclusao = serializer.validated_data.get(
                "justificativa_exclusao"
            )
            cliente.justificativa_ativacao = None
        else:
            cliente.justificativa_ativacao = serializer.validated_data.get(
                "justificativa_ativacao"
            )
            # Mantém o histórico de exclusão; não apaga ao reativar

        cliente.save()
        return Response(ClienteSerializer(cliente).data)

    # ------------------------------------------------------------------ #
    # Desabilita a exclusão física                                         #
    # ------------------------------------------------------------------ #

    def destroy(self, request, *args, **kwargs):
        return Response(
            {"erro": "A exclusão física de clientes não é permitida. Use PATCH /clientes/<id>/status."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )
