import yargs from 'yargs';
import { hideBin } from 'yargs/helpers'
import { resolveConfig } from './config';
import type { Argv } from 'yargs'

function commonOptions(args: Argv<object>) {
  return args
    .option('dev', {
      alias: ['D', 'd'],
      type: 'boolean',
      default: false,
      describe: 'choose dependencies environment',
    })
}

// match 
// 1. mkpkg * [mode] * 
// 2. mkpkg -*
// 3. mkpkg 
yargs(hideBin(process.argv))
  .scriptName("pmm")
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
          choices: ['remove', 'move',]
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

// 默认remove dev依赖 
process.on('SIGINT', function () {
  console.log('Exit now!');
  process.exit();
});
