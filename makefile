## —— Makefile ——————————————————————————————————

#URL assets :
NAME = wp
THEME = web/app/themes/$(NAME)
ASSETS = $(THEME)/assets

docker: ## lance le docker-compose
	docker compose up -d

server: ### lance le serveur
	wp server --port=8000 --config=development.ini

start: ## lance les deux
	docker compose up -d
	wp server --port=8000 --config=development.ini

scss: # compile scss
	$(eval name ?= all)
	$(eval link ?= .)
	sass --watch $(ASSETS)/scss/$(link)/$(name).scss:$(ASSETS)/css/$(name).css --style compressed

branch: ### créer branch
	$(eval name ?= branch)
	git branch $(name)
	git checkout $(name)
	git add .
	git commit -m "new branch $(name)"
	git push -u origin $(name)

pull: ### pull main
	git checkout main
	git pull

asset:
	cd $(ASSETS)

yarn-dev:
	cd $(THEME) && yarn dev

yarn-build:
	cd $(THEME) && yarn build

install-theme:
	composer require roots/acorn
	cd web/app/themes/ && composer create-project roots/sage $(NAME)
	cd $(THEME) && yarn && composer install && yarn remove @roots/bud-tailwindcss && yarn add @roots/bud-sass --dev && yarn remove @roots/bud && yarn remove @roots/sage && yarn add @roots/bud --dev && yarn add @roots/sage --dev && yarn && composer install && composer update
	#renomage des css
	mv $(THEME)/resources/styles/app.css $(THEME)/resources/styles/app.scss
	mv $(THEME)/resources/styles/editor.css $(THEME)/resources/styles/editor.scss
	#supression de tailwind
	rm $(THEME)/tailwind.config.js
	#effacer le contenu de app.scss
	echo "" > $(THEME)/resources/styles/app.scss
	#update du bud config .js
	sed -i 's/example.test/localhost:8000/' ./$(THEME)/bud.config.js
	sed -i "s/.useTailwindColors()/ /" ./$(THEME)/bud.config.js
	sed -i "s/.useTailwindFontFamily()/ /" ./$(THEME)/bud.config.js
	sed -i "s/.useTailwindFontSize()/ /" ./$(THEME)/bud.config.js
	sed -i "s/themes\/sage/themes\/$(NAME)/" ./$(THEME)/bud.config.js
	
recup-theme:
	composer install && composer update
	cd $(THEME) && composer install && yarn && && yarn add @roots/bud-sass --dev && yarn remove @roots/bud && yarn remove @roots/sage && yarn add @roots/bud --dev && yarn add @roots/sage --dev && yarn && composer install && composer update	
	make start

stop:
	docker compose stop