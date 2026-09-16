export const SECTION_VARIANTS = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.19, 1, 0.22, 1],
      staggerChildren: 0.1,
    },
  },
}

export const CHILD_VARIANTS = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}
