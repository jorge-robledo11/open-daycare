"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/app-shell";

type Kid = {
  id?: string;
  initial: string;
  avatarBg: string;
  avatarColor: string;
  name: string;
  meta: string;
  badge?: { bg: string; color: string; label: string };
  href?: string;
};

const KIDS: Kid[] = [
  {
    initial: "M",
    avatarBg: "bg-[#A9D9E8]",
    avatarColor: "text-[#1F7A93]",
    name: "Mateo Fernández",
    meta: "3 años · 2 padres vinculados",
    badge: { bg: "bg-[#FBD8CC]", color: "text-[#D9684A]", label: "MANÍ" },
    href: "/kids/mateo-fernandez",
  },
  {
    initial: "S",
    avatarBg: "bg-[#F4B8CC]",
    avatarColor: "text-[#C44A7A]",
    name: "Sofía Méndez",
    meta: "2 años · 1 padre vinculado",
  },
  {
    initial: "B",
    avatarBg: "bg-[#B9DEC4]",
    avatarColor: "text-[#3E8B62]",
    name: "Benjamín Ruiz",
    meta: "3 años · 2 padres vinculados",
  },
  {
    initial: "V",
    avatarBg: "bg-[#F4DC8E]",
    avatarColor: "text-[#9A7B1E]",
    name: "Valentina Soto",
    meta: "2 años · sin padres vinculados",
    badge: { bg: "bg-[#F9D2DE]", color: "text-[#C56486]", label: "VINCULAR" },
  },
  {
    initial: "T",
    avatarBg: "bg-[#C9B6E8]",
    avatarColor: "text-[#7B5FC0]",
    name: "Tomás Díaz",
    meta: "3 años · 1 padre vinculado",
    badge: { bg: "bg-[#FBD8CC]", color: "text-[#D9684A]", label: "LACTOSA" },
  },
  {
    initial: "E",
    avatarBg: "bg-[#F4B8CC]",
    avatarColor: "text-[#C44A7A]",
    name: "Emma Castro",
    meta: "2 años · 1 padre vinculado",
  },
  {
    initial: "L",
    avatarBg: "bg-[#A9D9E8]",
    avatarColor: "text-[#1F7A93]",
    name: "Lucas Romero",
    meta: "3 años · 1 padre vinculado",
  },
  {
    initial: "O",
    avatarBg: "bg-[#B9DEC4]",
    avatarColor: "text-[#3E8B62]",
    name: "Olivia Vega",
    meta: "2 años · 1 padre vinculado",
  },
];

const CARD_CLASSES =
  "flex items-center gap-[14px] min-w-0 rounded-[18px] border border-[#ECE0D0] bg-[#FFFDF9] p-4 shadow-[0_4px_14px_-12px_rgba(120,90,60,0.5)]";

function KidCard({ kid }: { kid: Kid }) {
  const inner = (
    <>
      <div
        className={`flex h-12 w-12 flex-none items-center justify-center rounded-full font-fredoka text-[19px] font-semibold ${kid.avatarBg} ${kid.avatarColor}`}
      >
        {kid.initial}
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-fredoka text-[16px] font-semibold text-[#3F362E]">{kid.name}</div>
        <div className="text-[13px] text-[#A89A8B]">{kid.meta}</div>
      </div>
      {kid.badge ? (
        <span
          className={`flex-none rounded-full px-[9px] py-[5px] text-[11px] font-extrabold ${kid.badge.bg} ${kid.badge.color}`}
        >
          {kid.badge.label}
        </span>
      ) : (
        <svg
          className="flex-none"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#CBB89F"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      )}
    </>
  );

  if (kid.href) {
    return (
      <Link href={kid.href} className={`${CARD_CLASSES} transition hover:-translate-y-0.5 hover:border-[#F2A78E]`}>
        {inner}
      </Link>
    );
  }
  return <div className={CARD_CLASSES}>{inner}</div>;
}

function normalizeName(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

export default function KidsPage() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const [addedKids, setAddedKids] = useState<Kid[]>([]);
  const normalizedQuery = normalizeName(query);
  const filteredKids = [...KIDS, ...addedKids].filter((kid) => normalizeName(kid.name).includes(normalizedQuery));

  function closeModal() {
    dialogRef.current?.querySelector("form")?.reset();
    dialogRef.current?.close();
  }

  return (
    <AppShell active="kids">
      <div className="mx-auto w-full max-w-[880px] px-5 pb-20 pt-4 leading-[normal] md:px-10 md:pt-[34px]">
        <div className="mb-[22px] flex items-end justify-between gap-4">
          <div>
            <div className="mb-1 text-[12.5px] font-extrabold tracking-[0.8px] text-[#D9583C]">GESTIÓN</div>
            <h1 className="m-0 font-fredoka text-[30px] font-semibold text-[#3F362E]">Niños</h1>
          </div>
          <button
            type="button"
            onClick={() => {
              const dialog = dialogRef.current;
              if (!dialog) return;
              const today = new Date();
              const dateInput = dialog.querySelector<HTMLInputElement>("[name=birthDate]");
              if (dateInput) {
                dateInput.max = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
              }
              dialog.showModal();
              dialog.querySelector<HTMLInputElement>("[name=name]")?.focus();
            }}
            className="flex cursor-pointer items-center gap-2 rounded-[14px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] px-[18px] py-[11px] text-[14.5px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(238,129,100,0.7)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D9583C]"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Agregar niño
          </button>
        </div>

        <div className="mb-[22px] flex items-center gap-[11px] rounded-[14px] border border-[#ECE0D0] bg-[#FFFDF9] px-4 py-3">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#B0A290"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            aria-label="Buscar niño"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar niño…"
            className="min-w-0 flex-1 bg-transparent px-0.5 py-px text-[15px] text-[#3F362E] outline-none placeholder:text-[#B6A99B] focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-4 focus-visible:outline-[#D9583C]"
          />
        </div>

        <div className="mb-[14px] flex items-center gap-3">
          <span className="text-[12.5px] font-extrabold tracking-[0.8px] text-[#3F362E]">SALA SOLES</span>
          <span aria-live="polite" className="text-[13px] text-[#A89A8B]">
            {filteredKids.length} {filteredKids.length === 1 ? "niño" : "niños"}
          </span>
          <span className="h-px flex-1 bg-[#E7DAC8]" />
        </div>

        <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
          {filteredKids.map((kid) => (
            <KidCard key={kid.id ?? kid.name} kid={kid} />
          ))}
        </div>
        {filteredKids.length === 0 && (
          <p className="text-[15px] text-[#6E6359]">No se encontraron niños</p>
        )}
      </div>
      <dialog
        ref={dialogRef}
        aria-labelledby="add-kid-title"
        aria-describedby="add-kid-demo"
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls = event.currentTarget.querySelectorAll<HTMLElement>("button, input");
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
        onCancel={(event) => {
          event.preventDefault();
          closeModal();
        }}
        className="m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-[520px] overflow-y-auto rounded-[24px] border border-[#ECE0D0] bg-[#FBF4EC] p-0 text-[#3F362E] shadow-[0_20px_50px_-24px_rgba(63,54,46,0.35)] backdrop:bg-[#3F362E]/40"
      >
        <form onSubmit={(event) => {
          event.preventDefault();
          const form = event.currentTarget;
          if (!form.reportValidity()) return;
          const data = new FormData(form);
          const name = String(data.get("name") ?? "").trim();
          const [year, month, day] = String(data.get("birthDate")).split("-").map(Number);
          const today = new Date();
          const birthdayPending = today.getMonth() + 1 < month ||
            (today.getMonth() + 1 === month && today.getDate() < day);
          const age = today.getFullYear() - year - Number(birthdayPending);
          const kid: Kid = {
            id: crypto.randomUUID(),
            name,
            initial: Array.from(name)[0].toUpperCase(),
            avatarBg: "bg-[#A9D9E8]",
            avatarColor: "text-[#1F7A93]",
            meta: `${age} ${age === 1 ? "año" : "años"} · sin padres vinculados`,
          };
          setAddedKids((previous) => [...previous, kid]);
          closeModal();
        }}>
          <div className="flex items-center justify-between gap-3 border-b border-[#ECE0D0] px-5 py-5 sm:px-[26px]">
            <button type="button" onClick={closeModal} className="cursor-pointer text-[15px] font-bold text-[#94887B] focus-visible:outline-2 focus-visible:outline-[#D9583C]">
              Cancelar
            </button>
            <h2 id="add-kid-title" className="font-fredoka text-[18px] font-semibold">Agregar niño</h2>
            <button type="submit" className="cursor-pointer text-[15px] font-extrabold text-[#D9583C] focus-visible:outline-2 focus-visible:outline-[#D9583C]">
              Guardar
            </button>
          </div>
          <div className="px-5 py-6 sm:px-[26px]">
            <label htmlFor="kid-name" className="mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]">NOMBRE COMPLETO</label>
            <input
              id="kid-name"
              name="name"
              required
              pattern={".*\\S.*"}
              title="Ingresá un nombre que no esté compuesto solo por espacios."
              placeholder="Ej. Martina López"
              className="mb-[18px] w-full rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white px-4 py-[13px] text-[15px] placeholder:text-[#B6A99B] focus-visible:outline-2 focus-visible:outline-[#D9583C]"
            />
            <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2">
              <div className="min-w-0">
                <label htmlFor="kid-birth-date" className="mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]">FECHA DE NACIMIENTO</label>
                <input id="kid-birth-date" name="birthDate" type="date" required className="min-w-0 w-full rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white px-4 py-[13px] text-[15px] focus-visible:outline-2 focus-visible:outline-[#D9583C]" />
              </div>
              <div>
                <label htmlFor="kid-room" className="mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]">SALA</label>
                <input id="kid-room" value="Soles" readOnly className="w-full rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white px-4 py-[13px] text-[15px] font-bold focus-visible:outline-2 focus-visible:outline-[#D9583C]" />
              </div>
            </div>
            <p id="add-kid-demo" className="mt-[18px] text-[13px] text-[#94887B]">Demo temporal: los niños agregados se descartan al salir o recargar esta pantalla.</p>
          </div>
        </form>
      </dialog>
    </AppShell>
  );
}
