import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  Heart,
  Clock,
  Star,
  Search,
  SlidersHorizontal,
  LogOut,
  User as UserIcon,
  Bell,
  Moon,
  Sun,
  LayoutGrid,
  List,
  Plus,
  X,
  ShieldAlert,
  ChevronDown,
  ChevronLeft,
  PanelLeft,
  PanelLeftClose,
  Sparkles,
  ArrowRight,
  Check,
  Shield,
  Film,
  Users,
  Wand2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

/**
 * ИндексВкуса — прототип v4
 * Что добавлено к v3:
 * - Публичные страницы (маркетинг): /, /features
 * - Страницы авторизации: /login, /register
 * - Мок-сессия: гейт на приватные страницы приложения
 * - Всё в одном файле, чтобы ты мог сразу исполнять и проверять.
 */

// -------------------------
// helpers
// -------------------------

function cx(...xs) {
  return xs.filter(Boolean).join(" ");
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function formatRating(r) {
  if (r === null || r === undefined) return "—";
  const rounded = Math.round(r * 2) / 2;
  const s = rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1);
  return s.replace(".0", "");
}

function isUnder18(birthISO) {
  if (!birthISO) return false;
  const dob = new Date(birthISO);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age < 18;
}

function svgDataUri(svg) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function posterSvg(title, subtitle, variant = "default") {
  const bg1 = variant === "missing" ? "#0b1220" : "#111827";
  const bg2 = variant === "missing" ? "#111827" : "#0b1220";
  const accent1 = variant === "missing" ? "#94A3B8" : "#FBBF24";
  const accent2 = variant === "missing" ? "#64748B" : "#F97316";

  return svgDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="900" viewBox="0 0 600 900">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${bg1}"/>
        <stop offset="100%" stop-color="${bg2}"/>
      </linearGradient>
      <radialGradient id="glow1" cx="25%" cy="20%" r="60%">
        <stop offset="0%" stop-color="${accent1}" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="${accent1}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="glow2" cx="80%" cy="85%" r="65%">
        <stop offset="0%" stop-color="${accent2}" stop-opacity="0.28"/>
        <stop offset="100%" stop-color="${accent2}" stop-opacity="0"/>
      </radialGradient>
      <filter id="grain" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.6  0 0 0 0 0.6  0 0 0 0 0.6  0 0 0 0.25 0"/>
      </filter>
    </defs>

    <rect width="600" height="900" fill="url(#bg)"/>
    <rect width="600" height="900" fill="url(#glow1)"/>
    <rect width="600" height="900" fill="url(#glow2)"/>
    <rect width="600" height="900" filter="url(#grain)" opacity="0.18"/>

    <rect x="42" y="54" width="516" height="792" rx="36" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.10)"/>

    <g font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto" fill="white">
      <text x="72" y="150" font-size="18" opacity="0.7">ИндексВкуса • poster mock</text>
      <text x="72" y="210" font-size="36" font-weight="700">${escapeXml(title)}</text>
      <text x="72" y="255" font-size="18" opacity="0.75">${escapeXml(subtitle || "")}</text>

      <g opacity="0.9">
        <circle cx="84" cy="790" r="8" fill="${accent1}"/>
        <circle cx="112" cy="790" r="8" fill="${accent2}"/>
        <text x="140" y="797" font-size="16" opacity="0.75">Карточка фильма</text>
      </g>

      ${variant === "missing" ? `<g opacity="0.9">
        <text x="72" y="520" font-size="22" opacity="0.85">Нет постера</text>
        <text x="72" y="548" font-size="16" opacity="0.65">Используется дефолтная заглушка</text>
      </g>` : ""}
    </g>
  </svg>`);
}

function avatarSvg(login) {
  const initials = (login || "?").slice(0, 2).toUpperCase();
  return svgDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#94A3B8" stop-opacity="0.55"/>
        <stop offset="100%" stop-color="#F97316" stop-opacity="0.45"/>
      </linearGradient>
      <radialGradient id="r" cx="30%" cy="25%" r="65%">
        <stop offset="0%" stop-color="#FBBF24" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#FBBF24" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="256" height="256" rx="64" fill="#0b1220"/>
    <rect width="256" height="256" rx="64" fill="url(#g)"/>
    <rect width="256" height="256" rx="64" fill="url(#r)"/>
    <circle cx="128" cy="110" r="46" fill="rgba(255,255,255,0.14)"/>
    <path d="M52 230c18-42 56-68 76-68s58 26 76 68" fill="rgba(255,255,255,0.12)"/>
    <text x="128" y="130" text-anchor="middle" font-family="ui-sans-serif,system-ui" font-size="44" font-weight="800" fill="rgba(255,255,255,0.85)">${escapeXml(initials)}</text>
  </svg>`);
}

// -------------------------
// i18n (минимально)
// -------------------------

const dict = {
  ru: {
    brand: "ИндексВкуса",
    films: "Фильмы",
    recs: "Рекомендации",
    favorites: "Избранное",
    later: "Смотреть позже",
    myRatings: "Мои оценки",
    users: "Пользователи",
    filters: "Фильтры",
    apply: "Применить",
    reset: "Сбросить",
    found: "Найдено",
    sortRating: "По рейтингу",
    sortName: "По названию",
    sortYear: "По году",
    searchPh: "Поиск фильмов…",
    theme: "Тема",
    language: "Язык",
    settings: "Профиль",
    submissions: "Мои добавления",
    notifications: "Уведомления",
    logout: "Выйти",
    back: "Назад",
    addFilm: "Добавить фильм",
    publicHomeTitle: "Рекомендации фильмов, которые реально попадают в ваш вкус",
    publicHomeSubtitle: "Оценивайте фильмы — и получайте точные рекомендации. Без бесконечного скролла и случайных подборок.",
    ctaTry: "Открыть демо",
    ctaLogin: "Войти",
    ctaStart: "Начать бесплатно",
    features: "Возможности",
    authLoginTitle: "Вход",
    authRegisterTitle: "Регистрация",
  },
  en: {
    brand: "TasteIndex",
    films: "Films",
    recs: "For you",
    favorites: "Favorites",
    later: "Watch later",
    myRatings: "My ratings",
    users: "People",
    filters: "Filters",
    apply: "Apply",
    reset: "Reset",
    found: "Found",
    sortRating: "By rating",
    sortName: "By name",
    sortYear: "By year",
    searchPh: "Search films…",
    theme: "Theme",
    language: "Language",
    settings: "Profile",
    submissions: "My submissions",
    notifications: "Notifications",
    logout: "Log out",
    back: "Back",
    addFilm: "Add film",
    publicHomeTitle: "Movie recommendations that actually match your taste",
    publicHomeSubtitle: "Rate films — get precise picks. No endless scrolling, no randomness.",
    ctaTry: "Open demo",
    ctaLogin: "Sign in",
    ctaStart: "Get started",
    features: "Features",
    authLoginTitle: "Sign in",
    authRegisterTitle: "Create account",
  },
};

const LANGUAGES = [
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "Português" },
  { code: "pl", label: "Polski" },
  { code: "tr", label: "Türkçe" },
  { code: "uk", label: "Українська" },
];

function LanguageSelect({ value, onChange, className }) {
  const current = LANGUAGES.find((l) => l.code === value)?.label ?? value;
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cx("h-9 w-full rounded-xl bg-background/70", className)}>
        <SelectValue placeholder={current} />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((l) => (
          <SelectItem key={l.code} value={l.code}>
            {l.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// -------------------------
// mocks
// -------------------------

const ALL_GENRES = [
  "Боевик",
  "Драма",
  "Комедия",
  "Триллер",
  "Фантастика",
  "Ужасы",
  "Криминал",
  "Приключения",
  "Аниме",
  "Документальный",
];

const ALL_COUNTRIES = [
  "США",
  "Великобритания",
  "Франция",
  "Япония",
  "Южная Корея",
  "Германия",
  "Россия",
  "Канада",
  "Испания",
  "Италия",
];

const initialFilms = [
  {
    id: "f1",
    title: "Бегущий по лезвию 2049",
    origTitle: "Blade Runner 2049",
    year: 2017,
    duration: 163,
    countries: ["США", "Великобритания"],
    genres: ["Фантастика", "Триллер", "Драма"],
    director: "Дени Вильнёв",
    description:
      "Нео-нуар о памяти и человечности: офицер Кей распутывает тайну, способную изменить баланс мира людей и репликантов.",
    avgRating: 8.1,
    myRating: 9,
    favorite: true,
    watchLater: false,
    age18: false,
    poster: "mock",
  },
  {
    id: "f2",
    title: "Реинкарнация",
    origTitle: "Hereditary",
    year: 2018,
    duration: 127,
    countries: ["США"],
    genres: ["Ужасы", "Драма", "Триллер"],
    director: "Ари Астер",
    description:
      "Семейная трагедия постепенно раскрывает цепочку необъяснимых событий и наследственных секретов.",
    avgRating: 7.3,
    myRating: null,
    favorite: false,
    watchLater: false,
    age18: true,
    poster: "mock",
  },
  {
    id: "f3",
    title: "Джентльмены",
    origTitle: "The Gentlemen",
    year: 2019,
    duration: 113,
    countries: ["Великобритания", "США"],
    genres: ["Комедия", "Криминал"],
    director: "Гай Ричи",
    description:
      "Криминальная комедия о том, как сложно выйти из бизнеса, когда вокруг слишком много джентльменов.",
    avgRating: 7.8,
    myRating: 8,
    favorite: true,
    watchLater: true,
    age18: true,
    poster: "mock",
  },
  {
    id: "f4",
    title: "Паразиты",
    origTitle: "Gisaengchung",
    year: 2019,
    duration: 132,
    countries: ["Южная Корея"],
    genres: ["Триллер", "Драма", "Комедия"],
    director: "Пон Джун-хо",
    description:
      "Две семьи и один дом. Социальная сатира, которая превращается в напряжённый триллер.",
    avgRating: 8.5,
    myRating: null,
    favorite: false,
    watchLater: true,
    age18: false,
    poster: "missing",
  },
  {
    id: "f5",
    title: "Человек-паук: Через вселенные",
    origTitle: "Spider-Man: Into the Spider-Verse",
    year: 2018,
    duration: 117,
    countries: ["США"],
    genres: ["Приключения", "Комедия", "Боевик"],
    director: "Боб Персикетти",
    description:
      "Анимационный взрыв, где Майлз Моралес встречает других Человеков-пауков из разных вселенных.",
    avgRating: 8.4,
    myRating: null,
    favorite: false,
    watchLater: false,
    age18: false,
    poster: "mock",
  },
];

const initialUsers = [
  { id: "u1", login: "moriarty", match: 89 },
  { id: "u2", login: "vesper", match: 83 },
  { id: "u3", login: "k0rhu", match: 78 },
  { id: "u4", login: "black_film", match: 73 },
  { id: "u5", login: "catwalk", match: 69 },
];

const initialNotifications = [
  { id: "n1", title: "Фильм отправлен на модерацию", text: "«Паразиты» — ожидает проверки.", time: "сегодня" },
  { id: "n2", title: "Фильм одобрен", text: "«Джентльмены» — добавлен в каталог.", time: "вчера" },
  { id: "n3", title: "Фильм отклонён", text: "«Матрица 2069» — причина: неполные данные/дубликат.", time: "2 дня назад" },
];

function buildPoster(film) {
  if (film.poster === "missing") return posterSvg(film.title, String(film.year), "missing");
  return posterSvg(film.title, String(film.year));
}

// -------------------------
// Toasts
// -------------------------

const ToastCtx = createContext(null);

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = (t) => {
    const id = `t_${Math.random().toString(16).slice(2)}`;
    const toast = { id, title: t.title || "", text: t.text || "", type: t.type || "info", ms: t.ms ?? 3500 };
    setToasts((prev) => [toast, ...prev]);
    window.setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), toast.ms);
  };

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="fixed right-4 top-4 z-[100] flex w-[min(420px,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cx(
              "rounded-2xl border bg-background/92 p-3 shadow-lg backdrop-blur",
              t.type === "success" && "border-emerald-500/30",
              t.type === "error" && "border-rose-500/30",
              t.type === "info" && "border-border"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold leading-5">{t.title}</div>
                {t.text ? <div className="mt-0.5 text-sm text-muted-foreground">{t.text}</div> : null}
              </div>
              <button
                className="mt-0.5 rounded-lg p-1 text-muted-foreground hover:bg-muted"
                onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                aria-label="Закрыть"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

// -------------------------
// MultiSelect
// -------------------------

function MultiSelect({ label, options, value, onChange, placeholder = "Выберите…" }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return options;
    return options.filter((x) => x.toLowerCase().includes(s));
  }, [q, options]);

  const toggle = (opt) => {
    if (value.includes(opt)) onChange(value.filter((x) => x !== opt));
    else onChange([...value, opt]);
  };

  const remove = (opt) => onChange(value.filter((x) => x !== opt));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="w-full rounded-2xl border bg-background/85 px-3 py-2 text-left text-sm shadow-sm hover:bg-muted/30">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">{label}</div>
              <div className="mt-0.5 truncate">
                {value.length ? (
                  <span className="text-foreground">
                    {value.slice(0, 2).join(", ")}
                    {value.length > 2 ? ` +${value.length - 2}` : ""}
                  </span>
                ) : (
                  <span className="text-muted-foreground">{placeholder}</span>
                )}
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[360px] rounded-2xl p-3" align="start">
        <div className="space-y-3">
          <div className="text-sm font-semibold">{label}</div>

          {value.length ? (
            <div className="flex flex-wrap gap-2">
              {value.map((v) => (
                <span key={v} className="inline-flex items-center gap-1 rounded-2xl border bg-muted/40 px-2 py-1 text-xs">
                  {v}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      remove(v);
                    }}
                    className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
                    aria-label={`Убрать ${v}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : null}

          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск…" className="rounded-xl" />

          <div className="max-h-56 overflow-auto rounded-2xl border">
            {filtered.map((opt) => {
              const checked = value.includes(opt);
              return (
                <button
                  type="button"
                  key={opt}
                  onClick={() => toggle(opt)}
                  className={cx("flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted", checked && "bg-muted/60")}
                >
                  <Checkbox checked={checked} />
                  <span className="truncate">{opt}</span>
                </button>
              );
            })}
            {filtered.length === 0 ? <div className="px-3 py-6 text-center text-sm text-muted-foreground">Ничего не найдено</div> : null}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// -------------------------
// Rating (10 stars)
// -------------------------

function StarPicker({ value, onPick }) {
  const [hover, setHover] = useState(null);
  const active = hover ?? value ?? 0;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 10 }).map((_, i) => {
        const v = i + 1;
        const filled = v <= active;
        return (
          <button
            key={v}
            type="button"
            onMouseEnter={() => setHover(v)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onPick(v)}
            className="rounded-lg p-1 hover:bg-muted"
            aria-label={`Оценка ${v}`}
          >
            <Star className={cx("h-5 w-5", filled ? "text-amber-500" : "text-muted-foreground")} fill={filled ? "currentColor" : "none"} />
          </button>
        );
      })}
    </div>
  );
}

function RatingBadge({ myRating, avgRating, onSet, onClear }) {
  const hasMy = myRating !== null && myRating !== undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex w-full items-center justify-between gap-3 rounded-2xl border bg-background/88 px-3 py-2 text-left shadow-sm backdrop-blur hover:bg-muted/30">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-semibold">
                {hasMy ? myRating : formatRating(avgRating)}
                <span className="ml-1 text-xs font-normal text-muted-foreground">/10</span>
              </div>
              <div className="text-xs text-muted-foreground">{hasMy ? `ср: ${formatRating(avgRating)}` : "средняя"}</div>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[360px] rounded-2xl p-4" align="start">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-sm font-semibold">Поставить оценку</div>
              <div className="text-xs text-muted-foreground">Клик по звёздам сохраняет</div>
            </div>
            {hasMy ? (
              <Button variant="outline" className="h-9 rounded-xl" onClick={onClear}>
                Очистить
              </Button>
            ) : null}
          </div>

          <StarPicker value={myRating} onPick={onSet} />

          <div className="rounded-2xl border bg-muted/20 p-3 text-xs text-muted-foreground">
            Средняя по проекту: <span className="font-semibold text-foreground">{formatRating(avgRating)}/10</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// -------------------------
// Poster
// -------------------------

function Poster({ film, blocked }) {
  const src = useMemo(() => buildPoster(film), [film]);
  return (
    <div className="aspect-[2/3] w-full overflow-hidden">
      <img src={src} alt={film.title} className={cx("h-full w-full object-cover", blocked && "blur-[14px]")} draggable={false} />
    </div>
  );
}

// -------------------------
// Film cards
// -------------------------

function FilmCard({ film, under18, onOpen, onToggleFav, onToggleLater, onSetRating, onClearRating, extraActions }) {
  const blocked = under18 && film.age18;

  return (
    <Card className="group overflow-hidden rounded-2xl border bg-card/80 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative">
        <Poster film={film} blocked={blocked} />

        <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
          {film.age18 ? (
            <Badge className="rounded-xl" variant={blocked ? "destructive" : "secondary"}>
              18+
            </Badge>
          ) : null}
        </div>

        <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!blocked) onToggleLater(film.id);
            }}
            className={cx(
              "rounded-2xl border bg-background/80 p-2 shadow-sm backdrop-blur hover:bg-muted",
              film.watchLater && "border-amber-500/30",
              blocked && "opacity-60"
            )}
            aria-label="Смотреть позже"
            title="Смотреть позже"
          >
            <Clock className={cx("h-4 w-4", film.watchLater ? "text-amber-600" : "text-muted-foreground")} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!blocked) onToggleFav(film.id);
            }}
            className={cx(
              "rounded-2xl border bg-background/80 p-2 shadow-sm backdrop-blur hover:bg-muted",
              film.favorite && "border-rose-500/30",
              blocked && "opacity-60"
            )}
            aria-label="Избранное"
            title="Избранное"
          >
            <Heart className={cx("h-4 w-4", film.favorite ? "text-rose-600" : "text-muted-foreground")} />
          </button>

          {extraActions}
        </div>

        <button onClick={() => onOpen(film.id)} className="absolute inset-0 z-0" aria-label="Открыть фильм" />

        <div className={cx("absolute bottom-3 left-3 right-3 z-10", blocked && "blur-[14px]")}>
          <RatingBadge
            myRating={film.myRating}
            avgRating={film.avgRating}
            onSet={(v) => onSetRating(film.id, v)}
            onClear={() => onClearRating(film.id)}
          />
        </div>

        {blocked ? (
          <div className="absolute inset-0 z-20 flex items-end">
            <div className="m-3 w-full rounded-2xl border bg-background/95 p-3 shadow-lg">
              <div className="flex items-start gap-2">
                <ShieldAlert className="mt-0.5 h-4 w-4 text-rose-600" />
                <div className="min-w-0">
                  <div className="text-sm font-semibold">Контент ограничен</div>
                  <div className="text-xs text-muted-foreground">Постер и описание скрыты по возрасту</div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <CardContent className="space-y-1 p-4">
        <div className="line-clamp-2 text-sm font-semibold leading-5">{film.title}</div>
        <div className="text-xs text-muted-foreground">
          {film.year}
          {film.duration ? ` • ${film.duration} мин` : ""}
          {film.countries?.length ? ` • ${film.countries[0]}` : ""}
        </div>
        <div className="text-xs text-muted-foreground">
          Режиссёр: <span className="underline decoration-muted-foreground/40 underline-offset-2">{film.director}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function FilmRow({ film, under18, onOpen, onToggleFav, onToggleLater, onSetRating, onClearRating }) {
  const blocked = under18 && film.age18;
  return (
    <Card className="rounded-2xl border bg-card/80">
      <CardContent className="flex gap-4 p-4">
        <button onClick={() => onOpen(film.id)} className="relative w-24 shrink-0 overflow-hidden rounded-2xl border">
          <Poster film={film} blocked={blocked} />
          {film.age18 ? (
            <Badge className="absolute left-2 top-2 rounded-lg" variant={blocked ? "destructive" : "secondary"}>
              18+
            </Badge>
          ) : null}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <button onClick={() => onOpen(film.id)} className="text-left">
                <div className="truncate text-sm font-semibold">{film.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {film.year}
                  {film.duration ? ` • ${film.duration} мин` : ""}
                  {film.countries?.length ? ` • ${film.countries.join(", ")}` : ""}
                </div>
              </button>
              <div className={cx("mt-2 text-sm text-muted-foreground", blocked && "blur-[10px]")}>
                <div className="line-clamp-2">{film.description}</div>
              </div>
            </div>

            <div className={cx("flex items-center gap-2", blocked && "opacity-60")}>
              <button
                onClick={() => !blocked && onToggleLater(film.id)}
                className={cx(
                  "rounded-2xl border bg-background/80 p-2 shadow-sm hover:bg-muted",
                  film.watchLater && "border-amber-500/30"
                )}
                aria-label="Смотреть позже"
              >
                <Clock className={cx("h-4 w-4", film.watchLater ? "text-amber-600" : "text-muted-foreground")} />
              </button>
              <button
                onClick={() => !blocked && onToggleFav(film.id)}
                className={cx(
                  "rounded-2xl border bg-background/80 p-2 shadow-sm hover:bg-muted",
                  film.favorite && "border-rose-500/30"
                )}
                aria-label="Избранное"
              >
                <Heart className={cx("h-4 w-4", film.favorite ? "text-rose-600" : "text-muted-foreground")} />
              </button>
            </div>
          </div>

          <div className="mt-3">
            <RatingBadge
              myRating={film.myRating}
              avgRating={film.avgRating}
              onSet={(v) => onSetRating(film.id, v)}
              onClear={() => onClearRating(film.id)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// -------------------------
// Pagination
// -------------------------

function Pagination({ page, pages, onPage }) {
  const items = useMemo(() => {
    const out = [];
    out.push(1);
    const left = clamp(page - 1, 2, pages - 1);
    const right = clamp(page + 1, 2, pages - 1);
    if (left > 2) out.push("…l");
    for (let p = left; p <= right; p++) out.push(p);
    if (right < pages - 1) out.push("…r");
    if (pages > 1) out.push(pages);
    return out;
  }, [page, pages]);

  return (
    <div className="flex items-center justify-center gap-2">
      <Button variant="outline" className="rounded-xl" onClick={() => onPage(Math.max(1, page - 1))} disabled={page <= 1}>
        Назад
      </Button>
      {items.map((it) => {
        if (typeof it === "string") return <div key={it} className="px-2 text-sm text-muted-foreground">…</div>;
        const p = it;
        return (
          <Button
            key={String(p)}
            variant={p === page ? "default" : "outline"}
            className="h-9 w-10 rounded-xl px-0"
            onClick={() => onPage(p)}
          >
            {p}
          </Button>
        );
      })}
      <Button variant="outline" className="rounded-xl" onClick={() => onPage(Math.min(pages, page + 1))} disabled={page >= pages}>
        Вперёд
      </Button>
    </div>
  );
}

// -------------------------
// Filters panel + rail
// -------------------------

function FiltersPanel({ t, state, setState, onApply, onReset, resultCount }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">{t.filters}</div>
          <div className="text-xs text-muted-foreground">
            {t.found}: {resultCount}
          </div>
        </div>
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
      </div>

      <Card className="rounded-2xl border bg-card/75 backdrop-blur">
        <CardContent className="space-y-3 p-4">
          <div>
            <div className="text-xs text-muted-foreground">Год</div>
            <div className="mt-1 flex items-center justify-between text-sm">
              <span className="tabular-nums">{state.yearMin}</span>
              <span className="text-muted-foreground">—</span>
              <span className="tabular-nums">{state.yearMax}</span>
            </div>
            <div className="mt-2 space-y-3">
              <Slider
                value={[state.yearMin]}
                min={1980}
                max={2025}
                step={1}
                onValueChange={(v) => setState((s) => ({ ...s, yearMin: Math.min(v[0], s.yearMax) }))}
              />
              <Slider
                value={[state.yearMax]}
                min={1980}
                max={2025}
                step={1}
                onValueChange={(v) => setState((s) => ({ ...s, yearMax: Math.max(v[0], s.yearMin) }))}
              />
            </div>
          </div>

          <MultiSelect label="Жанры" options={ALL_GENRES} value={state.genres} onChange={(genres) => setState((s) => ({ ...s, genres }))} />

          <MultiSelect
            label="Страны"
            options={ALL_COUNTRIES}
            value={state.countries}
            onChange={(countries) => setState((s) => ({ ...s, countries }))}
          />

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button className="rounded-xl" onClick={onApply}>
              {t.apply}
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={onReset}>
              {t.reset}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FiltersRail({ t, onExpand }) {
  return (
    <div className="sticky top-28">
      <div className="flex flex-col items-center gap-2 rounded-3xl border bg-card/70 p-2 shadow-sm backdrop-blur">
        <Button variant="outline" className="h-10 w-10 rounded-2xl p-0" onClick={onExpand} aria-label="Открыть фильтры">
          <PanelLeft className="h-4 w-4" />
        </Button>
        <div className="text-[10px] text-muted-foreground rotate-180 [writing-mode:vertical-rl]">{t.filters}</div>
      </div>
    </div>
  );
}

// -------------------------
// Routes
// -------------------------

const ROUTES = {
  // public
  publicHome: "publicHome",
  publicFeatures: "publicFeatures",
  login: "login",
  register: "register",

  // app
  films: "films",
  recs: "recs",
  favorites: "favorites",
  later: "later",
  myRatings: "myRatings",
  users: "users",
  userProfile: "userProfile",
  filmDetail: "filmDetail",
  addFilm: "addFilm",
  submissions: "submissions",
  settings: "settings",
  notifications: "notifications",
};

const APP_ROUTES_SET = new Set([
  ROUTES.films,
  ROUTES.recs,
  ROUTES.favorites,
  ROUTES.later,
  ROUTES.myRatings,
  ROUTES.users,
  ROUTES.userProfile,
  ROUTES.filmDetail,
  ROUTES.addFilm,
  ROUTES.submissions,
  ROUTES.settings,
  ROUTES.notifications,
]);

const PUBLIC_ROUTES_SET = new Set([ROUTES.publicHome, ROUTES.publicFeatures, ROUTES.login, ROUTES.register]);

// -------------------------
// Export
// -------------------------

export default function IndexVkusV4() {
  return (
    <ToastProvider>
      <PrototypeV4 />
    </ToastProvider>
  );
}

function PrototypeV4() {
  const { push } = useToast();

  const [language, setLanguage] = useState("ru");
  const t = dict[language] ?? dict.ru;

  const [theme, setTheme] = useState("dark");

  // мок: дата рождения нужна только для эффекта 18+ блюра (как в v3)
  const [birthDate] = useState("1990-12-18");
  const under18 = isUnder18(birthDate);

  // мок-сессия
  const [session, setSession] = useState({ isAuth: false, login: null });
  const [afterAuth, setAfterAuth] = useState(null);

  const [route, setRoute] = useState(ROUTES.publicHome);
  const [routeParam, setRouteParam] = useState(null);

  const [films, setFilms] = useState(initialFilms);
  const [users] = useState(initialUsers);
  const [notifications] = useState(initialNotifications);

  const [cookiesOpen, setCookiesOpen] = useState(true);

  // Catalog prefs
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("rating");
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [filters, setFilters] = useState({ yearMin: 2000, yearMax: 2025, genres: [], countries: [] });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  const ratedCount = useMemo(() => films.filter((f) => f.myRating !== null && f.myRating !== undefined).length, [films]);

  const suggestions = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (s.length < 2) return [];
    return films.filter((f) => f.title.toLowerCase().includes(s)).slice(0, 5);
  }, [search, films]);

  // guard: если пользователь не авторизован, не пускаем в app
  useEffect(() => {
    if (APP_ROUTES_SET.has(route) && !session.isAuth) {
      setAfterAuth({ route, routeParam });
      setRoute(ROUTES.login);
      setRouteParam(null);
    }
  }, [route, routeParam, session.isAuth]);

  // list depending on route
  const baseList = useMemo(() => {
    let list = [...films];

    if (route === ROUTES.favorites) list = list.filter((f) => f.favorite);
    if (route === ROUTES.later) list = list.filter((f) => f.watchLater);
    if (route === ROUTES.myRatings) list = list.filter((f) => f.myRating !== null && f.myRating !== undefined);

    const s = search.trim().toLowerCase();
    if (s) list = list.filter((f) => f.title.toLowerCase().includes(s) || (f.origTitle || "").toLowerCase().includes(s));

    const af = appliedFilters;
    list = list.filter((f) => f.year >= af.yearMin && f.year <= af.yearMax);
    if (af.genres.length) list = list.filter((f) => af.genres.some((g) => f.genres.includes(g)));
    if (af.countries.length) list = list.filter((f) => af.countries.some((c) => f.countries.includes(c)));

    if (sort === "name") list.sort((a, b) => a.title.localeCompare(b.title, "ru"));
    if (sort === "year") list.sort((a, b) => b.year - a.year);
    if (sort === "rating") {
      if (route === ROUTES.myRatings) list.sort((a, b) => (b.myRating ?? -1) - (a.myRating ?? -1));
      else list.sort((a, b) => (b.avgRating ?? -1) - (a.avgRating ?? -1));
    }

    return list;
  }, [films, route, search, appliedFilters, sort]);

  const resultCount = baseList.length;
  const pages = Math.max(1, Math.ceil(resultCount / pageSize));

  const pagedList = useMemo(() => {
    const p = clamp(page, 1, pages);
    const start = (p - 1) * pageSize;
    return baseList.slice(start, start + pageSize);
  }, [baseList, page, pages]);

  useEffect(() => {
    // сбрасываем пагинацию/вью только внутри app-режима
    if (APP_ROUTES_SET.has(route)) setPage(1);
  }, [route, appliedFilters, search, sort, view]);

  // Actions
  const toggleFav = (id) => {
    if (!session.isAuth) return;
    setFilms((prev) => prev.map((f) => (f.id === id ? { ...f, favorite: !f.favorite } : f)));
    push({ title: "Сохранено", text: "Избранное обновлено", type: "success" });
  };

  const toggleLater = (id) => {
    if (!session.isAuth) return;
    setFilms((prev) => prev.map((f) => (f.id === id ? { ...f, watchLater: !f.watchLater } : f)));
    push({ title: "Сохранено", text: "«Смотреть позже» обновлено", type: "success" });
  };

  const setRating = (id, v) => {
    if (!session.isAuth) return;
    setFilms((prev) => prev.map((f) => (f.id === id ? { ...f, myRating: v } : f)));
    push({ title: "Оценка сохранена", text: `${v}/10`, type: "success" });
  };

  const clearRating = (id) => {
    if (!session.isAuth) return;
    setFilms((prev) => prev.map((f) => (f.id === id ? { ...f, myRating: null } : f)));
    push({ title: "Оценка очищена", type: "info" });
  };

  const openFilm = (id) => {
    setRoute(ROUTES.filmDetail);
    setRouteParam(id);
  };

  const go = (r, param = null) => {
    setRoute(r);
    setRouteParam(param);
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
    push({ title: "Фильтры применены", type: "info" });
  };

  const resetFilters = () => {
    const base = { yearMin: 2000, yearMax: 2025, genres: [], countries: [] };
    setFilters(base);
    setAppliedFilters(base);
    push({ title: "Фильтры сброшены", type: "info" });
  };

  const login = (loginValue) => {
    setSession({ isAuth: true, login: loginValue || "nikolay" });
    push({ title: "Вход выполнен", type: "success" });
    if (afterAuth?.route) {
      setRoute(afterAuth.route);
      setRouteParam(afterAuth.routeParam ?? null);
      setAfterAuth(null);
    } else {
      setRoute(ROUTES.films);
      setRouteParam(null);
    }
  };

  const logout = () => {
    setSession({ isAuth: false, login: null });
    setRoute(ROUTES.publicHome);
    setRouteParam(null);
    setAfterAuth(null);
    push({ title: "Вы вышли", type: "info" });
  };

  // user profile mock ratings
  const userRatedFilms = useMemo(() => {
    if (route !== ROUTES.userProfile || !routeParam) return [];
    const seed = String(routeParam)
      .split("")
      .reduce((a, c) => a + c.charCodeAt(0), 0);
    const pick = [...films].map((f, i) => ({
      ...f,
      userRating: ((seed + i * 7) % 10) + 1,
    }));
    return pick.slice(0, Math.min(12, pick.length));
  }, [route, routeParam, films]);

  const inPublic = PUBLIC_ROUTES_SET.has(route);

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground">
        <AmbientBackground />

        {inPublic ? (
          <PublicShell
            t={t}
            theme={theme}
            setTheme={setTheme}
            language={language}
            setLanguage={setLanguage}
            session={session}
            onGo={go}
            onOpenDemo={() => {
              // Демо: сразу логиним мок-пользователем
              login("demo");
            }}
          >
            {route === ROUTES.publicHome ? (
              <PublicHome t={t} films={films} onFeatures={() => go(ROUTES.publicFeatures)} onTry={() => login("demo")} />
            ) : null}
            {route === ROUTES.publicFeatures ? (
              <PublicFeatures t={t} onTry={() => login("demo")} />
            ) : null}
            {route === ROUTES.login ? (
              <AuthScreen mode="login" t={t} onBack={() => go(ROUTES.publicHome)} onSubmit={(v) => login(v)} onSwap={() => go(ROUTES.register)} />
            ) : null}
            {route === ROUTES.register ? (
              <AuthScreen mode="register" t={t} onBack={() => go(ROUTES.publicHome)} onSubmit={(v) => login(v)} onSwap={() => go(ROUTES.login)} />
            ) : null}
          </PublicShell>
        ) : (
          <>
            {/* Dev router (только для app) */}
            <div className="fixed left-4 top-4 z-[90] hidden sm:block">
              <Card className="rounded-2xl border bg-background/75 shadow-lg backdrop-blur">
                <CardContent className="flex items-center gap-2 p-2">
                  <Select value={route} onValueChange={(v) => go(v)}>
                    <SelectTrigger className="h-9 w-[240px] rounded-xl">
                      <SelectValue placeholder="Route" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ROUTES.films}>/films</SelectItem>
                      <SelectItem value={ROUTES.recs}>/recommendations</SelectItem>
                      <SelectItem value={ROUTES.favorites}>/favorites</SelectItem>
                      <SelectItem value={ROUTES.later}>/watch-later</SelectItem>
                      <SelectItem value={ROUTES.myRatings}>/my-ratings</SelectItem>
                      <SelectItem value={ROUTES.users}>/users</SelectItem>
                      <SelectItem value={ROUTES.userProfile}>/users/:id</SelectItem>
                      <SelectItem value={ROUTES.notifications}>/notifications</SelectItem>
                      <SelectItem value={ROUTES.settings}>/me/settings</SelectItem>
                      <SelectItem value={ROUTES.submissions}>/me/submissions</SelectItem>
                      <SelectItem value={ROUTES.addFilm}>/films/add</SelectItem>
                      <SelectItem value={ROUTES.filmDetail}>/films/:id</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>

            <AppShell
              t={t}
              route={route}
              go={go}
              theme={theme}
              setTheme={setTheme}
              language={language}
              setLanguage={setLanguage}
              notifications={notifications}
              ratedCount={ratedCount}
              search={search}
              setSearch={setSearch}
              suggestions={suggestions}
              session={session}
              onLogout={logout}
            >
              {[ROUTES.films, ROUTES.recs, ROUTES.favorites, ROUTES.later, ROUTES.myRatings].includes(route) ? (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-semibold">
                        {route === ROUTES.films
                          ? t.films
                          : route === ROUTES.recs
                          ? t.recs
                          : route === ROUTES.favorites
                          ? t.favorites
                          : route === ROUTES.later
                          ? t.later
                          : t.myRatings}
                      </h2>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {route === ROUTES.recs
                          ? "Подборка по похожим вкусам"
                          : route === ROUTES.favorites
                          ? "Быстрый доступ к любимому"
                          : route === ROUTES.later
                          ? "Не потеряйте то, что хотите посмотреть"
                          : route === ROUTES.myRatings
                          ? "Ваш профиль вкуса"
                          : "Каталог фильмов"}
                      </div>
                    </div>

                    {route === ROUTES.films ? (
                      <Button className="rounded-xl" onClick={() => go(ROUTES.addFilm)}>
                        <Plus className="mr-2 h-4 w-4" /> {t.addFilm}
                      </Button>
                    ) : null}
                  </div>

                  <div className={cx("grid gap-4", filtersCollapsed ? "lg:grid-cols-[56px_1fr]" : "lg:grid-cols-[280px_1fr]")}>
                    <div className="hidden lg:block">
                      {filtersCollapsed ? (
                        <FiltersRail t={t} onExpand={() => setFiltersCollapsed(false)} />
                      ) : (
                        <div className="sticky top-28 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-semibold">{t.filters}</div>
                            <Button
                              variant="outline"
                              className="h-9 rounded-xl"
                              onClick={() => setFiltersCollapsed(true)}
                              aria-label="Свернуть фильтры"
                              title="Свернуть"
                            >
                              <PanelLeftClose className="h-4 w-4" />
                            </Button>
                          </div>
                          <FiltersPanel t={t} state={filters} setState={setFilters} onApply={applyFilters} onReset={resetFilters} resultCount={resultCount} />
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Select value={sort} onValueChange={setSort}>
                            <SelectTrigger className="h-9 w-[190px] rounded-xl">
                              <SelectValue placeholder="Сортировка" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="rating">{t.sortRating}</SelectItem>
                              <SelectItem value="name">{t.sortName}</SelectItem>
                              <SelectItem value="year">{t.sortYear}</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="text-sm text-muted-foreground">
                            {t.found}: {resultCount}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant={view === "grid" ? "default" : "outline"} className="h-9 rounded-xl" onClick={() => setView("grid")} aria-label="Плитка">
                            <LayoutGrid className="h-4 w-4" />
                          </Button>
                          <Button variant={view === "list" ? "default" : "outline"} className="h-9 rounded-xl" onClick={() => setView("list")} aria-label="Список">
                            <List className="h-4 w-4" />
                          </Button>

                          <Sheet>
                            <SheetTrigger asChild>
                              <Button variant="outline" className="h-9 rounded-xl lg:hidden">
                                <SlidersHorizontal className="mr-2 h-4 w-4" /> {t.filters}
                              </Button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="rounded-t-2xl">
                              <SheetHeader>
                                <SheetTitle>{t.filters}</SheetTitle>
                              </SheetHeader>
                              <div className="mt-4">
                                <FiltersPanel t={t} state={filters} setState={setFilters} onApply={applyFilters} onReset={resetFilters} resultCount={resultCount} />
                              </div>
                            </SheetContent>
                          </Sheet>
                        </div>
                      </div>

                      {route === ROUTES.films ? (
                        <Card className="rounded-2xl border bg-card/70 shadow-sm backdrop-blur">
                          <CardContent className="flex flex-col gap-2 p-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 rounded-2xl border bg-background/70 p-2 shadow-sm">
                                <Sparkles className="h-4 w-4 text-amber-600" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold">Не нашли фильм?</div>
                                <div className="text-sm text-muted-foreground">Добавьте карточку — она уйдёт на модерацию.</div>
                              </div>
                            </div>
                            <Button className="rounded-xl" onClick={() => go(ROUTES.addFilm)}>
                              <Plus className="mr-2 h-4 w-4" /> {t.addFilm}
                            </Button>
                          </CardContent>
                        </Card>
                      ) : null}

                      {resultCount === 0 ? (
                        <EmptyState onReset={resetFilters} />
                      ) : view === "grid" ? (
                        <div className={cx("grid grid-cols-2 gap-4 sm:grid-cols-3", filtersCollapsed ? "xl:grid-cols-5" : "xl:grid-cols-4")}>
                          {pagedList.map((f) => (
                            <FilmCard
                              key={f.id}
                              film={f}
                              under18={under18}
                              onOpen={openFilm}
                              onToggleFav={toggleFav}
                              onToggleLater={toggleLater}
                              onSetRating={setRating}
                              onClearRating={clearRating}
                              extraActions={
                                route === ROUTES.recs ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      push({ title: "Рекомендация скрыта", type: "info" });
                                    }}
                                    className="rounded-2xl border bg-background/80 p-2 shadow-sm backdrop-blur hover:bg-muted"
                                    aria-label="Скрыть"
                                    title="Скрыть"
                                  >
                                    <X className="h-4 w-4 text-muted-foreground" />
                                  </button>
                                ) : null
                              }
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {pagedList.map((f) => (
                            <FilmRow
                              key={f.id}
                              film={f}
                              under18={under18}
                              onOpen={openFilm}
                              onToggleFav={toggleFav}
                              onToggleLater={toggleLater}
                              onSetRating={setRating}
                              onClearRating={clearRating}
                            />
                          ))}
                        </div>
                      )}

                      <div className="pt-4">
                        <Pagination page={page} pages={pages} onPage={setPage} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {route === ROUTES.filmDetail ? (
                <FilmDetail
                  t={t}
                  film={films.find((f) => f.id === routeParam) || films[0]}
                  under18={under18}
                  onBack={() => go(ROUTES.films)}
                  onToggleFav={toggleFav}
                  onToggleLater={toggleLater}
                  onSetRating={setRating}
                  onClearRating={clearRating}
                />
              ) : null}

              {route === ROUTES.users ? <UsersScreen t={t} users={users} onOpen={(id) => go(ROUTES.userProfile, id)} /> : null}

              {route === ROUTES.userProfile ? (
                <UserProfile user={users.find((u) => u.id === routeParam) || users[0]} films={userRatedFilms} onBack={() => go(ROUTES.users)} onOpenFilm={openFilm} />
              ) : null}

              {route === ROUTES.notifications ? <NotificationsScreen t={t} notifications={notifications} /> : null}

              {route === ROUTES.settings ? <SettingsScreen t={t} theme={theme} setTheme={setTheme} language={language} setLanguage={setLanguage} /> : null}

              {route === ROUTES.addFilm ? (
                <AddFilmScreen
                  onBack={() => go(ROUTES.films)}
                  onSubmit={() => {
                    push({ title: "Отправлено на модерацию", type: "success" });
                    go(ROUTES.submissions);
                  }}
                />
              ) : null}

              {route === ROUTES.submissions ? <SubmissionsScreen /> : null}
            </AppShell>
          </>
        )}

        {cookiesOpen ? <CookieBanner onClose={() => setCookiesOpen(false)} /> : null}
      </div>
    </div>
  );
}

// -------------------------
// Public pages
// -------------------------

function PublicShell({ t, theme, setTheme, language, setLanguage, session, onGo, onOpenDemo, children }) {
  return (
    <div>
      <div className="sticky top-0 z-50">
        <div className="border-b bg-background/80 backdrop-blur">
          <div className="mx-auto max-w-[1320px] px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <button onClick={() => onGo(ROUTES.publicHome)} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl shadow-sm" style={{ background: "linear-gradient(135deg, rgba(251,191,36,.95), rgba(249,115,22,.85))" }} />
                <div className="leading-tight">
                  <div className="text-sm font-semibold">{t.brand}</div>
                  <div className="text-xs text-muted-foreground">рекомендации по оценкам</div>
                </div>
              </button>

              <div className="hidden items-center gap-1 sm:flex">
                <NavPill active={false} onClick={() => onGo(ROUTES.publicHome)}>
                  Главная
                </NavPill>
                <NavPill active={false} onClick={() => onGo(ROUTES.publicFeatures)}>
                  {t.features}
                </NavPill>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" className="h-10 rounded-2xl" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={t.theme}>
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>

                <div className="hidden w-[190px] sm:block">
                  <LanguageSelect value={language} onChange={setLanguage} />
                </div>

                {session.isAuth ? (
                  <Button className="h-10 rounded-2xl" onClick={() => onGo(ROUTES.films)}>
                    В приложение <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" className="h-10 rounded-2xl" onClick={() => onGo(ROUTES.login)}>
                      {t.ctaLogin}
                    </Button>
                    <Button className="h-10 rounded-2xl" onClick={onOpenDemo}>
                      {t.ctaTry} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1320px] px-4 py-6 pb-24 sm:pb-10">{children}</div>

      <div className="border-t">
        <div className="mx-auto max-w-[1320px] px-4 py-8 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>© {t.brand}</div>
            <div className="flex flex-wrap gap-3">
              <button className="hover:text-foreground" onClick={() => onGo(ROUTES.publicFeatures)}>
                {t.features}
              </button>
              <button className="hover:text-foreground" onClick={() => onGo(ROUTES.login)}>
                {t.ctaLogin}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PublicHome({ t, films, onFeatures, onTry }) {
  const top = [...films].sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0)).slice(0, 4);
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-2xl border bg-card/70 shadow-sm backdrop-blur">
          <CardContent className="p-6 md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" /> MVP: оценки → рекомендации
            </div>
            <h1 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">{t.publicHomeTitle}</h1>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">{t.publicHomeSubtitle}</p>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button className="h-11 rounded-2xl" onClick={onTry}>
                {t.ctaTry} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="h-11 rounded-2xl" onClick={onFeatures}>
                {t.features}
              </Button>
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-3">
              <MiniKpi icon={Wand2} title="Точные рекомендации" text="на основе ваших оценок" />
              <MiniKpi icon={Film} title="Каталог" text="фильтры/сортировка" />
              <MiniKpi icon={Shield} title="18+ защита" text="блюр по возрасту" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border bg-card/70 shadow-sm backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base">Как это выглядит</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {top.map((f) => (
                <div key={f.id} className="overflow-hidden rounded-2xl border">
                  <img src={buildPoster(f)} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border bg-muted/15 p-4 text-sm text-muted-foreground">
              <div className="font-semibold text-foreground">Демо — без регистрации</div>
              <div className="mt-1">Откроется приватная часть приложения с моковыми данными.</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <FeatureCard icon={Star} title="10-звёздочная система" text="Быстро ставишь оценку — и вкус формируется сам." />
        <FeatureCard icon={Users} title="Люди со схожим вкусом" text="Смотри, кто похож на тебя, и что им заходит." />
        <FeatureCard icon={Clock} title="Смотреть позже" text="Лист ожидания, который не превращается в кладбище." />
      </div>

      <Card className="rounded-2xl border bg-card/70 shadow-sm backdrop-blur">
        <CardContent className="flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-semibold">Хочешь увидеть всё прямо сейчас?</div>
            <div className="text-sm text-muted-foreground">Открывай демо — сразу попадёшь в каталог и рекомендации.</div>
          </div>
          <Button className="h-11 rounded-2xl" onClick={onTry}>
            {t.ctaTry} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function PublicFeatures({ t, onTry }) {
  const feats = [
    { icon: Star, t: "Оценки", d: "10 звёзд, hover, очистка, всплывающий контрол." },
    { icon: Film, t: "Каталог", d: "Фильтры по годам/жанрам/странам + сортировка." },
    { icon: Heart, t: "Избранное", d: "Быстрый доступ к любимому." },
    { icon: Clock, t: "Смотреть позже", d: "Очередь просмотра." },
    { icon: Users, t: "Совпадение вкуса", d: "Список людей + профиль с оценками." },
    { icon: Shield, t: "Возрастной контроль", d: "18+ контент скрывается (мок)." },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold">{t.features}</h2>
          <div className="mt-1 text-sm text-muted-foreground">Публичная страница для презентации + быстрый вход в демо.</div>
        </div>
        <Button className="h-11 rounded-2xl" onClick={onTry}>
          {t.ctaTry} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {feats.map((f) => (
          <Card key={f.t} className="rounded-2xl border bg-card/70 shadow-sm backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl border bg-background/70 p-2 shadow-sm">
                  <f.icon className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{f.t}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{f.d}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl border bg-card/70 shadow-sm backdrop-blur">
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-[1fr_360px] md:items-center">
            <div>
              <div className="text-sm font-semibold">Что дальше в реальном проекте</div>
              <div className="mt-1 text-sm text-muted-foreground">Бэк на Laravel + фронт на Next.js + MySQL + Swagger (в ТЗ ниже).</div>
              <ul className="mt-4 space-y-2 text-sm">
                {[
                  "Авторизация (Sanctum), роли: user/admin",
                  "Каталог фильмов + модерация добавлений",
                  "Оценки/избранное/смотреть позже",
                  "Рекомендации на основе близости оценок",
                  "Автогенерация OpenAPI/Swagger",
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border bg-muted/15 p-5">
              <div className="text-sm font-semibold">Запуск демо</div>
              <div className="mt-1 text-sm text-muted-foreground">Сейчас — мок. В репо будет docker compose.</div>
              <Button className="mt-4 w-full h-11 rounded-2xl" onClick={onTry}>
                {t.ctaTry}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AuthScreen({ mode, t, onBack, onSubmit, onSwap }) {
  const [loginValue, setLoginValue] = useState("");
  const [pass, setPass] = useState("");

  return (
    <div className="mx-auto max-w-[520px]">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">{mode === "login" ? t.authLoginTitle : t.authRegisterTitle}</div>
          <h2 className="text-2xl font-semibold">{mode === "login" ? "Добро пожаловать" : "Создайте аккаунт"}</h2>
        </div>
        <Button variant="outline" className="rounded-xl" onClick={onBack}>
          Назад
        </Button>
      </div>

      <Card className="mt-4 rounded-2xl border bg-card/70 shadow-sm backdrop-blur">
        <CardContent className="space-y-3 p-6">
          <Input className="rounded-2xl" placeholder="Логин (или email)" value={loginValue} onChange={(e) => setLoginValue(e.target.value)} />
          <Input className="rounded-2xl" placeholder="Пароль" type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
          <Button className="h-11 w-full rounded-2xl" onClick={() => onSubmit(loginValue.trim() || "nikolay")} disabled={!pass.trim()}>
            {mode === "login" ? "Войти" : "Зарегистрироваться"}
          </Button>

          <div className="text-xs text-muted-foreground">
            {mode === "login" ? (
              <>
                Нет аккаунта?{" "}
                <button className="text-amber-600 hover:underline" onClick={onSwap}>
                  Регистрация
                </button>
              </>
            ) : (
              <>
                Уже есть аккаунт?{" "}
                <button className="text-amber-600 hover:underline" onClick={onSwap}>
                  Войти
                </button>
              </>
            )}
          </div>

          <div className="rounded-2xl border bg-muted/15 p-4 text-sm text-muted-foreground">
            <div className="font-semibold text-foreground">Это прототип</div>
            <div className="mt-1">В настоящем проекте будет Laravel Sanctum + API токены.</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MiniKpi({ icon: Icon, title, text }) {
  return (
    <div className="rounded-2xl border bg-muted/15 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl border bg-background/70 p-2 shadow-sm">
          <Icon className="h-4 w-4 text-amber-600" />
        </div>
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-xs text-muted-foreground">{text}</div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, text }) {
  return (
    <Card className="rounded-2xl border bg-card/70 shadow-sm backdrop-blur">
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border bg-background/70 p-2 shadow-sm">
            <Icon className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <div className="text-sm font-semibold">{title}</div>
            <div className="mt-1 text-sm text-muted-foreground">{text}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// -------------------------
// Background
// -------------------------

function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-background" />

      <div
        className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full blur-3xl opacity-70 dark:opacity-50"
        style={{ background: "radial-gradient(circle at 30% 30%, rgba(251,191,36,.22), transparent 60%)" }}
      />
      <div
        className="absolute -right-40 top-10 h-[520px] w-[520px] rounded-full blur-3xl opacity-70 dark:opacity-50"
        style={{ background: "radial-gradient(circle at 70% 30%, rgba(249,115,22,.18), transparent 60%)" }}
      />
      <div
        className="absolute left-1/3 top-1/2 h-[640px] w-[640px] -translate-y-1/2 rounded-full blur-3xl opacity-70 dark:opacity-50"
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(148,163,184,.18), transparent 60%)" }}
      />

      <div
        className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08]"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"140\" height=\"140\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"2\" stitchTiles=\"stitch\"/></filter><rect width=\"140\" height=\"140\" filter=\"url(%23n)\" opacity=\"0.25\"/></svg>')",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.25] dark:opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(148,163,184,.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,.10) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(circle at 25% 20%, black 0%, transparent 60%)",
        }}
      />
    </div>
  );
}

// -------------------------
// Shell (app)
// -------------------------

function BrandMark({ t }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-10 w-10 rounded-2xl shadow-sm" style={{ background: "linear-gradient(135deg, rgba(251,191,36,.95), rgba(249,115,22,.85))" }} />
      <div className="leading-tight">
        <div className="text-sm font-semibold">{t.brand}</div>
        <div className="text-xs text-muted-foreground">рекомендации по оценкам</div>
      </div>
    </div>
  );
}

function AppShell({ t, route, go, theme, setTheme, language, setLanguage, notifications, ratedCount, search, setSearch, suggestions, session, onLogout, children }) {
  const isDetail = route === ROUTES.filmDetail || route === ROUTES.addFilm || route === ROUTES.userProfile;

  return (
    <div>
      <div className="sticky top-0 z-50">
        <div className="border-b bg-background/80 backdrop-blur">
          <div className="mx-auto max-w-[1320px] px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {isDetail ? (
                  <Button variant="outline" className="h-10 rounded-2xl" onClick={() => go(ROUTES.films)} aria-label={t.back}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                ) : null}
                <button onClick={() => go(ROUTES.films)} className="hidden sm:block">
                  <BrandMark t={t} />
                </button>
              </div>

              <div className="relative hidden min-w-0 flex-1 sm:block">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 rounded-2xl pl-9" placeholder={t.searchPh} />
                </div>
                {suggestions.length ? (
                  <div className="absolute left-0 right-0 top-11 z-50 overflow-hidden rounded-2xl border bg-background/95 shadow-lg backdrop-blur">
                    {suggestions.map((s) => (
                      <button
                        key={s.id}
                        className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-muted"
                        onClick={() => {
                          setSearch("");
                          go(ROUTES.filmDetail, s.id);
                        }}
                      >
                        <div className="h-10 w-7 overflow-hidden rounded-xl border">
                          <img src={buildPoster(s)} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold">{s.title}</div>
                          <div className="text-xs text-muted-foreground">{s.year}</div>
                        </div>
                        <div className="ml-auto text-xs text-muted-foreground">Open</div>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-10 rounded-2xl" aria-label={t.notifications}>
                      <Bell className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[340px] rounded-2xl" align="end">
                    <DropdownMenuLabel>{t.notifications}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.slice(0, 3).map((n) => (
                      <DropdownMenuItem key={n.id} className="block">
                        <div className="text-sm font-semibold">{n.title}</div>
                        <div className="text-xs text-muted-foreground">{n.text}</div>
                        <div className="mt-1 text-[11px] text-muted-foreground">{n.time}</div>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => go(ROUTES.notifications)}>{t.notifications}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="outline" className="h-10 rounded-2xl" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={t.theme}>
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-2xl border bg-background/75 px-2 py-1.5 shadow-sm hover:bg-muted/30">
                      <div className="h-10 w-10 overflow-hidden rounded-2xl border">
                        <img src={avatarSvg(session.login || "nikolay")} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="hidden text-left sm:block">
                        <div className="text-sm font-semibold">{session.login || "nikolay"}</div>
                        <div className="text-xs text-muted-foreground">Оценено: {ratedCount}</div>
                      </div>
                      <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[260px] rounded-2xl" align="end">
                    <DropdownMenuLabel>
                      <div className="flex items-center gap-3">
                        <div className="h-16 w-16 overflow-hidden rounded-3xl border shadow-sm">
                          <img src={avatarSvg(session.login || "nikolay")} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{session.login || "nikolay"}</div>
                          <div className="text-xs text-muted-foreground">Оценено: {ratedCount}</div>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <div className="grid grid-cols-2 gap-2 px-2 pb-2">
                      <MiniStat label="Добавленные" value="3" />
                      <MiniStat label="Избранные" value="2" />
                      <MiniStat label="Оценённые" value={String(ratedCount)} />
                      <MiniStat label="Смотреть позже" value="2" />
                    </div>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => go(ROUTES.settings)}>{t.settings}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => go(ROUTES.submissions)}>{t.submissions}</DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <div className="px-2 py-2">
                      <div className="text-xs text-muted-foreground">{t.language}</div>
                      <div className="mt-2">
                        <LanguageSelect value={language} onChange={setLanguage} />
                      </div>
                    </div>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-rose-600" onClick={onLogout}>
                      <LogOut className="mr-2 h-4 w-4" /> {t.logout}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b bg-muted/25 backdrop-blur shadow-sm">
          <div className="mx-auto max-w-[1320px] px-4">
            <div className="flex items-center justify-between gap-3 py-2">
              <div className="hidden items-center gap-1 sm:flex">
                <NavPill active={route === ROUTES.films} onClick={() => go(ROUTES.films)}>
                  {t.films}
                </NavPill>
                <NavPill active={route === ROUTES.recs} onClick={() => go(ROUTES.recs)}>
                  {t.recs}
                </NavPill>
                <NavPill active={route === ROUTES.favorites} onClick={() => go(ROUTES.favorites)}>
                  {t.favorites}
                </NavPill>
                <NavPill active={route === ROUTES.later} onClick={() => go(ROUTES.later)}>
                  {t.later}
                </NavPill>
                <NavPill active={route === ROUTES.myRatings} onClick={() => go(ROUTES.myRatings)}>
                  {t.myRatings}
                </NavPill>
                <NavPill active={route === ROUTES.users} onClick={() => go(ROUTES.users)}>
                  {t.users}
                </NavPill>
              </div>

              <div className="flex items-center gap-2 sm:hidden">
                <button onClick={() => go(ROUTES.films)} className="text-sm font-semibold">
                  {t.brand}
                </button>
              </div>

              <Button variant="outline" className="h-9 rounded-xl" onClick={() => go(ROUTES.publicHome)}>
                На сайт
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1320px] px-4 py-6 pb-24 sm:pb-10">{children}</div>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/85 backdrop-blur sm:hidden">
        <div className="mx-auto max-w-[1320px] px-4">
          <div className="grid grid-cols-5 gap-1 py-2">
            {[
              { key: ROUTES.films, label: t.films, icon: LayoutGrid },
              { key: ROUTES.recs, label: t.recs, icon: Star },
              { key: ROUTES.favorites, label: t.favorites, icon: Heart },
              { key: ROUTES.later, label: t.later, icon: Clock },
              { key: ROUTES.users, label: t.users, icon: UserIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = tab.key === route;
              return (
                <button
                  key={tab.key}
                  onClick={() => go(tab.key)}
                  className={cx(
                    "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs",
                    active ? "bg-muted" : "hover:bg-muted/50"
                  )}
                >
                  <Icon className={cx("h-4 w-4", active ? "text-foreground" : "text-muted-foreground")} />
                  <span className={cx(active ? "text-foreground" : "text-muted-foreground")}>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto max-w-[1320px] px-4 py-6 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>© {t.brand}</div>
            <div className="flex flex-wrap gap-3">
              <button className="hover:text-foreground">О проекте</button>
              <button className="hover:text-foreground">Правила</button>
              <button className="hover:text-foreground">Политика</button>
              <button className="hover:text-foreground">Контакты</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavPill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "relative rounded-2xl px-3 py-2 text-sm transition",
        active ? "bg-background/70 text-foreground shadow-sm" : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
      )}
    >
      {children}
      {active ? (
        <span
          className="absolute -bottom-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full"
          style={{ background: "linear-gradient(90deg, rgba(251,191,36,.95), rgba(249,115,22,.85))" }}
        />
      ) : null}
    </button>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl border bg-muted/20 px-2 py-2">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold tabular-nums">{value}</div>
    </div>
  );
}

// -------------------------
// Screens (app)
// -------------------------

function EmptyState({ onReset }) {
  return (
    <Card className="rounded-2xl border bg-card/70 shadow-sm backdrop-blur">
      <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
        <div className="h-12 w-12 rounded-3xl border bg-muted/30" />
        <div className="text-sm font-semibold">Ничего не найдено</div>
        <div className="text-sm text-muted-foreground">Попробуйте изменить фильтры или очистить поиск.</div>
        <Button variant="outline" className="rounded-xl" onClick={onReset}>
          Сбросить фильтры
        </Button>
      </CardContent>
    </Card>
  );
}

function FilmDetail({ t, film, under18, onBack, onToggleFav, onToggleLater, onSetRating, onClearRating }) {
  const [note, setNote] = useState("");
  const blocked = under18 && film.age18;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">Фильм</div>
          <h2 className="text-2xl font-semibold">{film.title}</h2>
          {film.origTitle ? <div className="text-sm text-muted-foreground">{film.origTitle}</div> : null}
        </div>
        <Button variant="outline" className="rounded-xl" onClick={onBack}>
          {t.back}
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
        <Card className="overflow-hidden rounded-2xl border bg-card/70 shadow-sm backdrop-blur">
          <CardContent className="p-0">
            <div className="relative">
              <Poster film={film} blocked={blocked} />
              <div className="absolute right-3 top-3 flex items-center gap-2">
                <button
                  onClick={() => !blocked && onToggleLater(film.id)}
                  className={cx(
                    "rounded-2xl border bg-background/80 p-2 shadow-sm hover:bg-muted",
                    film.watchLater && "border-amber-500/30"
                  )}
                >
                  <Clock className={cx("h-4 w-4", film.watchLater ? "text-amber-600" : "text-muted-foreground")} />
                </button>
                <button
                  onClick={() => !blocked && onToggleFav(film.id)}
                  className={cx(
                    "rounded-2xl border bg-background/80 p-2 shadow-sm hover:bg-muted",
                    film.favorite && "border-rose-500/30"
                  )}
                >
                  <Heart className={cx("h-4 w-4", film.favorite ? "text-rose-600" : "text-muted-foreground")} />
                </button>
              </div>

              <div className={cx("absolute bottom-3 left-3 right-3", blocked && "blur-[14px]")}>
                <RatingBadge myRating={film.myRating} avgRating={film.avgRating} onSet={(v) => onSetRating(film.id, v)} onClear={() => onClearRating(film.id)} />
              </div>

              {film.age18 ? (
                <div className="absolute left-3 top-3">
                  <Badge className="rounded-xl" variant={blocked ? "destructive" : "secondary"}>
                    18+
                  </Badge>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-2xl border bg-card/70 shadow-sm backdrop-blur">
            <CardContent className="space-y-3 p-5">
              <div className="grid gap-3 md:grid-cols-2">
                <Meta label="Год" value={film.year} />
                <Meta label="Длительность" value={film.duration ? `${film.duration} мин` : "—"} />
                <Meta label="Страны" value={film.countries.join(", ")} />
                <Meta label="Жанры" value={film.genres.join(", ")} />
              </div>
              <Separator />
              <div className="grid gap-3 md:grid-cols-2">
                <MetaLink label="Режиссёр" value={film.director} />
                <Meta label="Средняя" value={`${formatRating(film.avgRating)}/10`} />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border bg-card/70 shadow-sm backdrop-blur">
            <CardHeader className="pb-0">
              <CardTitle className="text-base">Описание</CardTitle>
            </CardHeader>
            <CardContent className={cx("pt-3 text-sm text-muted-foreground", blocked && "blur-[14px]")}>{film.description}</CardContent>
          </Card>

          <Card className="rounded-2xl border bg-card/70 shadow-sm backdrop-blur">
            <CardHeader className="pb-0">
              <CardTitle className="text-base">Моя заметка (приватно)</CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-[140px] w-full resize-none rounded-2xl border bg-background/70 p-3 text-sm outline-none focus:ring-2 focus:ring-amber-500/30"
                placeholder="Почему понравилось/не понравилось, что пересмотреть…"
              />
              <div className="mt-2 text-xs text-muted-foreground">Автосохранение (мок)</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }) {
  return (
    <div className="rounded-2xl border bg-muted/15 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}

function MetaLink({ label, value }) {
  return (
    <button className="rounded-2xl border bg-muted/15 p-3 text-left hover:bg-muted/25">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold underline decoration-muted-foreground/40 underline-offset-2">{value}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">(клик: фильтр)</div>
    </button>
  );
}

function UsersScreen({ t, users, onOpen }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">{t.users}</h2>
        <div className="mt-1 text-sm text-muted-foreground">Отсортировано по совпадению вкусов</div>
      </div>

      <Card className="rounded-2xl border bg-card/70 shadow-sm backdrop-blur">
        <CardContent className="p-0">
          {users
            .slice()
            .sort((a, b) => b.match - a.match)
            .map((u, idx) => (
              <button
                key={u.id}
                onClick={() => onOpen(u.id)}
                className={cx("flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/40", idx !== 0 && "border-t")}
              >
                <div className="h-12 w-12 overflow-hidden rounded-3xl border">
                  <img src={avatarSvg(u.login)} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{u.login}</div>
                  <div className="text-xs text-muted-foreground">Совпадение вкуса</div>
                </div>
                <Badge className="rounded-xl" variant="secondary">
                  {u.match}%
                </Badge>
              </button>
            ))}
        </CardContent>
      </Card>

      <div className="pt-2">
        <Pagination page={1} pages={5} onPage={() => {}} />
      </div>
    </div>
  );
}

function UserProfile({ user, films, onBack, onOpenFilm }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 overflow-hidden rounded-3xl border shadow-sm">
            <img src={avatarSvg(user.login)} alt="" className="h-full w-full object-cover" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Пользователь</div>
            <h2 className="text-2xl font-semibold">{user.login}</h2>
            <div className="mt-1 text-sm text-muted-foreground">
              Совпадение вкуса: <span className="font-semibold text-foreground">{user.match}%</span>
            </div>
          </div>
        </div>
        <Button variant="outline" className="rounded-xl" onClick={onBack}>
          Назад
        </Button>
      </div>

      <Card className="rounded-2xl border bg-card/70 shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle className="text-base">Оценки пользователя</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
            {films.map((f) => (
              <div key={f.id} className="relative">
                <button className="w-full" onClick={() => onOpenFilm(f.id)}>
                  <Card className="overflow-hidden rounded-2xl border bg-card/80 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="relative">
                      <Poster film={f} blocked={false} />
                      <div className="absolute right-3 top-3">
                        <Badge className="rounded-xl" variant="secondary">
                          {f.userRating}/10
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <div className="line-clamp-2 text-sm font-semibold">{f.title}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{f.year}</div>
                    </CardContent>
                  </Card>
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NotificationsScreen({ t, notifications }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">{t.notifications}</h2>
        <div className="mt-1 text-sm text-muted-foreground">История событий</div>
      </div>

      <Card className="rounded-2xl border bg-card/70 shadow-sm backdrop-blur">
        <CardContent className="p-0">
          {notifications.map((n, idx) => (
            <div key={n.id} className={cx("px-4 py-3", idx !== 0 && "border-t")}>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-amber-500" />
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{n.title}</div>
                  <div className="text-sm text-muted-foreground">{n.text}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{n.time}</div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsScreen({ t, theme, setTheme, language, setLanguage }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">{t.settings}</h2>
        <div className="mt-1 text-sm text-muted-foreground">Профиль и интерфейс</div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl border bg-card/70 shadow-sm backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base">Интерфейс</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">{t.theme}</div>
                <div className="text-sm text-muted-foreground">Светлая / тёмная</div>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-muted-foreground" />
                <Switch checked={theme === "dark"} onCheckedChange={(v) => setTheme(v ? "dark" : "light")} />
                <Moon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold">{t.language}</div>
              <div className="mt-2 max-w-[320px]">
                <LanguageSelect value={language} onChange={setLanguage} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border bg-card/70 shadow-sm backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base">Безопасность</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input className="rounded-2xl" placeholder="Новый пароль" type="password" />
            <Input className="rounded-2xl" placeholder="Повторите пароль" type="password" />
            <Button className="rounded-2xl">Сменить пароль</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AddFilmScreen({ onBack, onSubmit }) {
  const [genres, setGenres] = useState([]);
  const [countries, setCountries] = useState([]);
  const [zoom, setZoom] = useState(35);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Добавить фильм</h2>
          <div className="mt-1 text-sm text-muted-foreground">MVP поля + постер с кропом 2:3 (мок)</div>
        </div>
        <Button variant="outline" className="rounded-xl" onClick={onBack}>
          Назад
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
        <Card className="rounded-2xl border bg-card/70 shadow-sm backdrop-blur">
          <CardContent className="space-y-3 p-5">
            <Input className="rounded-2xl" placeholder="Название" />
            <div className="grid gap-3 md:grid-cols-2">
              <Input className="rounded-2xl" placeholder="Год" type="number" />
              <Input className="rounded-2xl" placeholder="Длительность (мин)" type="number" />
            </div>
            <MultiSelect label="Жанры" options={ALL_GENRES} value={genres} onChange={setGenres} />
            <MultiSelect label="Страны" options={ALL_COUNTRIES} value={countries} onChange={setCountries} />
            <textarea
              className="min-h-[140px] w-full resize-none rounded-2xl border bg-background/70 p-3 text-sm outline-none focus:ring-2 focus:ring-amber-500/30"
              placeholder="Описание"
            />
            <div className="text-xs text-muted-foreground">Чем больше заполнено — тем выше шанс одобрения модерацией.</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border bg-card/70 shadow-sm backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base">Постер</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-2xl border bg-muted/15 p-4">
              <div className="text-sm font-semibold">Загрузка</div>
              <div className="mt-1 text-sm text-muted-foreground">Файл + кроп (мок)</div>
              <div className="mt-3 flex gap-2">
                <Button className="rounded-2xl">Загрузить</Button>
                <Button variant="outline" className="rounded-2xl">
                  Выбрать
                </Button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border bg-muted/20">
              <div className="aspect-[2/3]">
                <img
                  src={posterSvg("PREVIEW", "crop editor", "default")}
                  alt=""
                  className="h-full w-full object-cover"
                  style={{ transform: `scale(${1 + zoom / 120})` }}
                />
              </div>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-[86%] w-[78%] rounded-3xl border-2 border-white/60 shadow-[0_0_0_9999px_rgba(0,0,0,0.25)]" />
              </div>
            </div>

            <div className="text-xs text-muted-foreground">Масштаб</div>
            <Slider value={[zoom]} min={0} max={100} step={1} onValueChange={(v) => setZoom(v[0])} />

            <Button className="w-full rounded-2xl" onClick={onSubmit}>
              Отправить на модерацию
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SubmissionsScreen() {
  const rows = [
    { id: "s1", title: "Паразиты", status: "на модерации", date: "сегодня", reason: "" },
    { id: "s2", title: "Джентльмены", status: "одобрено", date: "вчера", reason: "" },
    { id: "s3", title: "Матрица 2069", status: "отклонено", date: "2 дня назад", reason: "Дубликат / неполные данные" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Мои добавленные</h2>
        <div className="mt-1 text-sm text-muted-foreground">Статусы модерации</div>
      </div>

      <Card className="rounded-2xl border bg-card/70 shadow-sm backdrop-blur">
        <CardContent className="p-0">
          {rows.map((r, idx) => (
            <div key={r.id} className={cx("px-4 py-3", idx !== 0 && "border-t")}>
              <div className="flex items-start gap-3">
                <div className="h-14 w-10 overflow-hidden rounded-2xl border">
                  <img src={posterSvg(r.title, "", r.title === "Паразиты" ? "missing" : "default")} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{r.title}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{r.date}</div>
                  {r.reason ? <div className="mt-1 text-xs text-rose-600">Причина: {r.reason}</div> : null}
                </div>
                <Badge className="rounded-xl" variant={r.status === "одобрено" ? "secondary" : r.status === "отклонено" ? "destructive" : "outline"}>
                  {r.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function CookieBanner({ onClose }) {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-[80]">
      <div className="mx-auto max-w-[1320px]">
        <Card className="rounded-2xl border bg-background/90 shadow-lg backdrop-blur">
          <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm">
              <div className="font-semibold">Cookie</div>
              <div className="text-muted-foreground">Мы используем cookie для аналитики и работы сервиса.</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button className="rounded-xl" onClick={onClose}>
                Принять
              </Button>
              <Button variant="outline" className="rounded-xl" onClick={onClose}>
                Настройки
              </Button>
              <Button variant="outline" className="rounded-xl" onClick={onClose}>
                Отклонить
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
