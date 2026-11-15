$ErrorActionPreference = 'Continue'
$legacy = "C:\Users\USER\workspace\repositorios\heyduck\legacy"
$mcpClientPath = $legacy + "\omega-superpowers-client.js"

$mcpScriptTag = '<script src="' + $mcpClientPath + '"></script>'
$spSection = '<section class="superpowers-mcp" style="margin:2rem 0;padding:1.5rem;border:1px solid #FF2B2B;border-radius:12px;background:#FF2B2B08;"><h2 style="margin:0 0 1rem 0;font-family:sans-serif;color:#FF2B2B;">Superpowers MCP - belentani-hub</h2><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0.8rem;"><div><strong>Google:</strong> Drive, Gmail, Gemini, Cloud, Colab</div><div><strong>GitHub:</strong> Codespaces, Repos, Issues, PRs</div><div><strong>IA:</strong> OpenAI ChatGPT, Gemini, Suno</div><div><strong>Social:</strong> LinkedIn, DistroKid</div></div><p style="margin-top:0.8rem;font-size:0.85rem;color:#666;">MCP Hub: belentani-hub | 24 herramientas | 4 grupos</p></section>'

$metaTag = '<meta name="superpowers" content="mcp-hub=belentani-hub,tools=24,groups=4"><meta name="omega-max" content="senior-agent-enabled">'

$files = Get-ChildItem -Path $legacy -Recurse -Include "*.html","*.htm" -ErrorAction SilentlyContinue | Select-Object Name, FullName, Length -Unique | Sort-Object Length -Descending | Select-Object -First 50

$processed = 0
$skipped = 0
$errors = 0

Write-Host "========================================"
Write-Host "  INYECTANDO SUPERPOWERS EN 50 HTML"
Write-Host "========================================"
Write-Host ""

foreach ($file in $files) {
  $path = $file.FullName
  $name = $file.Name
  $sizeKB = [math]::Round($file.Length / 1KB, 2)
  
  try {
    $content = Get-Content $path -Raw -ErrorAction Stop
    
    if ($content -match "omega-superpowers-client" -or $content -match "superpowers-mcp") {
      $skipped++
      Write-Host ("SKIP (ya tiene): " + $name + " (" + $sizeKB + " KB)")
      continue
    }
    
    # Insertar meta tag después de <head>
    $headMatch = [regex]::Match($content, '<head[^>]*>')
    if ($headMatch.Success) {
      $insertPos = $headMatch.Index + $headMatch.Length
      $content = $content.Insert($insertPos, "`n  " + $metaTag)
    }
    
    # Insertar sección y script antes de </body> o al final
    $bodyClose = $content.LastIndexOf('</body>')
    if ($bodyClose -ge 0) {
      $content = $content.Insert($bodyClose, "`n  " + $spSection + "`n  " + $mcpScriptTag + "`n  ")
    } else {
      $content = $content + "`n" + $spSection + "`n" + $mcpScriptTag
    }
    
    # Agregar clase al body
    $bodyMatch = [regex]::Match($content, '<body[^>]*>')
    if ($bodyMatch.Success) {
      $currentTag = $bodyMatch.Value
      if (-not $currentTag -match 'class=') {
        $newTag = $currentTag -replace '>$', ' class="superpowers-enabled">'
        $content = $content.Replace($currentTag, $newTag)
      }
    }
    
    Set-Content -Path $path -Value $content -Encoding UTF8
    $processed++
    Write-Host ("OK: " + $name + " (" + $sizeKB + " KB)")
    
  } catch {
    $errors++
    Write-Host ("ERROR: " + $name + " - " + $_.Exception.Message)
  }
}

Write-Host ""
Write-Host "========================================"
Write-Host "  RESUMEN"
Write-Host "========================================"
Write-Host ("Procesados: " + $processed)
Write-Host ("Omitidos: " + $skipped)
Write-Host ("Errores: " + $errors)
Write-Host ""
