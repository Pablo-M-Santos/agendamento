<template>
  <footer class="border-t border-white/10 bg-[#080d14] text-slate-300">
    <div class="mx-auto max-w-[1280px] px-5 py-14 sm:px-8 lg:px-12">
      <div class="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <a href="#home" class="mb-4 inline-flex items-center gap-2.5">
            <span
              class="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-1.5"
            >
              <img src="/logo.png" alt="AgendaPro" class="h-full w-full object-contain" />
            </span>
            <span class="text-lg font-extrabold tracking-tight text-white">
              Agenda<span class="text-emerald-400">Pro</span>
            </span>
          </a>
          <p class="max-w-sm text-sm leading-6 text-slate-400">
            Mais tempo para cuidar do seu negócio. Gestão simples, agenda organizada e decisões
            baseadas em dados.
          </p>
        </div>

        <div>
          <h2 class="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Produto</h2>
          <nav class="flex flex-col items-start gap-3 text-sm" aria-label="Links do produto">
            <a href="#funcionalidades" class="transition-colors hover:text-emerald-400">
              Funcionalidades
            </a>
            <a href="#modulos" class="transition-colors hover:text-emerald-400">Módulos</a>
            <a href="#depoimentos" class="transition-colors hover:text-emerald-400">
              Depoimentos
            </a>
          </nav>
        </div>

        <div>
          <h2 class="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
            Comece agora
          </h2>
          <p class="mb-4 text-sm leading-6 text-slate-400">
            Organize sua operação e conquiste mais tranquilidade.
          </p>
          <NuxtLink
            to="/register"
            class="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-emerald-300"
          >
            Criar conta grátis
            <span aria-hidden="true">→</span>
          </NuxtLink>
        </div>
      </div>

      <div
        class="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"
      >
        <span>© {{ new Date().getFullYear() }} AgendaPro. Todos os direitos reservados.</span>
        <span>Feito para profissionais que fazem acontecer.</span>
      </div>
    </div>
  </footer>
</template>
