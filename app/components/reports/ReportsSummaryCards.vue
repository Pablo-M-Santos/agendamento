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
    <section class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      <article
        class="rounded-2xl p-4 bg-[#1A2132] border border-[#262E42]"
      >
        <p
          class="text-[10px] uppercase tracking-[0.16em] font-black text-[#8A93A6]"
        >
          {{ bookingsLabel }}
        </p>
        <p class="text-2xl font-black mt-1 text-[#EDEFF4]">{{ totalBookings }}</p>
      </article>

      <article
        class="rounded-2xl p-4 bg-[#1B4F4A]/20 border border-[#2C6E67]/30"
      >
        <p class="text-[10px] uppercase tracking-[0.16em] font-black text-[#7FE0CC]">
          {{ completedLabel }}
        </p>
        <p class="text-2xl font-black mt-1 text-[#EDEFF4]">{{ totalCompleted }}</p>
      </article>

      <article
        class="rounded-2xl p-4 bg-[#233350]/30 border border-[#33517F]/30"
      >
        <p class="text-[10px] uppercase tracking-[0.16em] font-black text-[#9FC1F5]">
          {{ unfinishedLabel }}
        </p>
        <p class="text-2xl font-black mt-1 text-[#EDEFF4]">{{ totalUnfinished }}</p>
      </article>

      <article
        class="rounded-2xl p-4 bg-[#1B4F4A]/20 border border-[#2C6E67]/30"
      >
        <p class="text-[10px] uppercase tracking-[0.16em] font-black text-[#7FE0CC]">
          {{ materialReadyLabel }}
        </p>
        <p class="text-2xl font-black mt-1 text-[#EDEFF4]">{{ totalMaterialReady }}</p>
      </article>
    </section>
</template>
