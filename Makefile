.PHONY: production staging development

include ./kube_maker/makefiles/*.mk

# Config
name = api
brand = checkonetwo
prefix = $(brand)-
project = speedtest-186210
forbidden_untracked_extensions = '\.go|\.js'

k8s_deploy: create_namespace docker_image_build registry_push build_manifest kube_deploy get_exposed_ip

production: frontend/build stage_production areyousure k8s_deploy
staging: frontend/build stage_staging k8s_deploy
development: frontend/build stage_development k8s_deploy

submodules:
	git submodule update --init --recursive

frontend/build: frontend/src
	cd frontend && npm run build
