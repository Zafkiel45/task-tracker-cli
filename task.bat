@echo off

REM Check if the first argument matches any of the valid categories
if "%1" == "daily" (
    goto checkCommand
) else if "%1" == "study" (
    goto checkCommand
) else if "%1" == "entreteniment" (
    goto checkCommand
) else if "%1" == "revision" (
    goto checkCommand
) else if "%1" == "habitDaily" (
    goto checkCommand
) else if "%1" == "habitWeekly" (
    goto checkCommand
) else (
    echo Invalid category. Please use: daily, study, entreteniment, or revision
    echo habitDaily, habitWeekly.
    exit /b
)

:checkCommand
REM Check if the second argument matches any of the valid commands
if "%2" == "add" goto execute
if "%2" == "update" goto execute
if "%2" == "mark-done" goto execute
if "%2" == "mark-in-progress" goto execute
if "%2" == "mark-todo" goto execute
if "%2" == "delete-task" goto execute
if "%2" == "list" goto execute
if "%2" == "delete-all" goto execute
if "%2" == "mark-all-done" goto execute
if "%2" == "mark-all-todo" goto execute
if "%2" == "mark-all-in-progress" goto execute
if "%2" == "type" goto execute
if "%2" == "date-conclusion" goto execute
if "%2" == "date-conclusion-all" goto execute

REM If no valid command was found, display an error message and exit
echo Invalid command. Use one of the following: add, update, mark-done, mark-in-progress, mark-todo, delete-task, list, delete-all, mark-all-done, mark-all-todo, mark-all-in-progress, type, data-conclusion.
exit /b

:execute
REM Execute the Node.js script with all the original arguments
node program.cjs %*
