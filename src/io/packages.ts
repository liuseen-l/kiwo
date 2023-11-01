import fg from 'fast-glob'
import fs from 'fs-extra'
import path from 'node:path'
import { parseDependencies, parseDependency } from './dependencies'

export async function loadPackage(relative: string, options: any): Promise<any> {
  const filepath = path.resolve(options.cwd, relative)

  const raw = await fs.readJSON(filepath)
  let deps

  deps = {
    prd: parseDependencies(raw, 'dependencies',),
    dev: parseDependencies(raw, 'devDependencies',),
    op: parseDependencies(raw, 'optionalDependencies',),
  }

  // if (raw.packageManager) {
  //   const [name, version] = raw.packageManager.split('@')
  //   deps.op.push(parseDependency(name, `^${version}`, 'packageManager'))
  // }

  return {
    name: raw.name,
    version: raw.version,
    relative,
    filepath,
    raw,
    deps,
    resolved: [],
  }
}

export async function loadPackages(options: any) {
  let packagesNames: string[] = []

  if (options.recursive) {
    packagesNames = await fg('**/package.json', {
      ignore: [
        '**/node_modules/**',
        '**/dist/**',
        '**/public/**',
      ],
      cwd: options.cwd,
      onlyFiles: true,
    })
  }
  else {
    packagesNames = ['package.json']
  }

  const packages = await Promise.all(
    packagesNames.map(
      relative => loadPackage(relative, options),
    ),
  )
  // console.log(packages);

  return packages
}
