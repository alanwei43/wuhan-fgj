#!/usr/bin/env node

import { commandDir } from "yargs";

commandDir("commands", {
  recurse: true,
  extensions: ["js", "ts"]
}).demandCommand()
  .version("version", "显示版本号", "0.0.1")
  .help("help", "显示帮助")
  .example("$0 web 8083", "启动Web服务, 监听8083端口号")
  .argv;