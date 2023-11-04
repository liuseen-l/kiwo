import type { Agent } from '@antfu/ni'
import { parseNi, parseNun } from '@antfu/ni'
import type { TypeCommand, TypeCommonPkgMeta } from './types'
import { COMMAND_TYPE } from './types'

export async function checkRepo(): Promise<boolean> {
  return false
}

export function getCommandFn(agent: Agent, arg: string[], options: TypeCommand) {
  const { type } = options
  let fn
  switch (type) {
    case COMMAND_TYPE.I:
      fn = parseNi(agent, arg)
      break
    case COMMAND_TYPE.U:
      fn = parseNun(agent, arg)
      break
  }

  return fn
}

// [包名:版本号] => [包名@版本号]
export function getCommonPkgMeta(pkgList: string[]): TypeCommonPkgMeta[] {
  return pkgList.map((i) => {
    const p = i.split(':')
    return {
      name: p[0],
      version: p[1],
      message: p.join('@'),
    }
  })
}
