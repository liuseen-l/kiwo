import fs from 'fs-extra'
import { resolve } from 'node:path'

export async function getPackages() {
  const packageRoot = process.cwd();
  const pkgPath = resolve(packageRoot, 'package.json')
  const { devDependencies, dependencies } = await fs.readJSON(pkgPath)
  console.log(devDependencies, dependencies);
}
getPackages()
