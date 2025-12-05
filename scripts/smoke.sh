#!/usr/bin/env bash
set -euo pipefail
API_BASE=${API_BASE:-http://localhost:8080}

login() {
  local user=$1
  local pass=$2
  local resp
  resp=$(curl -s -X POST "$API_BASE/api/auth/login" \
    -H 'Content-Type: application/json' \
    -d "{\"login_or_email\":\"$user\",\"password\":\"$pass\"}")
  echo "$resp"
}

extract_token() {
  python - <<'PY'
import json,sys
try:
    data=json.load(sys.stdin)
    print(data.get('token',''))
except Exception:
    print('')
PY
}

demo_resp=$(login "demo" "demo12345")
demo_token=$(echo "$demo_resp" | extract_token)
if [ -z "$demo_token" ]; then
  echo "Не удалось получить токен демо"
  echo "$demo_resp"
  exit 1
fi

echo "Демо токен получен: ${demo_token:0:12}..."

echo "Профиль демо:" 
curl -s -H "Authorization: Bearer $demo_token" "$API_BASE/api/auth/me"

unver_resp=$(login "unverified" "demo12345")
unver_token=$(echo "$unver_resp" | extract_token)
if [ -z "$unver_token" ]; then
  echo "Не удалось получить токен не подтвержденного"
  echo "$unver_resp"
  exit 1
fi

echo "Пробуем доступ к защищенному /api/app/ping для неподтвержденного (ожидаем 403)"
curl -s -o /dev/null -w "HTTP_CODE:%{http_code}\n" -H "Authorization: Bearer $unver_token" "$API_BASE/api/app/ping"
