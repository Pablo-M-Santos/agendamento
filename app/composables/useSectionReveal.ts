import { ref, onMounted, onUnmounted, type Ref } from 'vue'

interface UseSectionRevealOptions {
  /** Intersection ratio required to trigger the reveal. Default: 0.15 */
  threshold?: number
  /** Keep observing after the first intersection (re-hides when out of view). Default: false */
  repeat?: boolean
}

/**
 * Shared reveal behavior extracted from the duplicated inline
 * IntersectionObserver boilerplate used across landing sections.
 *
 * Default behavior is identical to the original inline code: observes the
 * section at the given threshold, sets `isVisible` once on first
 * intersection, then unobserves.
 */
export function useSectionReveal(
  sectionRef: Ref<HTMLElement | null>,
  options: UseSectionRevealOptions = {}
): { isVisible: Ref<boolean> } {
  const { threshold = 0.15, repeat = false } = options
  const isVisible = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (typeof IntersectionObserver === 'undefined') {
      isVisible.value = true
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return

        if (entry.isIntersecting) {
          isVisible.value = true
          if (!repeat && observer && sectionRef.value) {
            observer.unobserve(sectionRef.value)
          }
        } else if (repeat) {
          isVisible.value = false
        }
      },
      { threshold }
    )

    if (sectionRef.value) {
      observer.observe(sectionRef.value)
    }
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
  })

  return { isVisible }
}
