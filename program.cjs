#!/user/bin/env node
const { argv } = require("node:process");
const fs = require("node:fs/promises");

const { GenericErrors }= require("./util/error");

const commands = argv.slice(2);
const TASK_LIST = commands[0];

async function HandleUpdateTasks() {
  try {
    const JSON_BUFFER = await HandleReadTaskFile();

    if (commands[2] && !isNaN(commands[2]) && commands[3]) {
        HandleUpdateElementAttribute.call(JSON_BUFFER[0][TASK_LIST], commands[3], "name");
        await HandleWriteFile.call(JSON_BUFFER);

        const elementFindOut = HandleFindElement.call(JSON_BUFFER[0][TASK_LIST]);

        console.log(`The task with id ${commands[2]} was successfully updated`);
        console.log(`The name of task is: ${elementFindOut.name}`);
    } else {
      // possible commons errors
      if (!commands[1]) {
        throw new GenericErrors('[Error]: The "id" of task does not specified;', '[Type of Error]: syntax')
      } else if (!commands[2]) {
        throw new GenericErrors("[Error]: Name of the tasks wasn't specified;", '[Type of Error]: syntax');
      } else if (isNaN(commands[1])) {
        throw new GenericErrors("[Error]: Please, the ID shall be a number;", '[Type of Error]: syntax');
      }
      // catch all adjacent errors
      throw new GenericErrors("[Error]: Please, try again;", '[Type of Error]: unknown');
    }
  } catch (err) {
    console.error(err.message, err.type);
    process.exit(1);
  }
}
async function HandleAddTasks() {
  try {
    const JSON_BUFFER = await HandleReadTaskFile();

    if (commands[2]) {
      JSON_BUFFER[0][TASK_LIST].push({
        name: String(commands[2]),
        id: HandleGenerateTasksId(JSON_BUFFER[0][TASK_LIST]),
        description: "",
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
        "task successfully added with ID:",
        (HandleGenerateTasksId(JSON_BUFFER[0][TASK_LIST])) - 1
      );
    } else {
      if (!commands[2]) {
        throw new GenericErrors(
          `[Error]: Name of the task is empty! Please, add some name to it.`, '[Type of Error]: Syntax'
        );
      }
    }
  } catch (err) {
    console.error(err.message, err.type);
    process.exit(1);
  }
};
async function HandleDeleteTask() {
  try {
    const JSON_BUFFER = await HandleReadTaskFile();

    if (commands[2]) {
      const tasksFiltred = JSON_BUFFER[0][TASK_LIST].filter((item) => {
        return item.id !== Number(commands[2]);
      });

      if (tasksFiltred.length === JSON_BUFFER[0][TASK_LIST].length) {
        console.log("the task do not exist");
      } else {
        console.warn(`task with id: ${commands[2]} successfully deleted`);
        console.warn(`The task was of: ${commands[0]}`);  
      }

      JSON_BUFFER[0][TASK_LIST] = tasksFiltred;
      await HandleWriteFile.call(JSON_BUFFER);
      
    } else {
      throw new GenericErrors("[Errror]: You didn't pass the ID of the task", '[Type of Error]: Syntax');
    }
  } catch (deleteTaskErr) {
    console.error(deleteTaskErr.message, deleteTaskErr.type);
    process.exit(1);
  }
};
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
        throw new GenericErrors(
          `Unknow "${commands[2]}". Please, use: 'done', 'in-progress' or 'todo'`, '[Type of Error]: Syntax'
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
      await HandleUpdateElementAttribute.call(JSON_BUFFER[0][TASK_LIST], sts, "status");
      const elementFindOut = HandleFindElement.call(JSON_BUFFER[0][TASK_LIST]);

      console.log(`The task of '${commands[0]}' with the ID ${commands[2]} successfully updated'`);
      console.log(`Name of task updated: ${elementFindOut.name}`);
      // update de json file
      await HandleWriteFile.call(JSON_BUFFER);
    } else {
      throw new GenericErrors(
        `Empty 'id'. Please, specific the task 'id'`, '[Type of Error]: Syntax'
      );
    }
  } catch (err) {
    console.error(err.message, err.type);
    process.exit(1);
  }
}
async function HandleSetTaskDescription() {
  try {
    const JSON_BUFFER = await HandleReadTaskFile();

    if (commands[2] && commands[3]) {

      HandleUpdateElementAttribute.call(JSON_BUFFER[0][TASK_LIST], commands[3], "description");
      const findOutElement = HandleFindElement.call(JSON_BUFFER[0][TASK_LIST]);
 
      console.log(`task with ID: ${commands[2]} successfully updated!`);
      console.log(`The name of task is: ${findOutElement.name}`);

      HandleWriteFile.call(JSON_BUFFER);
    } else {
      if (!commands[2]) {
        throw new GenericErrors(`Empty description`, '[Type of Error]: Syntax');
      } else if (!commands[1]) {
        throw new GenericErrors(`You forgot the id of the task`, '[Type of Error]: Syntax');
      } else {
        throw new GenericErrors(
          `Please, check if you wrote correctly and try again.`, '[Type of Error]: Unknown'
        );
      }
    }
  } catch (err) {
    console.error(err.message, err.type);
    process.exit(1);
  }
};
async function HandleDeleteAllTasks() {
  try {
    const JSON_BUFFER = await HandleReadTaskFile();

    JSON_BUFFER[0][HandleGetCategory()] = [];

    HandleWriteFile.call(JSON_BUFFER);
    console.log(`All tasks of ${TASK_LIST} successfully deleted`);
  } catch(err) {
    console.error('occur a error:', err);
    process.exit(1);
  }
};
async function HandleMarkAllTasks(sts) {
  try {
    const JSON_BUFFER = await HandleReadTaskFile();

    for(element of JSON_BUFFER[0][TASK_LIST]) {
      element.status = sts;
    };

    HandleWriteFile.call(JSON_BUFFER);
    console.log(`all tasks of ${HandleGetCategory()} marked as ${sts} successfully`);
  } catch(err) {
    console.error('occur a error:', err);
    process.exit(1);
  }
}
async function HandleSetTypeOfTask() {
  try {
    const JSON_BUFFER = await HandleReadTaskFile();

    if(commands[2] && commands[3]) {
      HandleUpdateElementAttribute.call(JSON_BUFFER[0][TASK_LIST], commands[3], "type");
      HandleWriteFile.call(JSON_BUFFER);

      const elementFindOut = HandleFindElement.call(JSON_BUFFER[0][TASK_LIST]);
      console.log(`The task with ID ${commands[2]} was successfully updated`);
      console.log(`THe name of task is: ${elementFindOut.name}`);
    } else {
      if(!commands[2] || isNaN(commands[2])) {
        throw new GenericErrors('You have forgotten of pass the id of the task!', '[Type of Error]: Syntax')
      } else if(!commands[3]) {
        throw new GenericErrors('You have forgotten of pass the name of the type!', '[Type of Error]: Syntax')
      } else {
        throw new GenericErrors('thing it is wrong', '[Type of Error]: Unknown');
      }
    }
  } catch(err) {
    console.error(err.message, err.type);
    process.exit(1);
  }
}
async function HandleSetDateConclusion() {
  try {
    const JSON_BUFFER = await HandleReadTaskFile();

    if(commands[2] && commands[3]) {
      HandleUpdateElementAttribute.call(JSON_BUFFER[0][TASK_LIST], commands[3], "finishAt");
      HandleWriteFile.call(JSON_BUFFER);

      const elementFindOut = HandleFindElement.call(JSON_BUFFER[0][TASK_LIST]);

      console.log(`the task wit id ${commands[2]} was successfully updated`);
      console.log(`the task name is: ${elementFindOut.name}`);
    } else {
      if(!commands[2] || isNaN(commands[2])) {
        throw new GenericErrors('You have forgotten of pass the ID of the task' ,'[Type of Error]: Syntax');
      } else if(!commands[3]) {
        throw new GenericErrors('You have forgotten of pass the data of conclusion to task' ,'[Type of Error]: Syntax');        
      } else {
        throw new GenericErrors('Ops...Any it is wrong', '[Type of Error]: Syntax')
      }
    }
  } catch(err) {
    console.error(err.message, err.type);
    process.exit(1);
  }
}
// utlity function
function HandleGenerateTasksId(dataArray) {
  let maxId = dataArray.reduce((max, item) => Math.max(max, item.id || 0), 0);
  return maxId + 1;
};
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
    console.error("Error reading file:", err);
    process.exit(1);
  }
};
function HandleGetDate() {
  const dateObject = new Date();

  const currentData = dateObject.getDate();
  const currentMonth = dateObject.getMonth() + 1;
  const currentYear = dateObject.getFullYear();

  return `${currentData}/${currentMonth}/${currentYear}`;
};
function HandleGetCategory() {
  return commands[0];
};
function HandleUpdateElementAttribute(attr, property) {
  for(element of this) {
    if(element.id === Number(commands[2])) {

      const { lastCompleteDate } = element

      element[property] = attr;
      element.updateAt = HandleGetDate();

      if(attr === 'done' && HandleStreakOfTasks(lastCompleteDate)) {
        element.streak += 1 
        element.lastCompleteDate = HandleGetDate();
      };
      break;
    };
  };
};
async function HandleWriteFile() {
  await fs.writeFile('tasks.json', JSON.stringify(this, null, 2));
};
function HandleFindElement() {
  const element = this.find((item) => {
    return item.id === Number(commands[2])
  });

  return element;
};
function HandleStreakOfTasks(lastDate) {
 return lastDate !== HandleGetDate() ? true:false;
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
      case "delete-all":
        HandleDeleteAllTasks();
        break;
      case "mark-all-done":
        HandleMarkAllTasks('done');
        break;
      case "mark-all-todo":
        HandleMarkAllTasks('todo');
        break;
      case "mark-all-in-progress":
        HandleMarkAllTasks('in-progress');
        break;
      case "type":
        HandleSetTypeOfTask();
        break;
      case "date-conclusion":
        HandleSetDateConclusion();
        break;
      default:
        console.log("Invalid command. Use one of the following: add, update,");
        console.log("mark-done, mark-in-progress, mark-todo, delete-task,");
        console.log("list, description, mark-all-done, mark-all-in-progress")
        console.log("mark-all-todo, delete-all, type, data-conclusion")
    }
} else {
    console.error('please, specific list with the first command: "daily", "study", "entertainment", "revision"')
}
