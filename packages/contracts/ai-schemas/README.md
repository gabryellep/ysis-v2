# AI Schemas

Contratos compartilhados para a camada backend de IA da Ysis V2.

## Escopo da Fase 5

- A IA real ainda nao esta conectada.
- O frontend nao chama LLM diretamente.
- Toda resposta passa por envelope backend, guardrails e revisao obrigatoria.
- Dados sensiveis exigem consentimento explicito.

## Endpoints Contratados

- `organizar-relato`: transforma relato livre em topicos, campos sugeridos e versoes revisaveis.
- `gerar-relatorio`: gera relatorio estruturado por finalidade.
- `preparar-conversa`: sugere perguntas neutras para consulta, conversa de cuidado ou registro pessoal.
- `safe-fallback`: resposta segura quando input/output viola schema ou safety.

## Regras De Saida

- Nao diagnosticar.
- Nao prescrever.
- Nao afirmar certeza clinica.
- Nao concluir situacoes sensiveis.
- Usar `nao informado` para lacunas.
- Incluir `schema_version`, `prompt_version`, `model_version` e `review_required`.

Veja `ai-endpoints.schema.json` para o contrato de envelope e os nomes oficiais.
