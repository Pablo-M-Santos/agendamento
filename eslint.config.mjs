// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import prettier from 'eslint-config-prettier'

export default withNuxt(
  {
    rules: {
      indent: 'off' // 🔥 desativa conflito de indentação
    }
  },
  prettier // 🔥 desativa todas regras que conflitam com Prettier
)
