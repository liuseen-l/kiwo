import process from 'node:process'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import type { Argv } from 'yargs'
import { resolveConfig } from './config'

function commonOptions(args: Argv<object>) {
  return args
    .option('dev', {
      alias: ['D', 'd'],
      type: 'boolean',
      default: false,
      describe: 'choose dependencies environment',
    }).option('cwd', {
      alias: 'C',
      default: '',
      type: 'string',
      describe: 'specify the current working directory',
    }).option('recursive', {
      alias: 'r',
      type: 'boolean',
      describe: 'recursively search for package.json in subdirectories',
    })
}

// match
// 1. mkpkg * [mode] *
// 2. mkpkg -*
// 3. mkpkg
// eslint-disable-next-line no-unused-expressions
yargs(hideBin(process.argv))
  .scriptName('pmm')
  .usage('$0 [args]')
  .command(
    '* [mode]',
    'welcome to pmm!',
    (yargs) => {
      return commonOptions(yargs)
        .positional('mode', {
          type: 'string',
          describe: 'the mode how version range resolves, can be "remove","move",""show"',
          default: 'move',
          choices: ['remove', 'move'],
        })
    },
    async (args) => {
      await resolveConfig(args)
    })
  .alias('h', 'help')
  .version('version', '1.0.1')
  .alias('v', 'version')
  .help()
  .argv
