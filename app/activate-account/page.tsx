"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ActivateAccountPage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FBF4EC] p-6 leading-[normal] text-[#3F362E] md:p-10">
      <div className="w-full max-w-[440px]">
        <div className="mb-[22px] flex h-[58px] w-[58px] items-center justify-center rounded-[18px] bg-[linear-gradient(155deg,#F8C3A8,#F2937A)] text-white shadow-[0_12px_26px_-10px_rgba(238,129,100,0.65)]">
          <svg
            aria-hidden="true"
            width="30"
            height="30"
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

        <h1 className="mb-2 font-fredoka text-[32px] font-semibold leading-[1.15]">
          Bienvenida a OpenDayCare
        </h1>
        <p className="mb-[26px] text-[15.5px] leading-[1.55] text-[#94887B]">
          Te invitaron a seguir el día de tu hijo. Creá tu contraseña para activar
          la cuenta.
        </p>

        <div className="mb-[22px] flex items-center gap-[14px] rounded-2xl border-[1.5px] border-[#EADFD0] bg-white px-4 py-[14px]">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#A9D9E8] font-fredoka text-[19px] font-semibold text-[#1F7A93]">
            M
          </div>
          <div>
            <div className="text-[13px] text-[#94887B]">
              Te invitaron a seguir a
            </div>
            <div className="font-fredoka text-[17px] font-semibold">
              Mateo · Sala Soles
            </div>
          </div>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            router.push("/");
          }}
        >
          <label htmlFor="invitationCode" className="mb-2 block text-xs font-bold tracking-[0.7px] text-[#94887B]">
            CÓDIGO DE INVITACIÓN
          </label>
          <input
            id="invitationCode"
            name="invitationCode"
            type="text"
            defaultValue="7K4P9"
            required
            className="mb-[18px] w-full rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white px-4 py-[14px] font-fredoka text-lg font-bold tracking-[3px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5503A]"
          />
          <label htmlFor="email" className="mb-2 block text-xs font-bold tracking-[0.7px] text-[#94887B]">
            EMAIL
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            defaultValue="lucia.fernandez@gmail.com"
            required
            className="mb-[18px] w-full rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white px-4 py-[14px] text-[15px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5503A]"
          />
          <label htmlFor="password" className="mb-2 block text-xs font-bold tracking-[0.7px] text-[#94887B]">
            CREAR CONTRASEÑA
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="mb-[18px] w-full rounded-[14px] border-[1.5px] border-[#F2A78E] bg-white px-4 py-[14px] text-[15px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5503A]"
          />

          <label className="mb-6 flex cursor-pointer items-start gap-3 rounded-[14px] bg-[#FBF1D6] px-4 py-[14px]">
            <span className="relative mt-px flex h-6 w-6 shrink-0">
              <input
                name="photoConsent"
                type="checkbox"
                className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-[1.5px] border-[#8A7234] bg-white checked:border-[#5FB97E] checked:bg-[#5FB97E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5503A]"
              />
              <svg
                aria-hidden="true"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-none absolute left-[4.5px] top-[4.5px] hidden peer-checked:block"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span className="text-sm leading-[1.45] text-[#8A7234]">
              Autorizo a la guardería a tomar y compartir fotos de mi hijo dentro
              de la app.
            </span>
          </label>

          <button
            type="submit"
            className="block w-full cursor-pointer rounded-[15px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] p-[15px] text-center text-base font-extrabold text-white shadow-[0_10px_22px_-8px_rgba(238,129,100,0.7)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5503A]"
          >
            Activar mi cuenta
          </button>
        </form>

        <p className="mt-[22px] text-center text-[14.5px] text-[#94887B]">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" style={{ color: "#C5503A" }} className="font-extrabold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5503A]">
            Iniciar sesión
          </Link>
        </p>
        <p className="mt-4 text-center text-xs leading-relaxed text-[#94887B]">
          Demo: no se verifican credenciales ni se guardan datos
        </p>
      </div>
    </main>
  );
}
