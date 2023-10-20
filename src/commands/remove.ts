import enquirer from 'enquirer';
import { getCommand, getCommonPkgNames, getPkgManager, resolvePackages } from '../utils'
import { pkgRoot } from '../constants';

export async function resolveRemove(isDev: boolean) {
  const pkgMeta = await resolvePackages()
  const pkgManager = await getPkgManager()
  enquirer
    .prompt([
      {
        type: "multiselect",
        name: "remove",
        message: "choose remove modules",
        // hint: "(Press <space> to select, <a> to toggle all, <i> to invert selection)",
        initial: 0,
        choices: isDev ? pkgMeta.dev : pkgMeta.prd
      },
    ]).then(async (earlyAnswers) => {
      const { remove } = (earlyAnswers as { remove: string[] })
      const pkgNames = getCommonPkgNames(remove)
      const { agent } = pkgManager
      const command = await getCommand(agent, [...pkgNames, ...(!isDev ? ['-D'] : [])])
      const { execaCommand } = await import('execa')

      const _process = execaCommand(command!, {
        cwd: pkgRoot,
        env: {
          COLORS: 'true',
          FORCE_COLOR: 'true',
        },
        stdio: 'inherit'
      })


    })
}
