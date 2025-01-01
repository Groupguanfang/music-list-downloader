import naily from '@nailyjs/eslint'

export default await naily({
  rules: {
    'vue/singleline-html-element-content-newline': 'off',
    'ts/no-unsafe-declaration-merging': 'off',
  },
})
