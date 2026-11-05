"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="grid min-h-screen grid-rows-[auto_1fr] bg-[#FBF4EC] leading-[normal] text-[#3F362E] md:grid-cols-[1.05fr_1fr] md:grid-rows-1">
      <div className="relative flex flex-col justify-between overflow-hidden bg-[linear-gradient(155deg,#F6A98E_0%,#F2937A_45%,#EC7E62_100%)] p-6 text-white md:px-[60px] md:py-14">
        <div aria-hidden="true" className="absolute -right-[120px] -top-[140px] h-[420px] w-[420px] rounded-full bg-white/[0.12]" />
        <div aria-hidden="true" className="absolute -bottom-[110px] -left-20 h-[300px] w-[300px] rounded-full bg-white/10" />

        <div className="relative flex items-center gap-[13px]">
          <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[14px] bg-white/[0.22]">
            <svg
              aria-hidden="true"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
          </div>
          <span className="font-fredoka text-[21px] font-semibold tracking-[0.5px]">
            OpenDayCare
          </span>
        </div>

        <div className="relative hidden md:block">
          <h2 className="mb-[18px] font-fredoka text-[42px] font-semibold leading-[1.12]">
            El día de cada niño,<br />compartido con su familia.
          </h2>
          <p className="max-w-[430px] text-[17px] leading-[1.6] text-white/[0.92]">
            Publicá momentos, gestioná las salas y mantené a las familias cerca,
            desde un solo lugar.
          </p>
        </div>

        <div className="relative hidden text-sm text-white/90 md:block">
          🌿 Guardería Sala Soles
        </div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-[392px]">
          <h1 className="mb-[6px] font-fredoka text-[30px] font-semibold">
            Iniciar sesión
          </h1>
          <p className="mb-7 text-[15px] text-[#94887B]">
            Ingresá para ver el día de hoy.
          </p>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              router.push("/");
            }}
          >
            <label htmlFor="email" className="mb-2 block text-xs font-bold tracking-[0.7px] text-[#94887B]">
              EMAIL
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              className="mb-[18px] w-full rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white px-4 py-[14px] text-[15px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5503A]"
            />
            <label htmlFor="password" className="mb-2 block text-xs font-bold tracking-[0.7px] text-[#94887B]">
              CONTRASEÑA
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              required
              className="mb-[10px] w-full rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white px-4 py-[14px] text-[15px] placeholder:text-[#B6A99B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5503A]"
            />
            <div className="mb-5 text-right">
              <span className="text-[13.5px] font-bold text-[#C5503A]">
                ¿Olvidaste tu contraseña?
              </span>
            </div>
            <button
              type="submit"
              className="block w-full cursor-pointer rounded-[15px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] p-[15px] text-center text-base font-extrabold text-white shadow-[0_10px_22px_-8px_rgba(238,129,100,0.7)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5503A]"
            >
              Iniciar sesión
            </button>
          </form>

          <p className="mt-6 text-center text-[14.5px] text-[#94887B]">
            ¿Te invitó la guardería?{" "}
            <Link href="/activate-account" style={{ color: "#C5503A" }} className="font-extrabold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5503A]">
              Activá tu cuenta
            </Link>
          </p>
          <p className="mt-4 text-center text-xs leading-relaxed text-[#94887B]">
            Demo: no se verifican credenciales ni se guardan datos
          </p>
        </div>
      </div>
    </main>
  );
}
