from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from .models import Cliente

# Dados base para criação de cliente
CLIENTE_BASE = {
    "nome": "Empresa Teste Ltda",
    "email": "contato@teste.com",
    "cpf_cnpj": "42315670000147",
    "username": "empresateste",
    "telefone": "84999990000",
    "endereco": "Rua Teste, 1, Centro, Natal, RN",
}


class ClienteAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

    # ------------------------------------------------------------------ #
    # POST /clientes                                                        #
    # ------------------------------------------------------------------ #

    def test_criar_cliente_com_sucesso(self):
        res = self.client.post("/clientes", CLIENTE_BASE, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["cpf_cnpj"], CLIENTE_BASE["cpf_cnpj"])
        self.assertTrue(res.data["ativo"])

    def test_criar_cliente_cpf_cnpj_duplicado(self):
        self.client.post("/clientes", CLIENTE_BASE, format="json")
        res = self.client.post("/clientes", CLIENTE_BASE, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_criar_cliente_cpf_cnpj_invalido(self):
        dados = {**CLIENTE_BASE, "cpf_cnpj": "123"}
        res = self.client.post("/clientes", dados, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    # ------------------------------------------------------------------ #
    # GET /clientes                                                         #
    # ------------------------------------------------------------------ #

    def test_listar_clientes(self):
        self.client.post("/clientes", CLIENTE_BASE, format="json")
        res = self.client.get("/clientes")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("clientes", res.data)
        self.assertIn("total", res.data)
        self.assertEqual(res.data["total"], 1)

    def test_filtrar_por_tipo_pj(self):
        self.client.post("/clientes", CLIENTE_BASE, format="json")  # CNPJ
        res = self.client.get("/clientes?tipo=PJ")
        self.assertEqual(res.data["total"], 1)

    def test_filtrar_por_tipo_pf(self):
        self.client.post("/clientes", CLIENTE_BASE, format="json")  # CNPJ
        res = self.client.get("/clientes?tipo=PF")
        self.assertEqual(res.data["total"], 0)

    def test_filtrar_por_status_ativo(self):
        self.client.post("/clientes", CLIENTE_BASE, format="json")
        res = self.client.get("/clientes?status=ativo")
        self.assertEqual(res.data["total"], 1)

    def test_busca_textual(self):
        self.client.post("/clientes", CLIENTE_BASE, format="json")
        res = self.client.get("/clientes?q=Empresa")
        self.assertEqual(res.data["total"], 1)
        res_vazio = self.client.get("/clientes?q=naoexiste")
        self.assertEqual(res_vazio.data["total"], 0)

    # ------------------------------------------------------------------ #
    # PUT /clientes/<id>                                                    #
    # ------------------------------------------------------------------ #

    def test_atualizar_cliente(self):
        criado = self.client.post("/clientes", CLIENTE_BASE, format="json").data
        res = self.client.put(
            f"/clientes/{criado['id']}",
            {**CLIENTE_BASE, "nome": "Novo Nome Ltda"},
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["nome"], "Novo Nome Ltda")

    def test_atualizar_nao_altera_cpf_cnpj(self):
        criado = self.client.post("/clientes", CLIENTE_BASE, format="json").data
        res = self.client.put(
            f"/clientes/{criado['id']}",
            {**CLIENTE_BASE, "cpf_cnpj": "00000000000"},
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["cpf_cnpj"], CLIENTE_BASE["cpf_cnpj"])

    # ------------------------------------------------------------------ #
    # PATCH /clientes/<id>/status                                           #
    # ------------------------------------------------------------------ #

    def test_inativar_cliente_com_justificativa(self):
        criado = self.client.post("/clientes", CLIENTE_BASE, format="json").data
        res = self.client.patch(
            f"/clientes/{criado['id']}/status",
            {"ativo": False, "justificativa_exclusao": "Encerramento de contrato."},
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertFalse(res.data["ativo"])

    def test_inativar_sem_justificativa_retorna_400(self):
        criado = self.client.post("/clientes", CLIENTE_BASE, format="json").data
        res = self.client.patch(
            f"/clientes/{criado['id']}/status",
            {"ativo": False},
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_reativar_cliente(self):
        criado = self.client.post("/clientes", CLIENTE_BASE, format="json").data
        self.client.patch(
            f"/clientes/{criado['id']}/status",
            {"ativo": False, "justificativa_exclusao": "Pausa."},
            format="json",
        )
        res = self.client.patch(
            f"/clientes/{criado['id']}/status",
            {"ativo": True, "justificativa_ativacao": "Contrato retomado."},
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data["ativo"])

    # ------------------------------------------------------------------ #
    # DELETE desabilitado                                                   #
    # ------------------------------------------------------------------ #

    def test_delete_nao_permitido(self):
        criado = self.client.post("/clientes", CLIENTE_BASE, format="json").data
        res = self.client.delete(f"/clientes/{criado['id']}")
        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
