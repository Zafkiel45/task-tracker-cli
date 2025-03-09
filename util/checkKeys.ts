import { argv } from "node:process";
import { readTasksFromJson } from "../modules/readTasksFromJson.ts";

import type { FileData } from "../modules/readTasksFromJson.ts";

/*
  This file is troblesome. The unique motivation to this file does not be 
  deleted is because of crashs in the system. This will be removed in the 
  future, or changed to something more functional.
*/ 

async function HandleReadFile() {
  try {
    const isTaskField = argv[2] !== "configuration-task-field";
    const isHelp = argv[2] !== "help";
    const isBackup = argv[2] !== "backup";
    const isNotification = argv[2] !== "notification";

    if (isTaskField && isHelp && isBackup && isNotification) {
      const jsonFile: FileData | void = await readTasksFromJson();

      if (typeof jsonFile === "undefined") {
        throw new Error();
      }

      const key = Object.keys(jsonFile[0]);

      const commandExist = key.find((item) => {
        return item === argv[2];
      });

      if (!commandExist) {
        throw new Error(
          `
                    Você está tentando acessar uma lista que não existe! 
                    Por favor, crie a lista antes para poder acessa-la. 
                    Caso tenha alguma dúvida, digite o comando "help" no 
                    terminal.
                `.trim()
        );
      }
    }
  } catch (err) {
    console.error("O seguinte erro ocorreu:", err);
    process.exit(1);
  }
}

HandleReadFile();
