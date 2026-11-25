# repo-forge:tareas
# Comandos del proyecto. `make check` ejecuta exactamente lo que corre la CI.
.PHONY: help doctor test test-node test-python gates measure check budget

help:
	@echo "heyduck · comandos disponibles"
	@echo "  make doctor       estado del repositorio (solo lectura)"
	@echo "  make test         toda la suite (Node + Python)"
	@echo "  make test-node    contratos de datos y núcleo de audio (node --test)"
	@echo "  make test-python  contratos del sitio (unittest)"
	@echo "  make gates        enlaces, HTML, configuración, SEO y presupuesto"
	@echo "  make measure      recalcula data/catalogo.json"
	@echo "  make check        gates + suite + doctor (lo mismo que la CI)"

doctor:
	python3 scripts/doctor.py

test: test-node test-python

test-node:
	node --check data.js
	node --test tests/*.test.cjs

test-python:
	python3 -m unittest discover -s tests -t . -v

gates:
	node .github/scripts/check-links.mjs
	node scripts/audit-html.mjs --strict
	node scripts/audit-config.mjs
	node scripts/verify-discovery.mjs
	node scripts/measure.mjs --check
	node scripts/deploy-manifest.mjs --check
	node scripts/report-budget.mjs

measure:
	node scripts/measure.mjs

check: gates test doctor

budget:
	node scripts/report-budget.mjs
