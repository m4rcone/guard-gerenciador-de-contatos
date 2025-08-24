# Guard - Gerenciador de contatos

🚀 Deploy: https://guard-gerenciador-de-contatos.vercel.app/

O sistema simula o painel de controle de um vendedor, onde é possível cadastrar, visualizar e gerenciar contatos.

## ✨ Funcionalidades

- Criação de usuário
- Login e logout
- Criação de contato
- Edição de contato
- Exclusão de contato
- Listagem de contatos
- Filtro de contatos por letra inicial do nome
- Pesquisa de contatos por nome
- Controle de visibilidade dos dados
- Easter Egg ao manter o mouse sobre o botão "Adicionar contato" por 7 segundos

## 🖥️ Como executar local

Adicione um aquivo `.env` com base no `.env.example`.

Precisa do `Docker` rodando.

Precisa de conta na `Cloudflare`.

```
npm install
npm run services:up
npm run database:migrate
npm run dev
```

## 🎨 Fron-end

Utilizei `Next.js` com `App Router`, `React` e `TypeScript`. Para estilização, usei `Tailwindcss`, adicionando responsividade para telas menores. Destaco o uso da biblioteca `use-debounce` para esperar o usuário parar de digitar no campo de pesquisa, filtrando os contatos pelo nome.

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

Foram criados `dois` componentes de UI (`Button` e `Input`) + `treze` componentes, e `três` páginas `signin`, `signup` e `/`.

Organizei as requisições na API (escrita) na pasta `actions` e as requisições de busca de dados, coloquei no arquivo `lib/dal.ts` `data access layer`, onde as requisições não partem pelo navegador, sendo diretas do servidor `Node.js`, pois são feitas através de componentes renderizados no servidor `server components`.

Criei também um contexto `context/visibility-context.tsx` para armazenar a lógica do controle de visibilidade dos dados. Acredito que foi meu maior desafio no front-end pois existe dois controle de visibilidade (individual por contato, e todos contatos). Para definir a lógica do controle de todos os contatos, precisei criar o componente `password-dialog-wrapper` onde ele faz o tunelamento do componente `password-dialog` recebendo a lista de contatos e aplicando a lógica, diferente do que acontece no controle individual, onde recebe apenas o id do contato.

## ⚙️ Back-end

Utilzei o `API Routes` do `Next.js` para criar o back-end da aplicação, disponibilizando as seguintes rotas:

- POST `/api/users` -> Cria um usuário
- POST `/api/sessions` -> Cria uma sessão
- DELETE `/api/sessions` -> Expira uma sessão no banco e remove o `Cookie`
- POST `/api/contacts` -> Cria um contato
- PATCH `/api/contacts/:id` -> Edita um contato
- DELETE `/api/contacs/:id` -> Exclui um contato
- GET `/api/generate-upload-url?file&type` -> Gera uma url assinada para o upload
- POST `/api/verify-password` -> Verifica se a senha está correta/incorreta

Para lidar com as entidades do sistema, criei os seguintes models: `user`, `password`, `session`, `authentication` e `contact`.

## 🧪 Testes Automatizados

Utilizei `Jest` para os testes. Criei `oito` suites de testes de `integração`, um pra cada endpoint, totalizando `vinte` testes no back-end. Criei também um `orchestrator` para os testes, que possui as funções `clearDatabase` e `runMigrations`, utilizadas antes de cada suíte de testes, e as funções `createSession` e `createUser` para retornar uma função válida e um usuário, respectivamente, o que agiliza nos testes. Assim, cada suíte de testes é feita com o banco de dados limpo.

<img width="468" height="912" alt="image" src="https://github.com/user-attachments/assets/04acedb7-984b-4ac5-babe-a6d53918c0cc" />

## 💾 Banco de dados e Storage

Escolhi o `PostgreSQL` para o banco de dados, e mesmo com essa escolha, optei por não criar relacionamentos entre as entidades do banco, gerenciando essa lógica no código da aplicação. Acredito que isso proporciona mais flexibilidade, simplicidade na estrutura de dados e, em cenários em que o banco recebe muita carga, deve performar melhor.

Usei o `client` do `pg` para executar as `queries` no banco, optando por escrever o `SQL`. Para as `migrations`, utilizei o ORM `Drizzle`.

Quanto ao serviço de `storage` para o armazenamento das imagens, utilizei o `R2` da Cloudflare, com `@aws-sdk/client-s3` para configurar o client e `@aws-sdk/s3-request-presigner` para gerar uma URL assinada, usando-a para fazer o upload da imagem. Criei uma rota pela `API Routes` do `Next.js` `api/generate-upload-url?file&type` que retorna a URL assinada. Com essa URL, faço um `fetch` através da action `upload-to-storage.ts`, que retorna a URL pública da imagem, inserida na requisição de criação/edição de contato.

## 🔐 Autenticação e autorização

Para o sistema de autenticação e autorização, optei por uma implementação manual, sem o uso de bibliotecas prontas, utilizando boas práticas de segurança.

### Estrutura das sessões

Criei uma entidade no banco de dados sessions com os seguintes campos:

- `id` – identificador único da sessão
- `token` – token criptografado da sessão
- `user_id` – referência ao usuário autenticado
- `expires_at` – data de expiração da sessão
- `created_at` e `updated_at` – para rastrear criação e atualizações

No model `session` coloquei toda a lógica de manipulação das `sessions`, criando os métodos `create`, `findOneByToken`, `renew` e `expire`. Este último não deleta a sessão no banco, apenas altera a data do `expires_at`, invalidando-a e possibilitando rastreabilidade das sessões. Quanto à renovação das sessões, optei por fazê-la sempre que é realizada uma requisição em um endpoint protegido.

### Autenticação do usuário

Centralizei a validação das credenciais no model `authentication`, permitindo que a autenticação seja centralizada e que apenas se chame a função `getAuthenticatedUser` nas rotas protegidas.

### Endpoints

- POST `/api/sessions` - cria uma sessão após autenticar o usuário e retorna o `token` via cookie.
- DELETE `/api/sessions` - invalida a sessão, atualizando a data de expiração, sem deletar o registro.

### Set-Cookie

As instruções do cabeçalho `cookie` são retornadas nas respostas sempre que a sessão é criada, atualizada ou expirada. As instruções utilizadas no `cookie` foram:

```ts
{
  path: "/", // Utilizada para todas rotas da aplicação
  maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000, // Adiciona o tempo de expiração em segundos
  httpOnly: true, // Impede que o cookie seja acessado via js no lado do cliente.
  secure: process.env.NODE_ENV === "production", // Garante que seja enviado o cookie apenas em HTTPS em produção
}
```

## ❌ Erros customizados

Criei `5` erros customizados para lidar com as exceções e retornos nas requisições aos `endpoints` da `API`: `NotFoundError`, `UnauthorizedError`, `ValidationError`, `ServiceError` e `InternalServerError`. Este último para lidar com erros inesperados. Controlo o retorno dos erros nas respostas da API através da função `errorHandlerResponse` no `controller.ts`, onde recebe um `Error` e retorna a resposta conforme o tipo do erro.

## 📁 Estrutura do projeto

```text
📦src
 ┣ 📂app
 ┃ ┣ 📂actions
 ┃ ┣ 📂api
 ┃ ┃ ┣ 📂contacts
 ┃ ┃ ┃ ┣ 📂[id]
 ┃ ┃ ┣ 📂generate-upload-url
 ┃ ┃ ┣ 📂sessions
 ┃ ┃ ┣ 📂users
 ┃ ┃ ┗ 📂verify-password
 ┃ ┣ 📂components
 ┃ ┃ ┣ 📂ui
 ┃ ┣ 📂context
 ┃ ┣ 📂lib
 ┃ ┣ 📂signin
 ┃ ┣ 📂signup
 ┃ ┣ 📂utils
 ┣ 📂infra
 ┃ ┣ 📂database
 ┃ ┃ ┣ 📂migrations
 ┃ ┃ ┗ 📂schemas
 ┣ 📂models
 ┗ 📂tests
 ┃ ┣ 📂integration
 ┃ ┃ ┗ 📂api
 ┃ ┃ ┃ ┣ 📂contacts
 ┃ ┃ ┃ ┃ ┣ 📂[id]
 ┃ ┃ ┃ ┣ 📂generate-upload-url
 ┃ ┃ ┃ ┣ 📂sessions
 ┃ ┃ ┃ ┣ 📂users
 ┃ ┃ ┃ ┗ 📂verify-password
```

---

Marcone Boff.
