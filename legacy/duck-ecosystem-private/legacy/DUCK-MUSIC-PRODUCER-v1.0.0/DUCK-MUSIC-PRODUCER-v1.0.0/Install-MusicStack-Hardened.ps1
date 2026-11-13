[CmdletBinding(SupportsShouldProcess=$true)]
param(
  [ValidateSet('All','Engine','Duck','Runtime')]
  [string]$Component = 'All',
  [switch]$Install,
  [switch]$Start,
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

function Write-Step([string]$Message) { Write-Host "[DUCK] $Message" -ForegroundColor Cyan }
function Require-Command([string]$Name) {
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) { throw "Falta el comando requerido: $Name" }
}
function Invoke-Checked([string]$File, [string[]]$Arguments) {
  Write-Step "$File $($Arguments -join ' ')"
  if ($DryRun) { return }
  & $File @Arguments
  if ($LASTEXITCODE -ne 0) { throw "El comando falló ($LASTEXITCODE): $File" }
}

Write-Step "DUCK MUSIC STACK Hardened — componente: $Component"
Write-Step "Modo instalación: $(if ($Install) { 'Install' } else { 'preparación guiada' })"

Require-Command 'node'
Require-Command 'corepack'

if (-not (Test-Path (Join-Path $Root 'package.json'))) { throw 'No se encontró package.json. Ejecuta el instalador desde la raíz del paquete.' }
if (-not (Test-Path (Join-Path $Root 'pnpm-lock.yaml'))) { throw 'No se encontró pnpm-lock.yaml; el paquete no es reproducible.' }

if (-not $Install) {
  Write-Step 'No se aplicarán cambios. Usa -Install para instalar.'
  Write-Host 'Ejemplo: .\Install-MusicStack-Hardened.ps1 -Component All -Install -Start'
  exit 0
}

Invoke-Checked 'corepack' @('pnpm','--version')
Invoke-Checked 'corepack' @('pnpm','install','--frozen-lockfile')
Invoke-Checked 'corepack' @('pnpm','exec','playwright','install','chromium')
Invoke-Checked 'corepack' @('pnpm','check')
Invoke-Checked 'corepack' @('pnpm','duck:build')

if ($Start) {
  Write-Step 'Arrancando API standalone. Usa Ctrl+C para detenerla.'
  Invoke-Checked 'corepack' @('pnpm','duck:start')
} else {
  Write-Step 'Instalación completada. Para iniciar DUCK: corepack pnpm duck:start'
  Write-Step 'Para ejecutar el worker DUCK: corepack pnpm duck:worker'
}
