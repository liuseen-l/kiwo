import fs from 'fs-extra'
import fg from 'fast-glob'
import { resolve } from 'node:path'
import { NPM_LOCK, PNPM_LOCK, YARN_LOCK, pkgRoot } from './constants';
import { Agent, parseNi, parseNun } from '@antfu/ni';
import { COMMAND_TYPE, TypeCommand, TypeCommonPkgMeta, } from './types';

export async function checkRepo(): Promise<boolean> {
  return false
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
