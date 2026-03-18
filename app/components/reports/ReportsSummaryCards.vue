<script setup lang="ts">
defineProps<{
  isLightTheme: boolean
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
      class="rounded-2xl p-4 shadow-sm"
      :class="isLightTheme ? 'bg-[#003D7A] text-white' : 'bg-white/95 text-[#0B1F3A]'"
    >
      <p
        class="text-[10px] uppercase tracking-[0.16em] font-black"
        :class="isLightTheme ? 'text-white/75' : 'text-[#56709A]'"
      >
        {{ bookingsLabel }}
      </p>
      <p class="text-2xl font-black mt-1">{{ totalBookings }}</p>
    </article>

    <article
      class="rounded-2xl p-4 shadow-sm"
      :class="isLightTheme ? 'bg-[#003D7A] text-white' : 'bg-[#00D3B8] text-[#003D7A]'"
    >
      <p class="text-[10px] uppercase tracking-[0.16em] font-black">
        {{ completedLabel }}
      </p>
      <p class="text-2xl font-black mt-1">{{ totalCompleted }}</p>
    </article>

    <article
      class="rounded-2xl border p-4 shadow-sm"
      :class="
        isLightTheme ? 'bg-[#003D7A] border-white/20 text-white' : 'bg-white/12 border-white/20'
      "
    >
      <p class="text-[10px] uppercase tracking-[0.16em] font-black text-white/75">
        {{ unfinishedLabel }}
      </p>
      <p class="text-2xl font-black mt-1">{{ totalUnfinished }}</p>
    </article>

    <article
      class="rounded-2xl p-4 shadow-sm"
      :class="isLightTheme ? 'bg-[#003D7A] text-white' : 'bg-[#E8F1FF] text-[#3F5170]'"
    >
      <p class="text-[10px] uppercase tracking-[0.16em] font-black">
        {{ materialReadyLabel }}
      </p>
      <p class="text-2xl font-black mt-1">{{ totalMaterialReady }}</p>
    </article>
  </section>
</template>
