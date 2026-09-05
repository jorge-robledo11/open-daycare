import Link from "next/link";
import AppShell from "@/components/app-shell";

type Kid = {
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

export default function KidsPage() {
  return (
    <AppShell active="kids">
      <div className="mx-auto w-full max-w-[880px] px-5 pb-20 pt-4 md:px-10 md:pt-[34px]">
        <div className="mb-[22px] flex items-end justify-between gap-4">
          <div>
            <div className="mb-1 text-[12.5px] font-extrabold tracking-[0.8px] text-[#D9583C]">GESTIÓN</div>
            <h1 className="m-0 font-fredoka text-[30px] font-semibold text-[#3F362E]">Niños</h1>
          </div>
          <a className="flex items-center gap-2 rounded-[14px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] px-[18px] py-[11px] text-[14.5px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(238,129,100,0.7)]">
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
          </a>
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
            placeholder="Buscar niño…"
            className="flex-1 bg-transparent text-[15px] text-[#3F362E] outline-none"
          />
        </div>

        <div className="mb-[14px] flex items-center gap-3">
          <span className="text-[12.5px] font-extrabold tracking-[0.8px] text-[#3F362E]">SALA SOLES</span>
          <span className="text-[13px] text-[#A89A8B]">8 niños</span>
          <span className="h-px flex-1 bg-[#E7DAC8]" />
        </div>

        <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
          {KIDS.map((kid) => (
            <KidCard key={kid.name} kid={kid} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
