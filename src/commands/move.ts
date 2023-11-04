import enquirer from 'enquirer'
import type { Agent } from '@antfu/ni'
import { getCommandFn, getCommonPkgMeta } from '../utils'
import { pkgRoot } from '../constants'
import type { TypeCommonPkgMeta } from '../types'
import { COMMAND_TYPE } from '../types'
import { getAgent } from '../io/agent'
import { loadPackages } from '../io/packages'

async function getMoveCommand(agent: Agent, pkgNames: TypeCommonPkgMeta[], isDev: boolean) {
  // 如果移动生产依赖得先卸载在安装，开发依赖直接安装就可以移动
  const commands = [
    ...(isDev ? [getCommandFn(agent, [...pkgNames.map(i => i.name)], { type: COMMAND_TYPE.U })] : []),
    getCommandFn(agent, [...pkgNames.map(i => i.message), ...(!isDev ? ['-D'] : [])], { type: COMMAND_TYPE.I })]
  return Promise.all(commands)
}

async function choosePkg(options: any) {
  const packages = await loadPackages(options)
  const choices = packages.map(i => ({
    message: i.name,
    value: i.name,
    name: i.name,
  }))

  try {
    const earlyAnswers = await enquirer.prompt([
      {
        type: 'select',
        name: 'move',
        message: '选择操作的项目',
        initial: 0,
        choices,
      },
    ])
    const { move } = (earlyAnswers as { move: string })
    console.clear()
    return packages.find(i => i.name === move)
  }
  catch (e) {
  }
}

async function chooseDependent(pkgMeta: any, options: any) {
  const { agent } = await getAgent(options)
  const { isDev } = options
  const { raw } = pkgMeta

  const type = isDev ? 'devDependencies' : 'dependencies'

  if (!raw[type])
    return

  const choices = Object.keys(raw[type]).map(i => ({ message: i, name: `${i}:${raw[type][i]}`, value: raw[type][i] }))

  enquirer
    .prompt([
      {
        type: 'multiselect',
        name: 'move',
        message: isDev ? '请选择以下dev依赖移动至prd依赖' : '请选择以下prd依赖移动至dev依赖',
        initial: -1,
        choices,
      },
    ]).then(async (earlyAnswers) => {
      const { move } = (earlyAnswers as { move: string[] })
      if (move.length <= 0)
        return

      const pkgNames = getCommonPkgMeta(move)
      const commands = await getMoveCommand(agent, pkgNames, isDev)
      const { execaCommand } = await import('execa')

      for await (const c of commands) {
        await execaCommand(c!, {
          cwd: pkgRoot,
          env: {
            COLORS: 'true',
            FORCE_COLOR: 'true',
          },
          stdio: 'inherit',
        })
      }
    }).catch((e) => {
    })
}

export async function resolveMove(options: any) {
  const res = await choosePkg(options)
  await chooseDependent(res, options)
}
