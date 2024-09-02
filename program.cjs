#!/user/bin/env node
const { argv } = require("node:process");
const fs = require("node:fs/promises");

const commands = argv.slice(2);

async function HandleUpdateTasks() {
  try {
    const jsonBuffer = await HandleReadTaskFile();

    if (commands[1] && !isNaN(commands[1]) && commands[2]) {
      const updatedTasks = jsonBuffer.map((item, index) => {
        if (jsonBuffer[index].id === Number(commands[1])) {
          item.name = commands[2];
          item.updateAt = HandleGetData();
        }

        return item;
      });

      await fs.writeFile("tasks.json", JSON.stringify(updatedTasks, null, 2));
      console.log(`task with id ${commands[1]} successfully updated`);
    } else {
      // possible commons errors
      if (!commands[1]) {
        throw new Error("The ID was not specified");
      } else if (!commands[2]) {
        throw new Error("Name of the tasks wasn't specified");
      } else if (isNaN(commands[1])) {
        throw new Error("[SYNTAX ERROR]: Please, the ID shall be a number");
      }
      // catch all adjacent errors
      throw new Error("[Unknow Error]: Please, try again");
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

async function HandleAddTasks() {
  try {
    const jsonBuffer = await HandleReadTaskFile();

    if (commands[2]) {
      jsonBuffer[0][HandleGetCategory()].push({
        name: String(commands[2]),
        id: await HandleGenerateTasksId(jsonBuffer[0][HandleGetCategory()]),
        description: "",
        status: "todo",
        createdAt: HandleGetData(),
        updateAt: HandleGetData(),
        type: "",
        finishAt: "",
      });

      await fs.writeFile("tasks.json", JSON.stringify(jsonBuffer, null, 2));
      console.info(
        "task successfully added with ID:",
        (await HandleGenerateTasksId(jsonBuffer[0][HandleGetCategory()])) - 1
      );
    } else {
      if (!commands[2]) {
        throw new Error(
          `Name of the task is empty! Please, add some name to it.`
        );
      }
    }
  } catch (err) {
    console.error("[ERROR]:", err);
    process.exit(1);
  }
}
async function HandleDeleteTask() {
  try {
    const jsonBuffer = await HandleReadTaskFile();

    if (commands[2]) {
      const category = commands[0];

      const tasksFiltred = jsonBuffer[0][category].filter((item) => {
        return item.id !== Number(commands[2]);
      });

      if (tasksFiltred.length === jsonBuffer[0][category].length) {
        console.log("the task do not exist");
      } else {
        console.warn(`task with id: ${commands[2]} successfully deleted`);
      }

      jsonBuffer[0][category] = tasksFiltred;

      await fs.writeFile("tasks.json", JSON.stringify(jsonBuffer, null, 2));
    } else {
      throw new Error("You didn't pass the ID of the task");
    }
  } catch (deleteTaskErr) {
    console.error(deleteTaskErr);
    process.exit(1);
  }
}
async function HandleListTasks() {
  try {
    function HandleEmptyArray(arr) {
      return arr.length === 0 ? "without tasks" : arr;
    }
    function HandleFormaterDescription(arr) {
      return arr.map((item) => {
        if (item.description === "") {
          item.description = "empty";
        } else {
          item.description = item.description.slice(0, 20) + "...";
        }

        return item;
      });
    }

    const jsonBuffer = await HandleReadTaskFile();

    switch (commands[2]) {
      case undefined:
        const allTasks = HandleFormaterDescription(
          jsonBuffer[0][HandleGetCategory()]
        );
        console.table(allTasks);
        break;
      case "todo":
        const todoArrayFiltred = jsonBuffer[0][HandleGetCategory()].filter(
          (item) => item.status === "todo"
        );
        const todoArray = HandleFormaterDescription(todoArrayFiltred);
        console.table(HandleEmptyArray(todoArray));
        break;
      case "done":
        const doneArrayFiltred = jsonBuffer[0][HandleGetCategory()].filter(
          (item) => item.status === "done"
        );
        const doneArray = HandleFormaterDescription(doneArrayFiltred);
        console.table(HandleEmptyArray(doneArray));
        break;
      case "in-progress":
        const inProgressArrayFiltred = jsonBuffer[0][
          HandleGetCategory()
        ].filter((item) => item.status === "in-progress");
        const inProgressArray = HandleFormaterDescription(
          inProgressArrayFiltred
        );
        console.table(HandleEmptyArray(inProgressArray));
        break;
      default:
        throw new Error(
          `[UNKNOW COMMAND]: "${commands[2]}". Please, use: 'done', 'in-progress' or 'todo'`
        );
    }
  } catch (err) {
    console.error("The following error occurred:", err);
    process.exit(1);
  }
}
async function HandleSetTaskStatus(status) {
  try {
    const jsonBuffer = await HandleReadTaskFile();

    if (commands[2]) {
      const updatedArray = jsonBuffer[0][HandleGetCategory()].map(
        (item, index, arr) => {
          if (arr[index].id === Number(commands[2])) {
            item.status = status;
            item.updateAt = HandleGetData();
          }
          return item;
        }
      );

      if (
        updatedArray.status ===
        jsonBuffer[0][HandleGetCategory()][commands[2]].status
      ) {
        console.log(
          "The task does not exist or it   the same the status passed"
        );
      } else {
        console.log(`task with ID: ${commands[2]} successfully updated!`);
      }
      // updating the specific category in jsonBuffer to preserve structure
      jsonBuffer[0][HandleGetCategory()] = updatedArray;
      await fs.writeFile("tasks.json", JSON.stringify(jsonBuffer, null, 2));
    } else {
      throw new Error(
        `[SYNTAX ERROR]: Empty 'id'. Please, specific the task 'id'`
      );
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
async function HandleSetTaskDescription() {
  try {
    const jsonBuffer = await HandleReadTaskFile();

    if (commands[2] && commands[3]) {
      const updatedArray = jsonBuffer[0][HandleGetCategory()].map(
        (item, index, arr) => {
          if (arr[index].id === Number(commands[2])) {
            item.description = commands[3];
            item.updateAt = HandleGetData();
          }
          return item;
        }
      );

      if (
        updatedArray.description ===
        jsonBuffer[0][HandleGetCategory()][commands[2]].description
      ) {
        console.log("Same description passed");
      } else {
        console.log(`task with ID: ${commands[2]} successfully updated!`);
      }

      jsonBuffer[0][HandleGetCategory()] = updatedArray;
      await fs.writeFile("tasks.json", JSON.stringify(jsonBuffer, null, 2));
    } else {
      if (!commands[2]) {
        throw new Error(`[SYNTAX ERROR]: Empty description`);
      } else if (!commands[1]) {
        throw new Error(`[SYNTAX ERROR]: You forgot the id of the task`);
      } else {
        throw new Error(
          `[UNKNOWN ERROR]: Please, check if you wrote correctly and try again.`
        );
      }
    }
  } catch (err) {
    console.error(err);
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
          { daily: [], study: [], entreteniment: [], revision: [] },
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
    console.error("Error reading file:", err);
    process.exit(1);
  }
}
function HandleGetData() {
  const dateObject = new Date();

  const currentData = dateObject.getDate();
  const currentMonth = dateObject.getMonth() + 1;
  const currentYear = dateObject.getFullYear();

  return `${currentData}/${currentMonth}/${currentYear}`;
}
function HandleGetCategory() {
  return commands[0];
}

if(commands[0]) {
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
      case "description":
        HandleSetTaskDescription();
        break;
      default:
        console.log("OCORREU UM ERRO FATAL");
    }
} else {
    console.error('please, specific list with the first command: "daily", "study", "entreteniment", "revision"')
}
