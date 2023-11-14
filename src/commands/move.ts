import { dirname } from 'node:path'
import enquirer from 'enquirer'
import type { Agent } from '@antfu/ni'
import c from 'picocolors'
import { getAgent } from '../io/agent'
import { getCommandFn, getCommonPkgMeta } from '../utils'
import { loadPackages } from '../io/packages'
import type { PackageMeta, TypeCommonPkgMeta } from '../types'
import { COMMAND_TYPE } from '../types'
import { renderPackages } from './render'

async function getMoveCommand(agent: Agent, pkgNames: TypeCommonPkgMeta[], isDev: boolean) {
  // 如果移动生产依赖得先卸载在安装，开发依赖直接安装就可以移动
  const commands = [
    ...(isDev ? [getCommandFn(agent, [...pkgNames.map(i => i.name)], { type: COMMAND_TYPE.U })] : []),
    getCommandFn(agent, [...pkgNames.map(i => i.message), ...(!isDev ? ['-D'] : [])], { type: COMMAND_TYPE.I })]
  return Promise.all(commands)
}

async function choosePkg(options: any) {
  const packages = await loadPackages(options)
  renderPackages(packages)

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
        message: 'Select the project to be moved',
        initial: -1,
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

async function chooseDependent(pkgMeta: PackageMeta, options: any) {
  try {
    const { agent } = await getAgent(options)
    const { isDev } = options
    const { raw } = pkgMeta

    const type = isDev ? 'devDependencies' : 'dependencies'

    if (!raw[type]) {
      console.log(
        c.red('kiwo-error:'),
        c.red(`There are no ${isDev ? 'devDependencies' : 'dependencies'} in the ${pkgMeta.name} project`),
      )
      return
    }

    const choices = Object.keys(raw[type]).map(i => ({ message: i, name: `${i}:${raw[type][i]}`, value: raw[type][i] }))

    enquirer
      .prompt([
        {
          type: 'multiselect',
          name: 'move',
          message: isDev ? 'Move devDependencies to dependencies' : 'Move dependencies to devDependencies',
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
            cwd: dirname(pkgMeta.relative),
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
  catch (error) {

  }
}

export async function resolveMove(options: any) {
  const res = await choosePkg(options)
  await chooseDependent(res, options)
}
