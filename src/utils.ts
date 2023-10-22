import fs from 'fs-extra'
import fg from 'fast-glob'
import { resolve } from 'node:path'
import { NPM_LOCK, PNPM_LOCK, YARN_LOCK, pkgRoot } from './constants';
import { Agent, parseNi, parseNun } from '@antfu/ni';
import { COMMAND_TYPE, TypeAgent, TypeCommand, TypeCommonPkgMeta, TypePkgMeta } from './types';

// 获取当前项目的依赖
export async function getPackages() {
  const pkgPath = resolve(pkgRoot, 'package.json')
  const { devDependencies, dependencies } = await fs.readJSON(pkgPath)
  return {
    devDependencies,
    dependencies
  } as TypePkgMeta
};

// 处理当前项目的包管理器
export async function getPkgManager(): Promise<TypeAgent> {
  const pkgManager = fg
    .sync('*.yaml', {
      cwd: resolve(pkgRoot),
      onlyFiles: true,
    })[0];


  if (pkgManager === PNPM_LOCK) {
    return {
      agent: 'pnpm'
    }
  }

  if (pkgManager === YARN_LOCK) {
    return {
      agent: 'yarn'
    }
  }

  if (pkgManager === NPM_LOCK) {
    return {
      agent: 'npm'
    }
  }

  return {
    agent: 'npm'
  }
}


// 处理依赖用于控制台展示
export async function resolvePackages() {
  const { devDependencies, dependencies } = await getPackages()

  const pkgMeta = {
    dev: Object.keys(devDependencies).map(i => ({ message: i, name: `${i}:${devDependencies[i]}`, value: devDependencies[i] })),
    prd: Object.keys(dependencies).map(i => ({ message: i, name: `${i}:${dependencies[i]}`, value: dependencies[i] }))
  }
  return pkgMeta
}

export function getCommandFn(agent: Agent, arg: string[], options: TypeCommand) {
  const { type } = options
  let fn
  switch (type) {
    case COMMAND_TYPE.I:
      fn = parseNi(agent, arg); break
    case COMMAND_TYPE.U:
      fn = parseNun(agent, arg); break
  }

  return fn
}

// [包名:版本号] => [包名@版本号]
export function getCommonPkgMeta(pkgList: string[]): TypeCommonPkgMeta[] {
  return pkgList.map(i => {
    const p = i.split(':')
    return {
      name: p[0],
      version: p[1],
      message: p.join("@")
    }
  })
}
