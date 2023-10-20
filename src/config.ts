import { resolveRemove } from './commands/remove';

// 处理配置
export async function resolveConfig(options: any): Promise<void> {
  // remove
  const isDev = options.D || options.d || options.devDependencies || false
  if (options.mode === 'remove') {
    resolveRemove(isDev)
    return
  }
}
