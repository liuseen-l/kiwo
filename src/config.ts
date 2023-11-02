import { resolveMove } from './commands'
import { loadPackages } from './io/packages'

// 处理配置
export async function resolveConfig(options: any): Promise<void> {
  // remove
  const isDev = options.D || options.d || options.devDependencies || false
  if (options.mode === 'move') {
    resolveMove({
      ...options,
      isDev,
    })
    return
  }

  if (options.mode === 'remove')
    loadPackages(options)
}
