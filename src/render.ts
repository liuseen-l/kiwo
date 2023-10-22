import c from 'picocolors'
import { MultiBar, Presets } from 'cli-progress'

export const FIG_CHECK = c.green('◉')
export const FIG_UNCHECK = c.gray('◌')
export const FIG_POINTER = c.cyan('❯ ')
export const FIG_NO_POINTER = '  '
export const FIG_BLOCK = c.bold(c.dim(c.gray('┃')))



export function createMultiProgressBar() {
  return new MultiBar({
    clearOnComplete: true,
    hideCursor: true,
    format: `{type} {bar} {value}/{total} ${c.gray('{name}')}`,
    linewrap: false,
    barsize: 40,
  }, Presets.shades_grey)
}
