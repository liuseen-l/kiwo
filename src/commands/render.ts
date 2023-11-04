import c from 'picocolors'
import { FIG_BLOCK, FIG_CHECK, formatTable } from '../render'
import type { PackageMeta } from '../types'

export function renderPackage(pkg: PackageMeta) {
  const lines = []

  const { deps, name, filepath } = pkg
  lines.push(
    `${c.bgCyan(name)}`,
    c.dim(c.green(filepath)),
    '',
  )
  const changes = []
  const maxLen = Math.max(deps.prd.length, deps.dev.length)

  for (let i = 0; i < maxLen; i++) {
    changes.push([
      i === 0 ? c.gray('devDependencies') : '',
      deps.dev?.length === 0 ? FIG_BLOCK : deps.dev[i] ? `${deps.dev[i].name}` : '',
      i === 0 ? c.gray('dependencies') : '',
      deps.prd?.length === 0 ? FIG_BLOCK : deps.prd[i] ? `${deps.prd[i].name}` : '',
    ])
  }

  lines.push(...formatTable(changes, 'LLLL'))
  lines.push('')

  return {
    lines,
  }
}

export function renderPackages(packages: PackageMeta[]) {
  const lines: string[] = ['']

  packages.forEach((pkg) => {
    const result = renderPackage(pkg)
    lines.push(...result.lines)
  })

  console.log(lines.join('\n'))
  console.log(FIG_CHECK, c.green(' The above are the projects under the current process(cwd)'))
  console.log()
}
