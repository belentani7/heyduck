#!/bin/bash
# Anti-fall protocol checker

urls=(
  "https://duck-music-lab-belentani.vercel.app"
  "https://duck-music-lab-belentani.netlify.app"
  "https://belentani7.github.io/duck-music-lab"
)

echo "🛡️ Anti-Fall Protocol Status"
echo "==========================="

alive=()
down=()

for url in "${urls[@]}"; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")

  if [ "$status" = "200" ] || [ "$status" = "301" ]; then
    echo "✅ $url"
    alive+=("$url")
  else
    echo "❌ $url (HTTP $status)"
    down+=("$url")
  fi
done

echo ""
if [ ${#alive[@]} -gt 0 ]; then
  echo "✅ Live servers: ${#alive[@]}"
  echo "Use any of these:"
  for url in "${alive[@]}"; do
    echo "  → $url"
  done
fi

if [ ${#down[@]} -gt 0 ]; then
  echo ""
  echo "⚠️ Down servers: ${#down[@]}"
  for url in "${down[@]}"; do
    echo "  → $url"
  done
fi
