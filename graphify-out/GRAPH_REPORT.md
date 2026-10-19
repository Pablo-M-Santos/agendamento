# Graph Report - agendamento  (2026-10-19)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 552 nodes · 784 edges · 53 communities (35 shown, 18 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c63ce202`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- node_modules_vue_index_ref
- package.json
- ModalAgendamento.vue
- dashboard/index.vue
- @heroicons/vue
- DashboardSidebar.vue
- profile/index.vue
- reports/index.vue
- ScheduleDaysCarousel.vue
- useLoginPage.ts
- email-service.ts
- dependencies
- devDependencies
- LineChart.vue
- useReportPdf.ts
- scripts
- node_modules_vue_index
- useAppI18n.ts
- node_modules_vue_index_onmounted
- LandingHero.vue
- action.vue
- DeviceShowcaseDivider.vue
- DonutChart.vue
- register.post.ts
- renovate.json
- app/app.vue
- ApexHorizontalBarsChart.vue
- vue3-apexcharts
- SocialProof.vue
- SystemModules.vue
- apexcharts
- ApexHourlyBarsChart.vue
- ApexPeriodComparisonChart.vue
- ApexStatusStackedChart.vue
- ApexTrendChart.vue
- pages/index.vue
- RoleSimulator.vue
- ScheduleConfirmDeleteModal.vue
- server/tsconfig.json
- tsconfig.json
- ProfilePageHeader.vue
- ProfileSettingsCard.vue
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `Agendamento` - 16 edges
2. `AgendamentoRepository` - 13 edges
3. `useAgendamentos()` - 13 edges
4. `date-fns` - 13 edges
5. `scripts` - 12 edges
6. `firebase` - 11 edges
7. `@heroicons/vue` - 11 edges
8. `IAgendamentoRepository` - 10 edges
9. `vue3-apexcharts` - 9 edges
10. `useAuth()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `useAgendamentos()` --calls--> `AgendamentoRepository`  [EXTRACTED]
  app/composables/useAgendamentos.ts → app/repositories/AgendamentoRepository.ts
- `useAgendamentos()` --calls--> `useAuth()`  [EXTRACTED]
  app/composables/useAgendamentos.ts → app/composables/useAuth.ts
- `useReportsPage()` --calls--> `useAgendamentos()`  [EXTRACTED]
  app/composables/useReportsPage.ts → app/composables/useAgendamentos.ts
- `useSchedulePage()` --calls--> `useAgendamentos()`  [EXTRACTED]
  app/composables/useSchedulePage.ts → app/composables/useAgendamentos.ts
- `useReportsPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/composables/useReportsPage.ts → app/composables/useAuth.ts

## Import Cycles
- None detected.

## Communities (53 total, 18 thin omitted)

### Community 0 - "node_modules_vue_index_ref"
Cohesion: 0.07
Nodes (26): { dateLocale }, emit, avatarLoadError, props, emit, props, { t }, useAgendamentos() (+18 more)

### Community 1 - "package.json"
Cohesion: 0.05
Nodes (40): name, vue, @vue/compiler-sfc, @vue/reactivity, @vue/runtime-core, @vue/runtime-dom, @vue/server-renderer, @vue/shared (+32 more)

### Community 2 - "ModalAgendamento.vue"
Cohesion: 0.07
Nodes (29): cliente, dataHeaderFormat, { dateLocale }, emit, endereco, erros, fechar(), handleSalvar() (+21 more)

### Community 3 - "dashboard/index.vue"
Cohesion: 0.09
Nodes (22): agendamentos, carregando, carregar(), handleToggleStatus(), hoje, inicialUsuario, isDetailsModalOpen, isGoogleLogin (+14 more)

### Community 4 - "@heroicons/vue"
Cohesion: 0.09
Nodes (10): route, { t }, { t }, avatarLoadError, emit, props, { dateLocale }, emit (+2 more)

### Community 5 - "DashboardSidebar.vue"
Cohesion: 0.09
Nodes (19): avatarLoadError, close(), displayName, emit, handleLogout(), initials, isDesktop, links (+11 more)

### Community 6 - "profile/index.vue"
Cohesion: 0.10
Nodes (18): AppLanguage, DEFAULT_SETTINGS, UserSettings, useUserSettings(), activeSavingSection, handleSelectLanguage(), inicial, languageFeedback (+10 more)

### Community 7 - "reports/index.vue"
Cohesion: 0.11
Nodes (16): {
  buildStatusDonut,
  buildCompletionTrend,
  receitaTotal,
  ticketMedio,
  receitaPorMes,
  mediaMensal,
  statusPorDia,
  comparacaoPeriodo
}, dadosReceita, donutSegments, exporting, { gerarPdfRelatorio, compartilharOuBaixarPdf }, inicialUsuario, isSidebarOpen, mesesDisponiveis (+8 more)

### Community 8 - "ScheduleDaysCarousel.vue"
Cohesion: 0.12
Nodes (11): Cell, max, props, temDados, carouselRef, centralizarDataSelecionada(), { dateLocale }, emit (+3 more)

### Community 9 - "useLoginPage.ts"
Cohesion: 0.21
Nodes (9): useLoginPage(), useRegisterPage(), EMAIL_REGEX, MAX_EMAIL_LENGTH, MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH, validarEmail(), validarSenha() (+1 more)

### Community 10 - "email-service.ts"
Cohesion: 0.18
Nodes (14): nodemailer, resend, getVerificationEmailHtml(), sendVerificationEmail(), SendVerificationEmailParams, getTransporter(), sendGmailVerificationEmail(), SendVerificationEmailParams (+6 more)

### Community 11 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, apexcharts, date-fns, devices.css, firebase, firebase-admin, @heroicons/vue, @iconify-json/lucide (+9 more)

### Community 12 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, eslint, eslint-config-prettier, eslint-plugin-prettier, @iconify-json/material-symbols, jsdom, @nuxt/eslint, @nuxt/test-utils (+9 more)

### Community 13 - "LineChart.vue"
Cohesion: 0.14
Nodes (13): gridLines, innerHeight, maxValue, mediaPorDia, padding, pathAreaTotal, pathLineConcluidos, pathLineTotal (+5 more)

### Community 14 - "useReportPdf.ts"
Cohesion: 0.21
Nodes (11): formatarData(), GerarPdfParams, materialTexto(), PERIOD_LABEL, STATUS_LABEL, statusTexto(), useReportPdf(), ReportsPeriod (+3 more)

### Community 15 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, build, dev, lint, postinstall, preview, test, test:coverage (+4 more)

### Community 16 - "node_modules_vue_index"
Cohesion: 0.20
Nodes (6): ariaDescribedBy, emit, inputType, props, {
  email,
  password,
  loading,
  showPassword,
  errors,
  isFormValid,
  validateField,
  registerWithEmail,
  registerWithGoogle
}, emailariaDescribedBy

### Community 17 - "useAppI18n.ts"
Cohesion: 0.27
Nodes (5): Dict, Dictionaries, enUS, esES, ptBR

### Community 18 - "node_modules_vue_index_onmounted"
Cohesion: 0.25
Nodes (4): canvasRef, Dust, isVisible, sectionRef

### Community 19 - "LandingHero.vue"
Cohesion: 0.22
Nodes (5): activeBadge, heroRef, mouseX, mouseY, scrollYPos

### Community 20 - "action.vue"
Cohesion: 0.22
Nodes (7): { $auth }, hasError, loading, message, mode, oobCode, route

### Community 21 - "DeviceShowcaseDivider.vue"
Cohesion: 0.25
Nodes (5): activeStep, currentStep, scrollProgress, sectionRef, steps

### Community 22 - "DonutChart.vue"
Cohesion: 0.29
Nodes (6): arcos, circunferencia, props, raio, Segment, total

### Community 24 - "renovate.json"
Cohesion: 0.29
Nodes (6): github>nuxt/renovate-config-nuxt, extends, lockFileMaintenance, enabled, packageRules, postUpdateOptions

### Community 25 - "app/app.vue"
Cohesion: 0.33
Nodes (4): { initAuth }, { initTheme }, { initUserSettings }, retry

### Community 26 - "ApexHorizontalBarsChart.vue"
Cohesion: 0.33
Nodes (5): BarItem, chartOptions, props, series, total

### Community 27 - "vue3-apexcharts"
Cohesion: 0.33
Nodes (5): chartOptions, HourItem, props, series, vue3-apexcharts

### Community 28 - "SocialProof.vue"
Cohesion: 0.33
Nodes (4): isVisible, sectionRef, stats, testimonials

### Community 29 - "SystemModules.vue"
Cohesion: 0.33
Nodes (4): activeTab, isVisible, modules, sectionRef

### Community 30 - "apexcharts"
Cohesion: 0.40
Nodes (4): chartOptions, props, Segment, apexcharts

### Community 31 - "ApexHourlyBarsChart.vue"
Cohesion: 0.40
Nodes (4): chartOptions, ColumnItem, props, series

### Community 32 - "ApexPeriodComparisonChart.vue"
Cohesion: 0.40
Nodes (4): chartOptions, PeriodPoint, props, series

### Community 33 - "ApexStatusStackedChart.vue"
Cohesion: 0.40
Nodes (4): chartOptions, props, series, StatusPoint

### Community 34 - "ApexTrendChart.vue"
Cohesion: 0.40
Nodes (4): chartOptions, Point, props, series

### Community 36 - "RoleSimulator.vue"
Cohesion: 0.40
Nodes (4): cards, isVisible, sectionRef, selectedCard

## Knowledge Gaps
- **21 isolated node(s):** `devices.css`, `eslint`, `eslint-plugin-prettier`, `@iconify-json/lucide`, `@iconify-json/material-symbols` (+16 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 374 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `date-fns` connect `node_modules_vue_index_ref` to `package.json`, `ModalAgendamento.vue`, `@heroicons/vue`, `profile/index.vue`, `reports/index.vue`, `ScheduleDaysCarousel.vue`, `useReportPdf.ts`?**
  _High betweenness centrality (0.157) - this node is a cross-community bridge._
- **What connects `devices.css`, `eslint`, `eslint-plugin-prettier` to the rest of the system?**
  _21 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `node_modules_vue_index_ref` be split into smaller, more focused modules?**
  _Cohesion score 0.06557377049180328 - nodes in this community are weakly interconnected._
- **Why does `firebase` connect `node_modules_vue_index_ref` to `useLoginPage.ts`, `action.vue`, `profile/index.vue`, `package.json`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.04734299516908213 - nodes in this community are weakly interconnected._
- **Why does `@heroicons/vue` connect `@heroicons/vue` to `package.json`, `DashboardSidebar.vue`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Should `ModalAgendamento.vue` be split into smaller, more focused modules?**
  _Cohesion score 0.06707317073170732 - nodes in this community are weakly interconnected._