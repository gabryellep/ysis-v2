# Backend Foundation - Fase 5

## O Que Foi Portado Da V1

- Conceitos de `lib/ai/safety.ts`: linguagem nao diagnostica, sanitizacao de frases conclusivas e aviso neutro.
- Conceitos de `lib/ai/server/guardrails.ts`: deteccao de linguagem diagnostica/prescritiva, fallback seguro e validacao antes de responder ao cliente.
- Conceitos de `lib/ai/server/provider.ts`: provider mock estruturado, sem LLM real e com revisao obrigatoria.
- Conceitos de `lib/ai/contracts/*`: envelope versionado, consentimento, contexto de cliente, safety metadata e contratos por endpoint.
- Conceitos de `supabase/migrations/*`: `user_profiles`, registros sensiveis por usuario, logs de consentimento, eventos de privacidade, relatorios, links relatorio-registro e RLS deny-by-default.

## O Que Foi Adaptado Para V2

- Rotas Next da V1 nao foram copiadas. A logica foi portada para FastAPI/Pydantic em `apps/api`.
- Os endpoints respondem com `ApiEnvelope`, incluindo `schema_version`, `prompt_version`, `model_version`, `review_required`, `safety` e `limitations`.
- A geracao ainda e mock no backend, preparando o ponto de entrada futuro para provider real.
- Lacunas do relato/relatorio usam `nao informado`.
- Convidada continua sem persistencia sensivel permanente. A migration inclui apenas metadados futuros de sessao, sem texto de relato ou audio.

## Endpoints Disponiveis

- `POST /relatos/organizar`: organiza relato original em versoes revisaveis e campos sugeridos.
- `POST /relatorios/gerar`: cria relatorio estruturado por finalidade.
- `POST /perguntas/sugeridas`: prepara perguntas neutras e editaveis.
- `GET /privacidade/controle`: expõe estado de privacidade da Fase 5.
- `POST /privacidade/consentimentos`: valida contrato de consentimento, sem persistencia real ainda.
- `POST /privacidade/eventos`: valida eventos de privacidade, sem persistencia real ainda.

## Limites Da Fase

- Sem OpenAI real.
- Sem RAG.
- Sem transcricao real.
- Sem login visual final.
- Sem historico real no frontend.
- Sem salvar audio por padrao.
- Sem dashboard, marketplace, mapa, profissionais ou rota `/tool`.

## Supabase/RLS

A migration `supabase/migrations/20260606000100_phase5_backend_foundation_rls.sql` cria:

- `user_profiles`
- `guest_sessions`
- `consent_logs`
- `privacy_events`
- `symptom_records`
- `reports`
- `report_record_links`

Todas as tabelas sensiveis têm RLS habilitado. Nao ha policy para `anon`. Escritas de `symptom_records` exigem usuario autenticado e `cloud_sync_enabled = true`. `reports`, `consent_logs` e `privacy_events` ficam com escrita direta fechada ate a decisao de backend/Auth real.

## Proximos Passos

- Conectar Supabase real e Auth no backend, mantendo service role fora do frontend.
- Criar camada de persistencia FastAPI para gravar consentimentos e eventos via backend.
- Conectar provider real de IA com `store: false`, schemas estruturados e validacao pos-geracao.
- Adicionar testes de safety para entradas e saidas com linguagem proibida.
- Planejar transcricao real sem salvar audio por padrao.
