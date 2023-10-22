import enquirer from 'enquirer';
import { getCommandFn, getCommonPkgMeta, getPkgManager, resolvePackages } from '../utils'
import { pkgRoot } from '../constants';
import { Agent } from '@antfu/ni';
import { COMMAND_TYPE, TypeCommonPkgMeta } from '../types';

async function getMoveCommand(agent: Agent, pkgNames: TypeCommonPkgMeta[], isDev: boolean) {
  const commands = [
    ...(isDev ? [getCommandFn(agent, [...pkgNames.map(i => i.name)], { type: COMMAND_TYPE.U })] : []),
    getCommandFn(agent, [...pkgNames.map(i => i.message), ...(!isDev ? ['-D'] : [])], { type: COMMAND_TYPE.I })]
  return Promise.all(commands)
}

export async function resolveMove(isDev: boolean) {
  const pkgMeta = await resolvePackages()
  const { agent } = await getPkgManager()
  
  enquirer
    .prompt([
      {
        type: "multiselect",
        name: "move",
        message: isDev ? '请选择以下dev依赖移动至prd依赖' : '请选择以下prd依赖移动至dev依赖',
        initial: 0,
        choices: isDev ? pkgMeta.dev : pkgMeta.prd
      },
    ]).then(async (earlyAnswers) => {
      const { move } = (earlyAnswers as { move: string[] })
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
          stdio: 'inherit'
        })
      }
    })
}
