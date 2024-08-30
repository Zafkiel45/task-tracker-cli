# About
Back-end project of [roadmap.sh](https://roadmap.sh/projects/task-tracker) made with Node.js. 

# How to use?

Clone the project with `git clone https://github.com/Zafkiel45/summer-2024.git` or download the files and run in your editor or terminal.

The name of the application is `program.cjs` and for to run it, write in your terminal (in the same directory that the file) `node program.cjs [your instructions]`. This will generate 
a `json` file in the same directory empty. This `json` file will store your tasks.

# features: 

It's possible: `add`, `delete`, `update` and more with this application. Below, some example of use: 

## add tasks:

```cmd
node program.cjs add name-of-task 
```
real example:

```cmd
node program.cjs add drink-water
```
Also, works with quotes:
```cmd
node program.cjs add 'Drink water'
```
if an error occurs, the specific error will be shown and how to resolve it

## Update the name of task:

Each task has your specific ID. This ID is useful to update specific tasks. To see the ID of your tasks, execute in your terminal: `node program.cjs list`.
```cmd
node program.cjs update 1 'my-new-name'
```
This will update the task with the `id` = `1`.

## delete tasks:

Seems with the `update`, but only with the specific `id` of tasks that you want to delete:

```cmd
node program.cjs delete 5
```
This will delete the task with the `id = 5`

## List the tasks:

To show all tasks in the `json` file, execute in your terminal: 
```cmd
node program.cjs list
```
This will show all tasks in the `json` file in a table with `console.table`. To see tasks with specific `status`, as `todo`, `done` or `in-progress`, write the following
command: 
```cmd
node program.cjs list done
```
Above, show all tasks with the `status=done`.
```cmd
node program.cjs list in-progress
```
Above, show all tasks with the `status=in-progress`.
```cmd
node program.cjs list todo
```
Above, show all tasks with the `status=todo`.

## Change the status:

The status of tasks show your current state, and to set a new `status` to them, use: 
```cmd
node program.cjs mark-done 1
```
This will change the task `status` with `id=1` to `done`.
```cmd
node program.cjs mark-in-progress 10
```
This will change the task `status` with `id=10` to `in-progress`.
```cmd
node program.cjs mark-todo 6
```
This will change the task `status` with `id=6` to `todo`.

## Add description:

Task can have a `description`. The following command add or change the `description`:
```cmd
node program.cjs description 4 'this is my beautiful description'
```
This will change or add the task `description` with `id=4` to `'this is my beautiful description'`.
