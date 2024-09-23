#!/user/bin/env node
const { argv } = require("node:process");
const fs = require("node:fs/promises");
const path = require("path");

module.exports = {
  HandleReadTaskFile,
};
// module imports
const { GenericErrors } = require("./util/error.cjs");
const {
  HandleCreateNewFieldToTasks,
} = require("./components/create-new-field.cjs");
const { HandleDeleteField } = require("./components/delete-field.cjs");
const { HandleSetTypeAllTasks } = require("./components/type-all-tasks.cjs");
const { HandleHelp } = require("./components/help-user.cjs");
// minor utils
const commands = argv.slice(2);
const TASK_LIST = commands[0];
// paths
const originalFilePath = path.join(__dirname, "tasks.json");
const backupFolderPath = path.join(__dirname, "backup");
const backupFilePath = path.join(backupFolderPath, "backup.json");
// retry again after an error
const MAX_RETRIES = 5;
const TIME_TO_RETRIES = 2000;

async function HandleDirectoryIfDidNotExist() {
  try {
    await fs.access(backupFolderPath);
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.mkdir(backupFolderPath);
      console.log(`✅ Diretório de backup criado com sucesso!`);
      console.log(
        `🔷 Se necessário, cheque manualmente o arquivo de backup manualmente`
      );
    }
  }
}
async function HandleCopyFile(src, dist, retries = 0) {
  try {
    await fs.copyFile(src, dist);
    console.log(`✅ Backup atualizado com sucesso!`);
  } catch (err) {
    if (err.code === "EBUSY" && retries < MAX_RETRIES) {
      console.warn(
        `Um erro ocorreu durante o processo de backup, tentando
          novamente em ${TIME_TO_RETRIES} segundos
        `.trim()
      );

      await new Promise((resolve) => setTimeout(resolve, TIME_TO_RETRIES));
      return HandleCopyFile(src, dist, retries + 1);
    } else {
      console.error(`❌ Não foi possível realizar o backup`, err);
    }
  }
}
async function HandleBeckup() {
  try {
    await HandleDirectoryIfDidNotExist();
    await HandleCopyFile(originalFilePath, backupFilePath);
  } catch (err) {
    console.error(err.message.trim());
  }
}
async function HandleUpdateTasks() {
  try {
    const JSON_BUFFER = await HandleReadTaskFile();

    if (commands[2] && !isNaN(commands[2]) && commands[3]) {
      HandleUpdateElementAttribute.call(
        JSON_BUFFER[0][TASK_LIST],
        commands[3].toLocaleLowerCase(),
        "name"
      );
      await HandleWriteFile.call(JSON_BUFFER);

      const elementFindOut = HandleFindElement.call(JSON_BUFFER[0][TASK_LIST]);

      console.log(
        `🔷 A tarefa com ID ${commands[2]} Foi atualizada com sucesso`.trim()
      );
      console.log(
        `🔷 O nome da tarefa atualiza agora é: ${elementFindOut.name}`.trim()
      );
    } else {
      if (!commands[1]) {
        throw new GenericErrors(
          `[ERRO]: O ID da tarefa não foi especificado`,
          `[TIPO DE ERRO]: Sintax`
        );
      } else if (!commands[2]) {
        throw new GenericErrors(
          `[ERRO]: Name da terefa não foi específicado`,
          `[TIPO DE ERRO]: Sintax`
        );
      } else if (isNaN(commands[1])) {
        throw new GenericErrors(
          `[ERRO]: O ID da tarefa precisa ser um número`,
          `[TIPO DE ERRO]: Sintax`
        );
      }
      throw new GenericErrors(
        `[ERRO]: Por favor, tente novamente`,
        `[TIPO DE ERRO]: Desconhecido`
      );
    }
  } catch (err) {
    console.error(err.message.trim(), err.type);
    process.exit(1);
  }
}
async function HandleAddTasks() {
  try {
    const JSON_BUFFER = await HandleReadTaskFile();

    if (commands[2]) {
      JSON_BUFFER[0][TASK_LIST].push({
        name: String(commands[2]).toLowerCase(),
        id: HandleGenerateTasksId(JSON_BUFFER[0][TASK_LIST]),
        status: "todo",
        createdAt: HandleGetDate(),
        updateAt: HandleGetDate(),
        lastCompleteDate: "",
        type: "",
        finishAt: "",
        streak: 0,
      });

      await HandleWriteFile.call(JSON_BUFFER);
      console.info(
        "🔷 tarefa com o seguinte ID foi criada:",
        HandleGenerateTasksId(JSON_BUFFER[0][TASK_LIST]) - 1
      );
    } else {
      if (!commands[2]) {
        throw new GenericErrors(
          `❗ [ERRO]: O nome da tarefa está vazia, por favor, dê um nome a ela!`,
          "❗ [TIPO DE ERRO]: Sintax"
        );
      }
    }
  } catch (err) {
    console.error(err.message, err.type);
    process.exit(1);
  }
}
async function HandleDeleteTask() {
  try {
    const JSON_BUFFER = await HandleReadTaskFile();

    if (commands[2]) {
      const tasksFiltred = JSON_BUFFER[0][TASK_LIST].filter((item) => {
        return item.id !== Number(commands[2]);
      });

      if (tasksFiltred.length === JSON_BUFFER[0][TASK_LIST].length) {
        console.log("❗ A tefefa não existe");
      } else {
        console.warn(
          `✅ A terefa com o ID: ${commands[2]} foi deleta com sucesso!`
        );
        console.warn(`🔷 A terefa era da seguinte lista: ${commands[0]}`);
      }

      JSON_BUFFER[0][TASK_LIST] = tasksFiltred;
      await HandleWriteFile.call(JSON_BUFFER);
    } else {
      throw new GenericErrors(
        "[Errror]: You didn't pass the ID of the task",
        "[Type of Error]: Syntax"
      );
    }
  } catch (deleteTaskErr) {
    console.error(deleteTaskErr.message, deleteTaskErr.type);
    process.exit(1);
  }
}
async function HandleListTasks() {
  try {
    function HandleEmptyArray(arr) {
      return arr.length === 0 ? "Sem tarefas!" : arr;
    }

    const jsonBuffer = await HandleReadTaskFile();

    switch (commands[2]) {
      case undefined:
        const allTasks = jsonBuffer[0][TASK_LIST];
        console.table(allTasks);
        break;
      case "todo":
        const todoArrayFiltred = jsonBuffer[0][TASK_LIST].filter(
          (item) => item.status === "todo"
        );
        const todoArray = todoArrayFiltred;
        console.table(HandleEmptyArray(todoArray));
        break;
      case "done":
        const doneArrayFiltred = jsonBuffer[0][TASK_LIST].filter(
          (item) => item.status === "done"
        );
        const doneArray = doneArrayFiltred;
        console.table(HandleEmptyArray(doneArray));
        break;
      case "in-progress":
        const inProgressArrayFiltred = jsonBuffer[0][TASK_LIST].filter(
          (item) => item.status === "in-progress"
        );
        const inProgressArray = inProgressArrayFiltred;
        console.table(HandleEmptyArray(inProgressArray));
        break;
      default:
        throw new GenericErrors(
          `
            ❗ Status desconhecido: "${commands[2]}". 
            Por favor, use: 'done', 'in-progress' ou 'todo'
          `.trim(),

          "❗ [TIPO DE ERRO]: Sintax"
        );
    }
  } catch (err) {
    console.error(err.message, err.type);
    process.exit(1);
  }
}
async function HandleSetTaskStatus(sts) {
  try {
    const JSON_BUFFER = await HandleReadTaskFile();

    if (commands[2]) {
      await HandleUpdateElementAttribute.call(
        JSON_BUFFER[0][TASK_LIST],
        sts,
        "status"
      );
      const elementFindOut = HandleFindElement.call(JSON_BUFFER[0][TASK_LIST]);

      console.log(
        `✅ A terefa da lista '${commands[0]}' com ID ${commands[2]} Foi atualizada com sucesso`.trim()
      );
      console.log(`🔷 Nome da tarefa atualizada: ${elementFindOut.name}`);
      // update de json file
      await HandleWriteFile.call(JSON_BUFFER);
    } else {
      throw new GenericErrors(
        `❗ Specifique o ID da tarefa'`,
        "❗ [TIPO DE ERRO]: Sintax"
      );
    }
  } catch (err) {
    console.error(err.message, err.type);
    process.exit(1);
  }
}
async function HandleDeleteAllTasks() {
  try {
    const JSON_BUFFER = await HandleReadTaskFile();

    JSON_BUFFER[0][TASK_LIST] = [];

    HandleWriteFile.call(JSON_BUFFER);

    console.log(
      `
      ✅ Todas as tarefas de ${TASK_LIST} foram deletadas com sucesso!
    `.trim()
    );
  } catch (err) {
    console.error("❗ Ocorreu um erro:", err);
    process.exit(1);
  }
}
async function HandleMarkAllTasks(sts) {
  try {
    const JSON_BUFFER = await HandleReadTaskFile();

    for (element of JSON_BUFFER[0][TASK_LIST]) {
      element.status = sts;
    }

    HandleWriteFile.call(JSON_BUFFER);

    console.log(
      `✅ Todas as tarefas de: ${TASK_LIST} foram marcadas como ${sts} com sucesso`
    );
  } catch (err) {
    console.error("occur a error:", err.trim());
    process.exit(1);
  }
}
async function HandleSetTypeOfTask() {
  try {
    const JSON_BUFFER = await HandleReadTaskFile();

    if (!isNaN(commands[2]) && commands[2] && commands[3]) {
      HandleUpdateElementAttribute.call(
        JSON_BUFFER[0][TASK_LIST],
        commands[3],
        "type"
      );
      HandleWriteFile.call(JSON_BUFFER);

      const elementFindOut = HandleFindElement.call(JSON_BUFFER[0][TASK_LIST]);
      console.log(
        `✅ A tarefa com o ID ${commands[2]} foi atualizada com sucesso!`
      );
      console.log(`🔷 O nome da tarefa é: ${elementFindOut.name}`);
    } else {
      if (!commands[2] || isNaN(commands[2])) {
        throw new GenericErrors(
          `❗ Você esqueceu de passar o ID da tarefa!`,
          `❗ [TIPO DE ERRO]: Sintax`
        );
      } else if (!commands[3]) {
        throw new GenericErrors(
          `❗ Você esqueceu de passar o nome do tipo!`,
          `❗ [TIPO DE ERRO]: Sintax`
        );
      } else {
        throw new GenericErrors(
          `❗ Ops... Algo deu errado`,
          `❗ [TIPO DE ERRO]: Desconhecido`
        );
      }
    }
  } catch (err) {
    console.error(err.message.trim(), err.type);
    process.exit(1);
  }
}
async function HandleSetDateConclusion() {
  try {
    const JSON_BUFFER = await HandleReadTaskFile();

    if (commands[2] && commands[3]) {
      const dateFormater = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(\d{4})$/;
      const dateTest = dateFormater.test(commands[3]);

      if (!dateTest) {
        throw new GenericErrors(
          `❗ A formatação está errada, por favor, utilize o seguinte formato: [MM][DD][YYYY]`,
          `❗ [TIPO DE ERRO]: Sintax`
        );
      }

      HandleUpdateElementAttribute.call(
        JSON_BUFFER[0][TASK_LIST],
        commands[3],
        "finishAt"
      );
      HandleWriteFile.call(JSON_BUFFER);

      const elementFindOut = HandleFindElement.call(JSON_BUFFER[0][TASK_LIST]);

      console.log(
        `🔷 A tarefa com ID ${commands[2]} foi atualizada com sucesso!`
      );
      console.log(`🔷 O nome da tarefa é: ${elementFindOut.name}`);
    } else {
      if (!commands[2] || isNaN(commands[2])) {
        throw new GenericErrors(
          "❗ Você esqueceu de passar o ID da tarefa",
          "❗ [TIPO DE ERRO]: Sintax"
        );
      } else if (!commands[3]) {
        throw new GenericErrors(
          "❗ Você esqueceu de passar a data de conclusão",
          "❗ [TIPO DE ERRO]: Sintax"
        );
      } else {
        throw new GenericErrors(
          "❗ Ops...Algo deu errado!",
          "❗ [TIPO DE ERRO]: Sintax"
        );
      }
    }
  } catch (err) {
    console.error(err.message.trim(), err.type);
    process.exit(1);
  }
}
async function HandleSetDateConclusionToAllTasks() {
  try {
    const JSON_BUFFER = await HandleReadTaskFile();
    const dateFormater = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(\d{4})$/;

    if (dateFormater.test(commands[2])) {
      for (element of JSON_BUFFER[0][TASK_LIST]) {
        element.finishAt = commands[2];
      }

      await HandleWriteFile.call(JSON_BUFFER);
      console.log(
        `🔷 Todas as tarefas de ${TASK_LIST} foram agendadas para ${commands[2]}`
      );
    } else {
      throw new GenericErrors(
        `
        ❗ Por favor, utilize o seguinte formato: [MM]/[DD]/[YYYY]`,
        `[TIPO DE ERRO]: Sintax`
      );
    }
  } catch (err) {
    console.error(err.message.trim(), err.type);
    process.exit(1);
  }
}
// utlity function
function HandleGenerateTasksId(dataArray) {
  let maxId = dataArray.reduce((max, item) => Math.max(max, item.id || 0), 0);
  return maxId + 1;
}
async function HandleReadTaskFile() {
  try {
    try {
      const jsonData = await fs.readFile("tasks.json");
      return JSON.parse(jsonData);
    } catch (readErr) {
      if (readErr.code === "ENOENT") {
        const tasksStructure = [
          { daily: [], study: [], entertainment: [], revision: [] },
        ];
        await fs.writeFile(
          "tasks.json",
          JSON.stringify(tasksStructure, null, 2)
        );
        return tasksStructure;
      } else {
        throw readErr;
      }
    }
  } catch (err) {
    console.error("❗ Erro ao ler o arquivo:", err);
    process.exit(1);
  }
}
function HandleGetDate() {
  const dateObject = new Date();

  const currentData = dateObject.getDate();
  const currentMonth = dateObject.getMonth() + 1;
  const currentYear = dateObject.getFullYear();

  return `${currentMonth}/${currentData}/${currentYear}`;
}
function HandleUpdateElementAttribute(attr, property) {
  for (element of this) {
    if (element.id === Number(commands[2])) {
      const { lastCompleteDate } = element;

      element[property] = attr;
      element.updateAt = HandleGetDate();

      if (attr === "done" && HandleStreakOfTasks(lastCompleteDate)) {
        element.streak += 1;
        element.lastCompleteDate = HandleGetDate();
      }
      break;
    }
  }
}
async function HandleWriteFile() {
  await fs.writeFile("tasks.json", JSON.stringify(this, null, 2));
}
function HandleFindElement() {
  const element = this.find((item) => {
    return item.id === Number(commands[2]);
  });

  return element;
}
function HandleStreakOfTasks(lastDate) {
  return lastDate !== HandleGetDate() ? true : false;
}

const errorLogs = [
  "add",
  "update",
  "list",
  "mark-all-done",
  "mark-all-in-progress",
  "mark-done",
  "mark-in-progress",
  "mark-todo",
  "delete-task",
  "mark-all-todo",
  "delete-all",
  "type",
  "data-conclusion",
  "type-all",
  "data-conclusion-all",
  "configuration-task-field",
];

switch (commands[1]) {
  case "add":
    HandleAddTasks();
    break;
  case "delete-task":
    HandleDeleteTask();
    break;
  case "update":
    HandleUpdateTasks();
    break;
  case "list":
    HandleListTasks();
    break;
  case "mark-todo":
    HandleSetTaskStatus("todo");
    break;
  case "mark-done":
    HandleSetTaskStatus("done");
    break;
  case "mark-in-progress":
    HandleSetTaskStatus("in-progress");
    break;
  case "delete-all":
    HandleDeleteAllTasks();
    break;
  case "mark-all-done":
    HandleMarkAllTasks("done");
    break;
  case "mark-all-todo":
    HandleMarkAllTasks("todo");
    break;
  case "mark-all-in-progress":
    HandleMarkAllTasks("in-progress");
    break;
  case "type":
    HandleSetTypeOfTask();
    break;
  case "date-conclusion":
    HandleSetDateConclusion();
    break;
  case "date-conclusion-all":
    HandleSetDateConclusionToAllTasks();
    break;
  case "add-field":
    HandleCreateNewFieldToTasks(HandleReadTaskFile, HandleWriteFile);
    break;
  case "delete-field":
    HandleDeleteField(HandleReadTaskFile, HandleWriteFile);
    break;
  case "type-all":
    HandleSetTypeAllTasks(HandleReadTaskFile, HandleWriteFile);
    break;
  case "all":
    HandleHelp();
    break;
  case "run":
    HandleBeckup();
    break;
  default:
    (() => {
      if (!TASK_LIST) {
        console.log(
          `🔷 Por favor, para saber mais sobre todos os comandos, utilize: "help all"`
        );
        console.error("❗ Comando inválido! Utilize um dos seguintes:");
        errorLogs.forEach((item) => {
          console.error(item);
        });
      }
    })();
}
