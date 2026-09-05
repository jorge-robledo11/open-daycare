const NAV_ITEMS = [
  {
    label: "Feed",
    active: true,
    icon: (
      <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
    ),
  },
  {
    label: "Niños",
    active: false,
    icon: (
      <>
        <circle cx="9" cy="7" r="3" />
        <circle cx="17" cy="9" r="2.4" />
        <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 20a5 5 0 0 1 5.5-4.9" />
      </>
    ),
  },
  {
    label: "Avisos",
    active: false,
    icon: (
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
    ),
  },
  {
    label: "Mi cuenta",
    active: false,
    icon: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
  },
];

const POSTS = [
  {
    avatar: "M",
    avatarBg: "bg-[#A9D9E8]",
    avatarColor: "text-[#1F7A93]",
    name: "Mateo",
    meta: "14:20 · publicado por vos",
    badgeBg: "bg-[#CFEBD8]",
    badgeDot: "bg-[#3E9B6C]",
    badgeColor: "text-[#3E9B6C]",
    badge: "LOGRO",
    audience: "Para: familia de Mateo",
    body: "¡Usó el orinal solito por primera vez! Estaba feliz de contárselo a todos. Un gran paso.",
    likes: 3,
    comments: 1,
    photo: null,
  },
  {
    avatar: "M",
    avatarBg: "bg-[#A9D9E8]",
    avatarColor: "text-[#1F7A93]",
    name: "Mateo",
    meta: "09:40 · publicado por vos",
    badgeBg: "bg-[#C7E7F1]",
    badgeDot: "bg-[#2E89A6]",
    badgeColor: "text-[#2E89A6]",
    badge: "ACTIVIDAD",
    audience: "Para: familia de Mateo",
    body: "Pintamos con témperas esta mañana. Mateo eligió el azul para todo y se concentró un montón mezclando colores.",
    likes: 5,
    comments: 2,
    photo: "Foto · pintando con témperas",
  },
  {
    avatar: null,
    avatarBg: "bg-[#CCD8F4]",
    avatarColor: "text-[#4E72C8]",
    name: "Anuncio general",
    meta: "07:50 · publicado por vos",
    badgeBg: "bg-[#CCD8F4]",
    badgeDot: "bg-[#4E72C8]",
    badgeColor: "text-[#4E72C8]",
    badge: "ANUNCIO",
    audience: "Para: toda la sala",
    body: "El viernes salimos al parque por la mañana. Recuerden mandar gorra y una botellita de agua.",
    likes: 8,
    comments: 0,
    photo: null,
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#F6ECDF] text-[#3F362E]">
      <aside className="sticky top-0 hidden h-screen w-[248px] flex-none flex-col border-r border-[#ECE0D0] bg-[#FFFDF9] px-4 py-6 md:flex">
        <a className="flex items-center gap-[11px] px-2 pb-[22px] pt-1">
          <div className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-xl bg-[linear-gradient(155deg,#F8C3A8,#F2937A)]">
            <svg
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
          </div>
          <div>
            <div className="font-fredoka text-[17px] font-semibold leading-none text-[#3F362E]">
              OpenDayCare
            </div>
            <div className="mt-[2px] text-[11.5px] text-[#A89A8B]">Sala Soles</div>
          </div>
        </a>

        <a className="mb-[18px] flex w-full items-center justify-center gap-2 rounded-[14px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] px-3 py-3 text-[14.5px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(238,129,100,0.75)]">
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
          Nueva publicación
        </a>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              className={
                item.active
                  ? "flex items-center gap-3 rounded-xl bg-[#FBE3D8] px-3 py-[11px] text-[14.5px] font-extrabold text-[#D9583C]"
                  : "flex items-center gap-3 rounded-xl px-3 py-[11px] text-[14.5px] font-semibold text-[#6E6359]"
              }
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {item.icon}
              </svg>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="mt-[10px] border-t border-[#ECE0D0] pt-[14px]">
          <div className="flex items-center gap-[11px] px-2 py-[6px]">
            <div className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full bg-[#F2937A] font-fredoka text-[16px] font-semibold text-white">
              C
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-extrabold text-[#3F362E]">Caro Giménez</div>
              <div className="text-[12px] text-[#A89A8B]">Maestra · Soles</div>
            </div>
            <a className="flex h-8 w-8 flex-none items-center justify-center rounded-[10px] bg-[#F6ECDF] text-[#94887B]">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
            </a>
          </div>
        </div>
      </aside>

      <main className="h-screen min-w-0 flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#ECE0D0] bg-[#FFFDF9] px-4 py-3 md:hidden">
          <a className="flex items-center gap-2">
            <div className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-[linear-gradient(155deg,#F8C3A8,#F2937A)]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            </div>
            <span className="font-fredoka text-[17px] font-semibold text-[#3F362E]">
              OpenDayCare
            </span>
          </a>
          <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#F2937A] font-fredoka text-[15px] font-semibold text-white">
            C
          </div>
        </header>

        <div className="mx-auto w-full max-w-[760px] px-4 pb-20 pt-4 md:px-10 md:pt-[34px]">
          <div className="mb-6">
            <div className="mb-1 text-[12.5px] font-extrabold tracking-[0.8px] text-[#D9583C]">
              GUARDERÍA · SALA SOLES
            </div>
            <h1 className="m-0 font-fredoka text-[30px] font-semibold text-[#3F362E]">
              Buenas, Caro
            </h1>
            <p className="mt-[5px] text-[14.5px] text-[#94887B]">12 niños · martes 17 jun</p>
          </div>

          <a className="mb-6 flex items-center gap-[14px] rounded-[18px] border border-[#ECE0D0] bg-[#FFFDF9] px-[18px] py-[14px] shadow-[0_4px_14px_-10px_rgba(120,90,60,0.4)]">
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#F2937A] font-fredoka text-[16px] font-semibold text-white">
              C
            </div>
            <span className="flex-1 text-[15px] text-[#A89A8B]">Compartí un momento…</span>
            <span className="flex h-[38px] w-[38px] items-center justify-center rounded-xl bg-[#FBE3D8] text-[#E0654A]">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </span>
          </a>

          <div className="mb-[14px] flex items-center gap-[14px]">
            <span className="text-[12.5px] font-extrabold tracking-[0.8px] text-[#8A7C6D]">
              PUBLICADO HOY
            </span>
            <span className="h-px flex-1 bg-[#E7DAC8]" />
          </div>

          <div className="flex flex-col gap-4">
            {POSTS.map((post) => (
              <article
                key={post.name + post.meta}
                className="rounded-[20px] border border-[#ECE0D0] bg-[#FFFDF9] px-[22px] py-5 shadow-[0_4px_16px_-12px_rgba(120,90,60,0.5)]"
              >
                <div className="mb-[14px] flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 flex-none items-center justify-center rounded-full font-fredoka text-[17px] font-semibold ${post.avatarBg} ${post.avatarColor}`}
                  >
                    {post.avatar ? (
                      post.avatar
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m3 11 18-5v12L3 14v-3zM11.6 16.8a3 3 0 1 1-5.8-1.6" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-fredoka text-[16.5px] font-semibold text-[#3F362E]">
                      {post.name}
                    </div>
                    <div className="text-[12.5px] text-[#A89A8B]">{post.meta}</div>
                  </div>
                  <div
                    className={`flex items-center gap-[7px] rounded-full px-3 py-[6px] ${post.badgeBg}`}
                  >
                    <span className={`h-2 w-2 rounded-full ${post.badgeDot}`} />
                    <span className={`text-[12px] font-extrabold tracking-[0.5px] ${post.badgeColor}`}>
                      {post.badge}
                    </span>
                  </div>
                </div>

                <div className="mb-[10px] text-[12.5px] text-[#A89A8B]">{post.audience}</div>
                <p className="m-0 text-[15.5px] leading-[1.55] text-[#4A4038]">{post.body}</p>

                {post.photo && (
                  <a className="mt-[14px] flex h-[200px] flex-col items-center justify-center gap-2 rounded-[16px] border-[1.5px] border-dashed border-[#DBCDBA] bg-[#F4ECE1] text-[#B0A290]">
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-3.6-3.6a2 2 0 0 0-2.8 0L6 21" />
                    </svg>
                    <span className="text-[13.5px]">{post.photo}</span>
                  </a>
                )}

                <div className="mt-4 flex items-center gap-[18px] border-t border-[#F0E6D8] pt-[14px]">
                  <span className="flex items-center gap-[7px] text-[14px] font-bold text-[#E0654A]">
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="#E0654A"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
                    </svg>
                    {post.likes}
                  </span>
                  <a className="flex items-center gap-[7px] text-[14px] font-bold text-[#94887B]">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
                    </svg>
                    {post.comments}
                  </a>
                  <span className="flex-1" />
                  <a className="text-[14px] font-extrabold text-[#C5503A]">Editar</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}