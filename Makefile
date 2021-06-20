
#CMD
COMPOSE = docker-compose
EXEC = $(COMPOSE) exec api

.DEFAULT_GOAL: help
.PHONY: help
help: ## Affiche cette aide
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-10s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

## -- Docker 🐳 -------------

.PHONY: up
up: ## Démarre les conteneurs 
	@$(COMPOSE) up -d

.PHONY: down
down: ## Stoppe les conteneurs 
	@$(COMPOSE) down --remove-orphans

.PHONY: clean
clean: ## Supprimer les volumes en local
	@docker system prune --volumes --force

## -- Composer 🧙‍♂️ -----------

.PHONY: install
install: ## Installe les dépendances
	$(EXEC) npm install

## -- BDD -----------

.PHONY: migration
migration: ## Importe le fichier SQL dans la BDD (créer la BDD si elle n'exixte pas)
	$(COMPOSE) up mongo_seed