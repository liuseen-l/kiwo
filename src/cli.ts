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

// eslint-disable-next-line no-unused-expressions
yargs(hideBin(process.argv))
  .scriptName('kiwo')
  .usage('Usage: $0 [command] <options>')
  .command(
    '* [mode]',
    'welcome to kiwo!',
    (yargs) => {
      return commonOptions(yargs)
        .positional('mode', {
          type: 'string',
          describe: 'the mode how version range resolves, can be "move"',
          default: 'move',
          choices: ['move'],
        })
    },
    async (args) => {
      await resolveConfig(args)
    })
  .alias('h', 'help') // global option alias
  .version('version', '1.0.1')
  .alias('v', 'version')
  .help()
  .strict()
  .argv
