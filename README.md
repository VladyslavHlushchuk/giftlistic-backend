# My Cart Backend

## Conteúdo

- [Requisitos](#requirements)
- [Variáveis de Ambiente](#environment)

## Requisitos <a name="requirements"></a>

| Nome   | Instalação                                 |
| ------ | ------------------------------------------ |
| Docker | [Instalar](https://www.docker.com/)        |
| Node   | [Instalar](https://nodejs.org/en/download) |

## Variáveis de Ambiente <a name="environment"></a>

Você vai precisar criar um arquivo `.env` na raiz do projeto utilizando o `.env.example` como base

## Scripts <a name="scripts"></a>

Para conseguir instalar as dependências necessário no projeto é necessário rodar o

```bash
  npm i
```

ou

```bash
  yarn
```

Para executar o projeto existe alguns outros scripts que estão listados aqui:

| Script    | Descrição                                                                              |
| --------- | -------------------------------------------------------------------------------------- |
| start:dev | Roda a aplicação em modo de desenvolvimento                                            |
| build     | Monta uma imagem da aplicação simulando o processo que é realizado no ambiente de PROD |
| start     | Roda a aplicação                                                                       |
