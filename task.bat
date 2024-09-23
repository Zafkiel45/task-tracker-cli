@echo off
REM Check if the list exist
node util/checkKeys.cjs %1

if errorlevel 1 (
    echo Invalid list. Please use a valid list from tasks.json.
    exit /b
) else (
    goto checkCommands
)

:checkCommands
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
if "%2" == "add-field" goto execute
if "%2" == "delete-field" goto execute
if "%2" == "type-all" goto execute
if "%2" == "all" goto execute
if "%2" == "run" goto execute
if "%2" == "show" goto execute

REM If no valid command was found, display an error message and exit
echo Invalid command.
exit /b

:execute
REM Execute the Node.js script with all the original arguments
node program.cjs %*
