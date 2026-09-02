<script setup lang="ts">
defineProps<{
  bookingsLabel: string
  completedLabel: string
  unfinishedLabel: string
  materialReadyLabel: string
  totalBookings: number
  totalCompleted: number
  totalUnfinished: number
  totalMaterialReady: number
}>()
</script>

<template>
  <section class="grid grid-cols-2 gap-3 mb-6">
    <article
      class="rounded-2xl p-4 bg-[#003733]/50 border border-[#4da69c]/20"
    >
      <p
        class="text-[10px] uppercase tracking-[0.16em] font-black text-[#80bfb8]"
      >
        {{ bookingsLabel }}
      </p>
      <p class="text-2xl font-black mt-1 text-white">{{ totalBookings }}</p>
    </article>

    <article
      class="rounded-2xl p-4 bg-emerald-500/20 border border-emerald-500/30"
    >
      <p class="text-[10px] uppercase tracking-[0.16em] font-black text-emerald-300">
        {{ completedLabel }}
      </p>
      <p class="text-2xl font-black mt-1 text-white">{{ totalCompleted }}</p>
    </article>

    <article
      class="rounded-2xl p-4 bg-sky-500/20 border border-sky-500/30"
    >
      <p class="text-[10px] uppercase tracking-[0.16em] font-black text-sky-300">
        {{ unfinishedLabel }}
      </p>
      <p class="text-2xl font-black mt-1 text-white">{{ totalUnfinished }}</p>
    </article>

    <article
      class="rounded-2xl p-4 bg-[#4da69c]/20 border border-[#4da69c]/30"
    >
      <p class="text-[10px] uppercase tracking-[0.16em] font-black text-[#80bfb8]">
        {{ materialReadyLabel }}
      </p>
      <p class="text-2xl font-black mt-1 text-white">{{ totalMaterialReady }}</p>
    </article>
  </section>
</template>
