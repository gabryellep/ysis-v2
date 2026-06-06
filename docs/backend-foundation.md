# Backend Foundation - Fases 5 e 6

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
- `GET /privacidade/controle`: expoe estado de privacidade.
- `POST /sessoes/iniciar`: cria sessao convidada, temporaria ou de conta quando houver JWT valido do Supabase.
- `POST /privacidade/consentimentos`: valida contrato de consentimento e persiste via backend quando houver usuaria autenticada.
- `POST /privacidade/eventos`: valida eventos de privacidade e persiste via backend quando houver usuaria autenticada.

## Configuracao Supabase - Fase 6

O cliente Supabase vive apenas no backend em `apps/api/app/db/supabase.py`.
As variaveis esperadas estao documentadas em `.env.example`:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`, usada pelo backend para validar JWT no Supabase Auth.
- `SUPABASE_SERVICE_ROLE_KEY`, usada apenas pelo backend para gravar logs auditaveis fechados para o browser.
- `ENVIRONMENT`
- `GUEST_SESSION_TTL_MINUTES`

Nao ha chave Supabase no frontend e nao ha uso de `NEXT_PUBLIC_SUPABASE_*`.
Sem essas variaveis, a API continua subindo em modo local seguro: sessoes convidadas funcionam e consentimentos/eventos sao validados sem persistencia.

## Sessao Convidada e Conta Opcional

`POST /sessoes/iniciar` recebe `mode`, `purpose` e `persist_metadata`.
Quando nao ha `Authorization: Bearer <jwt>`, a resposta e uma sessao convidada/temporaria com identificador aleatorio e expiracao.
Esse identificador nao deve ser usado para salvar relato ou audio sensivel.

Quando ha JWT valido do Supabase, o backend associa a sessao a `user_id`.
Metadados nao sensiveis de `guest_sessions` so sao persistidos se `persist_metadata=true`.
Login nao e exigido para usar `/ferramenta`.

## Consentimentos e Eventos

Consentimentos continuam granulares e versionados por `text_version` e `scopes`.
Para convidadas, o backend valida o payload e retorna `persisted=false`.
Para usuarias autenticadas, o backend grava em `consent_logs` usando service role, sem expor a chave ao browser.

Eventos de privacidade aceitos incluem:

- `consent_granted`
- `consent_revoked`
- `guest_session_started`
- `do_not_save_preference_set`
- `session_deleted`
- `discreet_mode_enabled`
- `discreet_mode_disabled`
- `cloud_export_requested`
- `cloud_delete_requested`

O payload auditavel nao contem relato, audio, transcricao ou texto intimo.

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

Todas as tabelas sensiveis tem RLS habilitado. Nao ha policy para `anon`. Escritas de `symptom_records` exigem usuario autenticado e `cloud_sync_enabled = true`.
`reports`, `consent_logs` e `privacy_events` continuam com escrita direta fechada no browser.
A migration `20260606000200_phase6_privacy_events.sql` apenas expande os tipos de eventos auditaveis, sem abrir RLS.

## Validacao Inicial de RLS

Checklist manual para Supabase local/remoto:

1. Aplicar migrations `20260606000100` e `20260606000200`.
2. Com anon key, tentar `select`/`insert` em `symptom_records`, `consent_logs`, `privacy_events` e confirmar bloqueio.
3. Com JWT da usuaria A, confirmar que `select` retorna apenas `user_id = auth.uid()`.
4. Com JWT da usuaria B, tentar ler dados da usuaria A e confirmar zero linhas.
5. Tentar inserir `symptom_records` sem `cloud_sync_enabled=true` e confirmar bloqueio.
6. Via backend autenticado, registrar consentimento/evento e confirmar que o registro nao contem relato, audio ou transcricao.
7. Em modo convidada, chamar `/sessoes/iniciar`, `/privacidade/consentimentos` e `/privacidade/eventos`; confirmar `persisted=false` para consentimento/evento e ausencia de historico sensivel.

## Proximos Passos

- Conectar ambiente Supabase real e executar validacoes RLS com usuarios de teste.
- Conectar provider real de IA com `store: false`, schemas estruturados e validacao pos-geracao.
- Adicionar testes de safety para entradas e saidas com linguagem proibida.
- Planejar transcricao real sem salvar audio por padrao.
