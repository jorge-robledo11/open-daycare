import Link from "next/link";
import { notFound } from "next/navigation";
import AppShell from "@/components/app-shell";

export default async function KidProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (id !== "mateo-fernandez") {
    notFound();
  }

  return (
    <AppShell active="kids">
      <div className="mx-auto w-full max-w-[820px] px-5 pb-20 pt-4 md:px-10 md:pt-[34px]">
        <Link
          href="/kids"
          className="mb-5 flex items-center gap-[7px] text-[14px] font-bold text-[#94887B]"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Volver a Niños
        </Link>

        <div className="flex flex-wrap items-start gap-[26px]">
          <div className="flex min-w-[300px] flex-1 flex-col gap-[18px]">
            <div className="flex items-center gap-[18px]">
              <div className="flex h-[84px] w-[84px] flex-none items-center justify-center rounded-full bg-[#A9D9E8] font-fredoka text-[34px] font-semibold text-[#1F7A93]">
                M
              </div>
              <div className="flex-1">
                <h1 className="m-0 font-fredoka text-[28px] font-semibold text-[#3F362E]">
                  Mateo Fernández
                </h1>
                <p className="mt-[3px] text-[15px] text-[#94887B]">3 años · Sala Soles</p>
              </div>
              <a className="rounded-xl border-[1.5px] border-[#ECE0D0] bg-[#FFFDF9] px-4 py-[9px] text-[14px] font-bold text-[#6E6359]">
                Editar
              </a>
            </div>

            <div className="flex gap-[14px] rounded-[16px] bg-[#FBDAD6] px-[18px] py-4">
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-[11px] bg-[#F4A8A0]">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
                  <path d="M12 9v4M12 17h.01" />
                </svg>
              </div>
              <div>
                <div className="mb-[2px] text-[15px] font-extrabold text-[#C5413A]">Alergias y notas</div>
                <div className="text-[14.5px] leading-[1.5] text-[#B25249]">
                  Alergia al maní. Evitar frutos secos. Lleva inhalador en la mochila.
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[16px] border border-[#ECE0D0] bg-[#FFFDF9]">
              <div className="flex justify-between border-b border-[#F0E6D8] px-[18px] py-[15px]">
                <span className="text-[14.5px] text-[#94887B]">Fecha de nacimiento</span>
                <span className="text-[14.5px] font-extrabold text-[#3F362E]">12 mar 2022</span>
              </div>
              <div className="flex justify-between border-b border-[#F0E6D8] px-[18px] py-[15px]">
                <span className="text-[14.5px] text-[#94887B]">Sala</span>
                <span className="text-[14.5px] font-extrabold text-[#3F362E]">Soles</span>
              </div>
              <div className="flex justify-between px-[18px] py-[15px]">
                <span className="text-[14.5px] text-[#94887B]">Ingreso</span>
                <span className="text-[14.5px] font-extrabold text-[#3F362E]">feb 2025</span>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-none flex-col gap-[14px] md:w-[300px]">
            <a className="flex w-full items-center justify-center gap-[9px] rounded-[14px] bg-[#3F362E] px-[13px] py-[13px] text-[15px] font-extrabold text-white">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
              Resumen del día
            </a>
            <div className="rounded-[16px] border border-[#ECE0D0] bg-[#FFFDF9] px-[18px] py-4">
              <div className="mb-[14px] text-[12.5px] font-extrabold tracking-[0.8px] text-[#8A7C6D]">
                PADRES VINCULADOS
              </div>
              <div className="flex flex-col gap-[14px]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#C9B6E8] font-fredoka text-[16px] font-semibold text-white">
                    L
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[14.5px] font-extrabold text-[#3F362E]">Lucía Fernández</div>
                    <div className="text-[12.5px] text-[#A89A8B]">Mamá · activa</div>
                  </div>
                  <span className="flex-none rounded-full bg-[#CFEBD8] px-[9px] py-[4px] text-[10.5px] font-extrabold text-[#3E9B6C]">
                    ACTIVA
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#A9C7E8] font-fredoka text-[16px] font-semibold text-white">
                    D
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[14.5px] font-extrabold text-[#3F362E]">Diego Fernández</div>
                    <div className="text-[12.5px] text-[#A89A8B]">Papá · invitación enviada</div>
                  </div>
                  <span className="flex-none rounded-full bg-[#F7E7A6] px-[9px] py-[4px] text-[10.5px] font-extrabold text-[#9A7B1E]">
                    PENDIENTE
                  </span>
                </div>
                <a className="flex items-center gap-3 pt-2">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full border-[1.5px] border-dashed border-[#D8CBBA] text-[#B0A290]">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                  <span className="text-[14.5px] font-extrabold text-[#C5503A]">Vincular otro padre</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
