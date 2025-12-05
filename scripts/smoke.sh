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

echo "Получаем список фильмов"
curl -s -H "Authorization: Bearer $demo_token" "$API_BASE/api/films?per_page=5"

echo "Ставим рейтинг 8 фильму 1"
curl -s -X PUT -H "Authorization: Bearer $demo_token" -H 'Content-Type: application/json' \
  -d '{"value":8}' "$API_BASE/api/films/1/rating"

echo "Добавляем в избранное фильм 1"
curl -s -X POST -H "Authorization: Bearer $demo_token" "$API_BASE/api/films/1/favorite"

echo "Получаем избранное"
curl -s -H "Authorization: Bearer $demo_token" "$API_BASE/api/films?scope=favorites&per_page=3"

echo "Добавляем в \"посмотреть позже\" фильм 1"
curl -s -X POST -H "Authorization: Bearer $demo_token" "$API_BASE/api/films/1/watch-later"

echo "Получаем посмотреть позже"
curl -s -H "Authorization: Bearer $demo_token" "$API_BASE/api/films?scope=watch_later&per_page=3"

echo "Мои оценки"
curl -s -H "Authorization: Bearer $demo_token" "$API_BASE/api/films?scope=my_ratings&per_page=3"

echo "Рекомендации"
curl -s -H "Authorization: Bearer $demo_token" "$API_BASE/api/recommendations"

echo "Пользователи"
curl -s -H "Authorization: Bearer $demo_token" "$API_BASE/api/users?per_page=3"

echo "Профиль пользователя 2"
curl -s -H "Authorization: Bearer $demo_token" "$API_BASE/api/users/2?per_page=3"

echo "Детальная карточка фильма 1"
curl -s -H "Authorization: Bearer $demo_token" "$API_BASE/api/films/1"

echo "Сохраняем заметку к фильму 1"
curl -s -X PUT -H "Authorization: Bearer $demo_token" -H 'Content-Type: application/json' \
  -d '{"text":"Заметка smoke"}' "$API_BASE/api/films/1/note"

echo "Достаём заметку"
curl -s -H "Authorization: Bearer $demo_token" "$API_BASE/api/films/1/note"

echo "Отмечаем просмотренным"
curl -s -X POST -H "Authorization: Bearer $demo_token" "$API_BASE/api/films/1/watched"

unver_resp=$(login "unverified" "demo12345")
unver_token=$(echo "$unver_resp" | extract_token)
if [ -z "$unver_token" ]; then
  echo "Не удалось получить токен не подтвержденного"
  echo "$unver_resp"
  exit 1
fi

echo "Пробуем доступ к защищенному /api/app/ping для неподтвержденного (ожидаем 403)"
curl -s -o /dev/null -w "HTTP_CODE:%{http_code}\n" -H "Authorization: Bearer $unver_token" "$API_BASE/api/films"
