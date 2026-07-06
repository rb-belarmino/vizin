"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginSchemaType, RegisterSchema, RegisterSchemaType } from "@/actions/schemas/auth-schema";
import { loginAction, registerAction } from "@/actions/auth-actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const router = useRouter();

  const loginForm = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    defaultValues: { fullName: "", email: "", password: "", apartmentId: 0 },
  });

  const onLoginSubmit = async (data: LoginSchemaType) => {
    setError(null);
    const result = await loginAction(data);
    if (result.error) {
      setError(result.error);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const onRegisterSubmit = async (data: RegisterSchemaType) => {
    setError(null);
    setSuccessMsg(null);
    const result = await registerAction(data);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccessMsg("Conta criada! Agora faça login para continuar.");
      setIsLogin(true);
      loginForm.setValue("email", data.email);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-violet-500/20 blur-3xl" />
      </div>

      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-3 relative animate-slide-up">
        <a href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
            <span className="text-white text-base font-black">V</span>
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">Vizin</span>
        </a>
        <p className="text-indigo-300 text-sm text-center max-w-xs">
          {isLogin
            ? "Acesse sua conta para gerenciar seus serviços"
            : "Crie sua conta e comece a oferecer serviços aos vizinhos"}
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md glass rounded-2xl p-7 shadow-2xl animate-scale-in relative">
        {/* Tabs */}
        <div className="flex rounded-xl bg-white/5 p-1 mb-6 gap-1">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(null); setSuccessMsg(null); }}
            id="tab-login"
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              isLogin
                ? "bg-white text-gray-900 shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(null); setSuccessMsg(null); }}
            id="tab-register"
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              !isLogin
                ? "bg-white text-gray-900 shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
          >
            Criar conta
          </button>
        </div>

        {/* Feedback messages */}
        {error && (
          <div className="mb-4 rounded-xl bg-red-500/15 border border-red-500/30 px-4 py-3 text-sm text-red-300 animate-fade-in">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-4 py-3 text-sm text-emerald-300 animate-fade-in">
            {successMsg}
          </div>
        )}

        {isLogin ? (
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4" id="login-form">
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="block text-xs font-semibold text-white/80 uppercase tracking-wide">
                E-mail
              </label>
              <input
                {...loginForm.register("email")}
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/35 text-sm outline-none focus:ring-2 focus:ring-white/30 transition-all"
              />
              {loginForm.formState.errors.email && (
                <span className="text-xs text-red-400">{loginForm.formState.errors.email.message}</span>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="login-password" className="block text-xs font-semibold text-white/80 uppercase tracking-wide">
                Senha
              </label>
              <input
                {...loginForm.register("password")}
                id="login-password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/35 text-sm outline-none focus:ring-2 focus:ring-white/30 transition-all"
              />
              <div className="flex justify-end mt-2">
                <Link href="/forgot-password" className="text-xs text-indigo-300 hover:text-white transition-colors">
                  Esqueceu a senha?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              id="login-submit-btn"
              disabled={loginForm.formState.isSubmitting}
              className="w-full py-2.5 rounded-xl brand-gradient text-white font-semibold text-sm shadow-lg hover:opacity-90 disabled:opacity-50 transition-opacity mt-2 flex items-center justify-center gap-2"
            >
              {loginForm.formState.isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4" id="register-form">
            <div className="space-y-1.5">
              <label htmlFor="register-fullname" className="block text-xs font-semibold text-white/80 uppercase tracking-wide">
                Nome completo
              </label>
              <input
                {...registerForm.register("fullName")}
                id="register-fullname"
                type="text"
                autoComplete="name"
                placeholder="João Silva"
                className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/35 text-sm outline-none focus:ring-2 focus:ring-white/30 transition-all"
              />
              {registerForm.formState.errors.fullName && (
                <span className="text-xs text-red-400">{registerForm.formState.errors.fullName.message}</span>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="register-email" className="block text-xs font-semibold text-white/80 uppercase tracking-wide">
                E-mail
              </label>
              <input
                {...registerForm.register("email")}
                id="register-email"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/35 text-sm outline-none focus:ring-2 focus:ring-white/30 transition-all"
              />
              {registerForm.formState.errors.email && (
                <span className="text-xs text-red-400">{registerForm.formState.errors.email.message}</span>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="register-password" className="block text-xs font-semibold text-white/80 uppercase tracking-wide">
                Senha
              </label>
              <input
                {...registerForm.register("password")}
                id="register-password"
                type="password"
                autoComplete="new-password"
                placeholder="Mínimo 6 caracteres"
                className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/35 text-sm outline-none focus:ring-2 focus:ring-white/30 transition-all"
              />
              {registerForm.formState.errors.password && (
                <span className="text-xs text-red-400">{registerForm.formState.errors.password.message}</span>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="register-apartment" className="block text-xs font-semibold text-white/80 uppercase tracking-wide">
                Número do apartamento
              </label>
              <input
                {...registerForm.register("apartmentId")}
                id="register-apartment"
                type="number"
                placeholder="Ex: 101"
                className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/35 text-sm outline-none focus:ring-2 focus:ring-white/30 transition-all"
              />
              {registerForm.formState.errors.apartmentId && (
                <span className="text-xs text-red-400">{registerForm.formState.errors.apartmentId.message}</span>
              )}
            </div>

            <button
              type="submit"
              id="register-submit-btn"
              disabled={registerForm.formState.isSubmitting}
              className="w-full py-2.5 rounded-xl brand-gradient text-white font-semibold text-sm shadow-lg hover:opacity-90 disabled:opacity-50 transition-opacity mt-2 flex items-center justify-center gap-2"
            >
              {registerForm.formState.isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Criar conta"
              )}
            </button>
          </form>
        )}
      </div>

      {/* Back link */}
      <a
        href="/"
        id="back-to-catalog-link"
        className="mt-6 text-sm text-white/50 hover:text-white/80 transition-colors relative"
      >
        ← Voltar ao catálogo
      </a>
    </div>
  );
}
