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
      class="rounded-2xl p-4 shadow-sm bg-white/95 text-[#001a17]"
    >
      <p
        class="text-[10px] uppercase tracking-[0.16em] font-black text-[#56709A]"
      >
        {{ bookingsLabel }}
      </p>
      <p class="text-2xl font-black mt-1">{{ totalBookings }}</p>
    </article>

    <article
      class="rounded-2xl p-4 shadow-sm bg-[#00D3B8] text-[#001a17]"
    >
      <p class="text-[10px] uppercase tracking-[0.16em] font-black">
        {{ completedLabel }}
      </p>
      <p class="text-2xl font-black mt-1">{{ totalCompleted }}</p>
    </article>

    <article
      class="rounded-2xl border p-4 shadow-sm bg-white/12 border-white/20"
    >
      <p class="text-[10px] uppercase tracking-[0.16em] font-black text-white/75">
        {{ unfinishedLabel }}
      </p>
      <p class="text-2xl font-black mt-1">{{ totalUnfinished }}</p>
    </article>

    <article
      class="rounded-2xl p-4 shadow-sm bg-[#E8F1FF] text-[#3F5170]"
    >
      <p class="text-[10px] uppercase tracking-[0.16em] font-black">
        {{ materialReadyLabel }}
      </p>
      <p class="text-2xl font-black mt-1">{{ totalMaterialReady }}</p>
    </article>
  </section>
</template>