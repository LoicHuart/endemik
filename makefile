include .env
export

NETWORKS="$(shell docker network ls)"
VOLUMES="$(shell docker volume ls)"
SUCCESS=[ done "\xE2\x9C\x94" ]

# default arguments
user ?= root
service ?= api

all: traefik-public database-net
	@echo [ starting client '&' api... ]
	docker-compose up traefik db portainer api db_admin

traefik-public:
ifeq (,$(findstring traefik-public,$(NETWORKS)))
	@echo [ creating traefik network... ]
	docker network create traefik-public 
	@echo $(SUCCESS)
endif

database-net:
ifeq (,$(findstring database-net,$(NETWORKS)))
	@echo [ creating database network... ]
	docker network create database-net
	@echo $(SUCCESS)
endif

down:
	@echo [ teardown all containers... ]
	docker-compose down
	@echo $(SUCCESS)

.PHONY: all
.PHONY: traefik-public
.PHONY: data-base
.PHONY: down
