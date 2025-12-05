export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6">
      <div className="max-w-md w-full space-y-4">
        <h1 className="text-3xl font-bold">Вход</h1>
        <p className="text-slate-300">В этой версии показан заглушечный экран авторизации.</p>
        <form className="space-y-3">
          <input className="w-full rounded-md bg-slate-800 p-3" placeholder="Логин или email" />
          <input className="w-full rounded-md bg-slate-800 p-3" placeholder="Пароль" type="password" />
          <button type="button" className="w-full rounded-md bg-white text-slate-900 p-3 font-semibold">Войти</button>
        </form>
      </div>
    </main>
  )
}
