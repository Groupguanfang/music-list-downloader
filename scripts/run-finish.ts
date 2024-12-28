import result from '../vite.config'

result({
  mode: 'production',
  command: 'build',
})?.ssgOptions?.onFinished?.()
