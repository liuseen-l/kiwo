import yargs from 'yargs';
import { hideBin } from 'yargs/helpers'
import { resolveConfig } from './config';
import type { Argv } from 'yargs'

function commonOptions(args: Argv<object>) {
  return args
    .option('devDependencies', {
      alias: ['D', 'd'],
      type: 'boolean',
      describe: 'choose dependencies environment',
    })
}

// match 
// 1. mkpkg * remove|move * 
// 2. mkpkg -*
// 3. mkpkg 
yargs(hideBin(process.argv))
  .scriptName("mvpkg")
  .usage('$0 [args]')
  .command(
    '* [mode]',
    'welcome mvpkg!',
    (yargs) => {
      return commonOptions(yargs)
        .positional('mode', {
          type: 'string',
          describe: 'the mode how version range resolves, can be "remove","move"',
          default: 'move',
          choices: ['remove', 'move']
        })
    },
    async (args) => {
      console.log(args);
      await resolveConfig(args)
    })
  .alias('h', 'help')
  .version('version', '1.0.1')
  .alias('v', 'version')
  .help()
  .argv


