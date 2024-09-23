# About
Back-end project of [roadmap.sh](https://roadmap.sh/projects/task-tracker) made with Node.js. 

# How to use?

Clone o projeto com o seguinte comando: `git clone https://github.com/Zafkiel45/summer-2024.git` ou baixe os arquivos e execute ele em seu terminal.

Para executar o **script**, digite em seu terminal`node program.cjs [comandos]`. Caso queira algo mais "light" menos argumentativo, você pode adicionar em suas variáveis de ambiente no seu sistema operacional o arquivo `.bath` para uma maior facilidade. 

O arquivo `.bath` é completamente opcional, e apenas uma feature extra. Todo o **script** dele esta na raiz do repositório e pode ser analisado por qualquer um. Além disso, nada impede de você altera-lo e simplesmente criar o seu próprio da forma que quiser. 

As tarefas são organizadas em listas, sendo 4 delas padrões (já vem por padrão, mas você pode deleta-las). 

```json
[
  {
    daily: [
      {
        "name": "",
        "id": 4,
        "status": "todo",
        "createdAt": "[MM][DD][YYYY]",
        "updateAt": "[MM][DD][YYYY]",
        "type": "",
        "finishAt": "",
        "streak": 0
      }
    ],
    study: [],
    entreteiment: [],
    revision: [],
  }
]
```
Por padrão, ao executar o **script**, criará um arquivo `.json` no mesmo local que o `program.cjs` e também uma pasta com um arquivo `backup` que falarei mais sobre no final desta documentação. 

A estrutura para adicionar e realizar outras operações, em geral, é esta, mas com algumas nuances entre os comandos. Explicarei cada comando em detalhes logo abaixo.

```bash
task daily add "my daily task"
```

# features: 

Como qualquer projeto do mesmo ramo, você pode **adicionar**, **deletar**, **atualizar** e tudo mais. Alguns comandos ainda estão sendo aperfeiçoados.  O projeto tenta cobrir todas as eventuais necessidades de ações. Se você apenas quiser fazer coisas simples, como adicionar e apagar tarefas, é possível. Se quiser editar, atualizar, determinar uma data de conclusão e outras coisas, também é possível.

Vale salientar que os comandos apenas afetam a lista específicada, então não precisa se preocupar sobre as outras tarefas. Se algum comando alterar além de seus limites, será explicitamente avisado.

## add comando:

```cmd
node program.cjs daily add name-of-task 
```
exemplo com dados reais:

```cmd
node program.cjs study add drink-water
```
As aspas são opcionais, mas é a única forma de nomear tarefas com espaço sem resultar em comportamentos inesperados:

```cmd
node program.cjs daily add 'Drink water'
```
Se algum erro ocorrer, o programa alertará no console. A estrutura desse comando é simples, você precisa específicar qual é a lista de tarefa, neste caso `study`. Logo em seguida determinar qual comando, neste caso `add` e o nome da tarefa, neste caso `Drink Water`.

## Update comando:

Isto atualizará o nome de uma task na lista que você determinar. 

```cmd
node program.cjs entretenment update 1 'my-new-name'
```
Se algum erro ocorrer, o programa alertará no console. A estrutura desse comando é simples, você precisa específicar qual é a lista de tarefa, neste caso `entretenment`. Logo em seguida determinar qual comando, neste caso `update` , o ID da tarefa que neste caso é `1`, o novo nome da tarefa `my-new-name`.

## delete-task comando

estrutura semelhante com a do `update`, mas com uma pequena diferença e papel. O delete delete uma tarefa específica determina pelo o `ID`. O `ID`da tarefa nunca é o mesmo, então não precisa se preocupar em conflitos. No momento não existe uma "lixeira", mas estou analisando a possibilidade.

```cmd
node program.cjs revision delete-task 5
```
Se algum erro ocorrer, o programa alertará no console. Você precisa específicar qual é a lista de tarefa, neste caso `revision`. Logo em seguida determinar qual comando, neste caso `delete-task` , o ID da tarefa que neste caso é `5`. 

## List comando:

Para listar todas as tarefas de uma lista específica, digite `list`, isto mostrará uma tabela com todas as informações atuais da tarefas. Além disso, esta é a única forma de visualiza-las para se orientar, como por exemplo, para se lembrar do `ID` específico da tarefa, é necessário lista-las antes.

```cmd
node program.cjs daily list
```
Se algum erro ocorrer, o programa alertará no console. Você precisa específicar qual é a lista de tarefa, neste caso `daily`. Logo em seguida determinar qual comando, neste caso `list`.

Para listar tarefas com um `status` específico, como `todo`, `done` e `in-progress`, basta adiciona-las logo em seguinta, como nos exemplos abaixo.

Exemplos: 
```cmd
node program.cjs study list done
```
Acima listará todas as tarefas com o status `done`.

```cmd
node program.cjs study list in-progress
```
Acima listará todas as tarefas com o status `in-progress`.

```cmd
node program.cjs study list todo
```
Acima listará todas as tarefas com o status `todo`.

## mark-status:

Usado para atualizar o `status` específico da tarefa. A estrutura é bem simples, `mark-` seguido com o `status` e o `ID` da tarefa, como mostrado abaixo.

```cmd
node program.cjs entreteinment mark-done 1
```
Isto mudará o status atual para `done` da tarefa com `ID=1` em `entreteinment`.
```cmd
node program.cjs entertaimnent mark-in-progress 10
```
Isto mudará o status atual para `in-progress` da tarefa com `ID=10` em `entreteinment`.
```cmd
node program.cjs entertaimnent mark-todo 6
```
Isto mudará o status atual para `todo` da tarefa com `ID=6` em `entreteinment`.

## delete-all comando:

Isto excluíra todas as tarefas de uma determina lista. NÃO APAGARÁ NADA ALÉM DAS TAREFAS DA LISTA ESPECÍFICADO.

```bash
node program.cjs study delete-all 
```
Isto apagará todas as tarefas de `study`.

## mark-all-status comando:

Marca todas as tarefas de uma lista como: `done`, `todo` ou `in-progress` 

```bash
node program.cjs entertainment mark-all-done 
```
Marcará todas as tarefas como `done` em `entertainment`.

```bash
node program.cjs entertainment mark-all-todo 
```
Marcará todas as tarefas como `todo` em `entertainment`.
```bash
node program.cjs entertainment mark-all-in-progress
```
Marcará todas as tarefas como `in-progress` em `entertainment`.

## type comando:

Muda o tipo de uma tarefa específica para a `string` passada. Muito útil para organizar tarefas e classifca-las. No exemplo abaixo, eu classifquei uma tarefa como `node`. 

```bash
node program.cjs study type 5 "node"
```
Mudará a tarefa de `study` com o `id=5` para `node`.

## data-conclusion comando:

Isto adicionará ou mudará a data de conclusão de uma tarefa, meramente ilustrativa no momento, apenas para o usuário ter uma noção sobre quando realiza-la. Não irá mostrar nenhuma notificação no momento e nem nada do tipo (até agora).

A data é formatada para o modelo americano, então tem que ter a seguinte formatação: [MM][DD][YYYY]

```bash
node program.cjs study data-conclusion 2 "02/12/2024"
```
Altera a data de conlusão da tarefa de `study` com o `id=2` para `02/12/2024`- dia 12 de fevereiro de 2024

# configuration-task-field: 

Este comando é um comando especial pois tem uma estrutura um tanto diferente dos outros comandos. Este comando tem como principal utilidade alterar a estrutura de suas tarefas, adicionando mais listas ou removendo. Considere os seguintes exemplos: 

```cmd
task configurate-task-field add-field
```
Ao apertar `enter` em seu teclado, você precisará passa o nome da nova lista formatado em `camelCase` para criar uma nova lista. 

```cmd
node program.cjs configurate-task-field delete-field
```
Ao apertar `enter` em seu teclado, você precisará passa o nome da nova lista formatado em `camelCase` para deletar um campo. 

OBS: Não é possível deletar todos os campos, ao menos 1 restará e se você tentar apagar o último item, lançará um erro. Isto é intencional para preservar a estutura do arquivo `.json`.

# date-conclusion-all 

Faz o mesmo que o `date-conclusion`, mas para todas as tarefas de uma lista. 

```cmd 
node program.cjs study date-conclusion-all "05/02/2024"
```
Este também segue o padrão americano, sendo [MM][DD][YYYY]

# type-all 

Faz o mesmo que o `type`, mas para todas as tarefas de uma lista. 

```cmd 
node program.cjs study type-all 'node'
```
# help 

Listará todos os comandos existentes no programa atualmente, com breve descrições. No momento somente esta documentação é uma forma completa de se orientar caso necessário. 

```cmd 
node program.cjs help all
```
# bath file:

Com o `.bath` file, você consegue encurtar a forma que o **script** é chamado, assim aprimorando a experiência. Se você optar por adicionr o `task.bat` a suas variavéis de ambiente em seu sistema operacional, ao invés de invoca-lo como: `node program.cjs [comandos]`, será como da forma abaixo. 

```bash
task study add "new task"
```
isto permite que você oculte a parte: `node program.cjs` e se concentre apenas nos comandos. 
