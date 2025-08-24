# Guard - Gerenciador de contatos

Deploy: https://guard-gerenciador-de-contatos.vercel.app/

O sistema simula o painel de controle de um vendedor, onde é possível cadastrar, visualizar e gerenciar contatos.

## Funcionalidades

- Criação de usuário
- Login e logout
- Criação de contato
- Edição de contato
- Exclusão de contato
- Listagem de contatos
- Filtro de contatos por letra inicial do nome
- Pesquisa de contatos por nome
- Easter Egg ao manter o mouse sobre o botão "Adicionar contato" por 7 segundos

## Como executar local

Adicione um aquivo `.env` com base no `.env.example`.

Precisa do `Docker` rodando.

Precisa de conta na `Cloudflare`.

```
npm install
npm run services:up
npm run database:migrate
npm run dev
```

## Fron-end

Utilizei `Next.js` com `App Router`, `React` e `TypeScript`. Para estilização, usei `Tailwindcss`, adicionando responsividade para telas menores. Destaco o uso da biblioteca `use-debounce` para esperar o usuário parar de digitar no campo de pesquisa, para filtrar os contatos pelo nome.

```ts
...
import { useDebouncedCallback } from "use-debounce";

export default function SearchInput() {
...
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <Input
      id="search"
      name="search"
      type="search"
      placeholder="🔍 Pesquisar por nome"
      onChange={(e) => handleSearch(e.target.value)}
      defaultValue={searchParams.get("search")?.toString()}
    />
  );
}
```
Foram criados `2` componentes de UI (`Button` e `Input`) + `11` componentes, e `3` páginas `signin`, `signup` e `/`.

Organizei as requisições na API (escrita) na pasta `actions` e as requisições de busca de dados, coloquei no arquivo `lib/dal.ts` (`data access layer`), onde as requisições não partem pelo navegador, são diretas do servidor `Node.js`, pois são feitass através de componentes renderizados no servidor `server components`.

## Back-end

Utilzei o `API Routes` do `Next.js` para criar o back-end da aplicação, onde disponibilizei as seguintes rotas:

- POST `/api/users` -> Cria um usuário
- POST `/api/sessions` -> Cria uma sessão
- DELETE `/api/sessions` -> Expira uma sessão no banco e remove o `Cookie`
- POST `/api/contacts` -> Cria um contato
- PATCH `/api/contacts/:id` -> Edita um contato
- DELETE `/api/contacs/:id` -> Exclui um contato
- GET `/api/generate-upload-url?file&type` -> Gera uma url assinada para o upload

Para lidar com as entidades do sistema, criei os seguintes models: `user`, `password`, `session`, `authentication` e `contact`.

## Testes Automatizados

Utilizei `Jest` para os testes. Criei 6 suites de testes de `integração`, um pra cada endpoint, totalizando `18` testes no back-end. Criei também um `orchestrator` para os testes, que possui as funções `clearDatabase()` e `runMigrations()`, que são utilizadas antes de cada suíte de testes, e a função `createSession()` para retornar uma função válida, o que agiliza nos testes. Assim, cada suíte de tests é feita com o banco de dados limpo.

<img width="470" height="830" alt="image" src="https://github.com/user-attachments/assets/be49c6b4-9d00-44ae-b572-8b3f7991907f" />

## Banco de dados e Storage

Escolhi o `PostgreSQL` para o banco de dados, e mesmo com essa escolha, optei por não criar relacionamentos entre as entidades do banco de dados, e sim gerenciar essa lógica no código da aplicação. Acredito que da mais flexibilidade, simplicidade na estrutura de dados e em cenários em que o banco de dados recebe muita carga, deve performar melhor.

Usei o `client` do `pg` para executar as `query` no banco de dados, onde optei por escrever o `SQL`. Para as `migrations`, utilizei o ORM `Drizzle`.

Referente ao serviço de `storage` para o armazenamento das imagens, utilizei `R2` da Cloudflare, com `@aws-sdk/client-s3` para configurar o client e `@aws-sdk/s3-request-presigner` para gerar uma url assinada, usando a mesma pra fazer o upload da imagem. Criei uma rota pela `API Routes` do `Next.js` `api/generate-upload-url` que retorna a `url assinada`. Com essa url assinada eu faço um `fetch` através da action `upload-to-storage.ts`, que retorna a url pública da imagem, essa inserida na requisição de criação/edição de contato.

## Autenticação

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Erros customizados

Criei `5` erros customizados para lidar com as exceções e retornos nas requisições aos `endpoints` da `API`: `NotFoundError`, `UnauthorizedError`, `ValidationError`, `ServiceError` e `InternalServerError`. Este último para lidar com erros inesperados. Controlo o retorno dos erros nas respostas da API através da função `errorHandlerResponse` no `controller.ts`, onde recebe um `Error` e retorna a resposta conforme o tipo do erro.

## Estrutura do projeto

No `back-end` as entidades são representados pelos arquivos dentro da pasta `models`. As proprias rotas são os `controllers` e o arquivo `controller.ts` funciona como uma espécie de `helper` das rotas, onde auxilia nas respostas de erros e cabeçalhos. Os testes organizei dentro de uma pasta especifica, seguindo a estrutura das rotas da API, por exemplo: `/tests/integration/users/post.test.ts`. 

No `front-end`, como utilizei o App Router do Next.js, as páginas estão organizadas por pasta, ex: `/signin/page.tsx` e `/signup/page.tsx`. Na pasta `actions` coloquei as ações de requisição na API oriundas do client (navegador). Já no arquivo `/lib/dal.ts` coloquei as requisições diretas do servidor Node.js. Os componentes eu coloquei na pasta `/components` e `/components/ui`.

## Demonstração

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

-----

Marcone Boff.
