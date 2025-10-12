## Installation
Make sure to have `pnpm` installed, otherwise run `npm i pnpm -g`.

Setup credentials:
```sh
pnpm config set @ennealand:registry https://npm.pkg.github.com
pnpm config set //npm.pkg.github.com/:_authToken YOUR_AUTH_TOKEN
```

Install dependencies:
```sh
pnpm i
```

Create the environment configuration file and specify the port `sc-machine` is running on:
```
cp .env.example .env
```

## Development
Make sure that path to `kb` folder exists in repo.path that is used to build knowledge base.

Start the dev server:
```sh
pnpm dev
```


## костыли 
для запуска проекта требуется создать файл `crutch.scs` в папке `kb`
```
section_graph_theory_hierarchy <- crutch;;

set_theory_knowledge_base <- crutch;;
	
workspace_menu_actions <- crutch;;
	
doc_graph_theory <- crutch;;
	
scn_code <- crutch;;
	
scg_code <- crutch;;
	
dm_code <- crutch;;
```

папку `kb` требуется скопировать в `ostis-web-platform/knowledge-base`

в файле `src/components/playground/playground.tsx` заменить все `LuLoader2` на `LuLoader`

```
pnpm install axios
```