import { resolveMove } from './commands'

// 处理配置
export async function resolveConfig(options: any): Promise<void> {
  const isDev = options.D || options.d || options.devDependencies || false
  if (options.mode === 'move') {
    resolveMove({
      ...options,
      isDev,
    })
  }

  // if (options.mode === 'remove')
  //   loadPackages(options)
}
