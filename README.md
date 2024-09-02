# About
Back-end project of [roadmap.sh](https://roadmap.sh/projects/task-tracker) made with Node.js. 

# How to use?

Clone the project with `git clone https://github.com/Zafkiel45/summer-2024.git` or download the files and run in your editor or terminal.

The name of the application is `program.cjs` and for to run it, write in your terminal (in the same directory that the file) `node program.cjs [your instructions]`. This will generate 
a `json` file in the same directory empty. This `json` file will store your tasks.

The organization of tasks is as: 

```json
[
  {
    daily: [
      {
        "name": "",
        "id": 4,
        "description": "",
        "status": "todo",
        "createdAt": "2/9/2024",
        "updateAt": "2/9/2024",
        "type": "",
        "finishAt": ""
      }
    ],
    study: [],
    entreteiment: [],
    revision: [],
  }
]
```
Each array with your specific use. The `daily` for tasks daily, the `study` for tasks of study, and so on. Before of write the command, as `add`, it's mandatory specific Which type of your task. For example:

```bash
task daily add "my daily task"
```

# features: 

It's possible: `add`, `delete-task`, `update` and more with this application. Below, some example of use: 

## add tasks:

```cmd
node program.cjs daily add name-of-task 
```
real example:

```cmd
node program.cjs study add drink-water
```
Also, works with quotes:
```cmd
node program.cjs daily add 'Drink water'
```
if an error occurs, the specific error will be shown and how to resolve it

## Update the name of task:

Each task has your specific ID. This ID is useful to update specific tasks. To see the ID of your tasks, execute in your terminal: `node program.cjs list`.
```cmd
node program.cjs entretaimnt update 1 'my-new-name'
```
This will update the task with the `id` = `1`.

## delete tasks:

Seems with the `update`, but only with the specific `id` of tasks that you want to delete:

```cmd
node program.cjs revision delete-task 5
```
This will delete the task with the `id = 5` in `revision`

## List the tasks:

To show all tasks in the `json` file, execute in your terminal: 
```cmd
node program.cjs daily list
```
This will show all tasks of `daily` in the `json` file in a table with `console.table`. To see tasks with specific `status`, as `todo`, `done` or `in-progress`, write the following
command: 
```cmd
node program.cjs study list done
```
Above, show all tasks with the `status=done`.
```cmd
node program.cjs study list in-progress
```
Above, show all tasks with the `status=in-progress`.
```cmd
node program.cjs study list todo
```
Above, show all tasks with the `status=todo`.

## Change the status:

The status of tasks show your current state, and to set a new `status` to them, use: 
```cmd
node program.cjs entertaimnent mark-done 1
```
This will change the task `status` with `id=1` to `done`.
```cmd
node program.cjs entertaimnent mark-in-progress 10
```
This will change the task `status` with `id=10` to `in-progress` in `entertaimnent`.
```cmd
node program.cjs entertaimnent mark-todo 6
```
This will change the task `status` with `id=6` to `todo`.

## Add description:

Task can have a `description`. The following command add or change the `description`:
```cmd
node program.cjs entertaimnent description 4 'this is my beautiful description'
```
This will change or add the task `description` with `id=4` to `'this is my beautiful description'`.

## deleting all tasks:

It's possible delete all tasks of specific group, as `study`:

```bash
node program.cjs study delete-all 
```
This will delete all tasks in `studyP`.

## Mark all tasks:

Mark all tasks with `done`, `todo` or `in-progress` of specific group:

```bash
node program.cjs entertainment mark-all-done 
```
All tasks are marked as `done` in `entertainment`. Others examples: 

```bash
node program.cjs entertainment mark-all-todo 
```
```bash
node program.cjs entertainment mark-all-in-progress
```

## Type:

The type field shows the type of `task`. For example, my task in `study` can be `node`, for indicating that the study is about `node`. 
```bash
node program.cjs study type 5 "node"
```
This will change the `type` field to `node` of the task with the `id=5` in `study.

## Data-conclusion:

This adds a date to finish the task, but BE CAREFUL! Now, don't exist a normalization about this... For example, the field ca be filled with any string. The recommendation passes a format seems with the data of your country. 
```bash
node program.cjs study data-conclusion 2 "02/12/2024"
```
This will change the field `finishAt` to `"02/12/2024"` of task with the id `2` in `study`.

# change the call of script:

Before, the program only can was called as `node program.cjs`, now, optionally you can add the `bat` file of this repository (the file is in the root) in your environment variables of your operational system.

If you opt by this, the program will called with the follow sintax: 
```bash
task study add "new task"
```
The `task` substitutes the `node program. cjs`. All script is in the `bat` file in the root of this repository for you to analyze :)
