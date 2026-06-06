# Report Schemas

Contratos de relatorios estruturados por finalidade.

## Finalidades

- `consultation`: levar para consulta.
- `symptoms`: organizar sintomas/sinais relatados.
- `conversation`: preparar conversa de cuidado.
- `personal`: registro pessoal.
- `gynecologist`: ginecologia.
- `psychologist`: psicologia.
- `obstetrics`: obstetricia.
- `urgent_care`: atendimento de urgencia.
- `sensitive_situation`: situacao sensivel.

## Campos Obrigatorios

- Relato original e relato revisado.
- Finalidade do relatorio.
- Consentimento.
- Avisos de seguranca.
- Perguntas sugeridas.
- Campos ausentes preenchidos como `nao informado`.
- `report_type`, `audience`, `tone`, `non_diagnostic_notice`, `fallback_message` e flags `persisted=false`/`review_required=true`.
- Versoes de schema, prompt e modelo no envelope backend.

Veja `report.schema.json` e `types.ts`.
