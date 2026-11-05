"use client";

import { useRef, useState } from "react";

const RELATIONSHIPS = { mother: "Mamá", father: "Papá", guardian: "Tutor/a" };
const DEMO_NOTICE = "Demo: no se envían correos; el código y su vencimiento son ilustrativos. Los datos se descartan al recargar o salir del perfil";

type Parent = {
  id: string;
  name: string;
  email: string;
  relationship: keyof typeof RELATIONSHIPS;
};

export default function LinkedParents() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [addedParents, setAddedParents] = useState<Parent[]>([]);

  function closeModal() {
    dialogRef.current?.querySelector("form")?.reset();
    dialogRef.current?.close();
    triggerRef.current?.focus();
  }

  return (
    <>
      <section aria-labelledby="linked-parents-title" className="rounded-[16px] border border-[#ECE0D0] bg-[#FFFDF9] px-[18px] py-4">
        <h2 id="linked-parents-title" className="mb-[14px] text-[12.5px] font-extrabold tracking-[0.8px] text-[#8A7C6D]">PADRES VINCULADOS</h2>
        <div className="flex flex-col gap-[14px]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#C9B6E8] font-fredoka text-[16px] font-semibold text-white">L</div>
            <div className="min-w-0 flex-1">
              <div className="text-[14.5px] font-extrabold text-[#3F362E]">Lucía Fernández</div>
              <div className="text-[12.5px] text-[#A89A8B]">Mamá · activa</div>
            </div>
            <span className="flex-none rounded-full bg-[#CFEBD8] px-[9px] py-[4px] text-[10.5px] font-extrabold text-[#3E9B6C]">ACTIVA</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#A9C7E8] font-fredoka text-[16px] font-semibold text-white">D</div>
            <div className="min-w-0 flex-1">
              <div className="text-[14.5px] font-extrabold text-[#3F362E]">Diego Fernández</div>
              <div className="text-[12.5px] text-[#A89A8B]">Papá · invitación enviada</div>
            </div>
            <span className="flex-none rounded-full bg-[#F7E7A6] px-[9px] py-[4px] text-[10.5px] font-extrabold text-[#9A7B1E]">PENDIENTE</span>
          </div>
          {addedParents.map((parent) => (
            <div key={parent.id} className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#A9C7E8] font-fredoka text-[16px] font-semibold text-white">{Array.from(parent.name)[0].toUpperCase()}</div>
              <div className="min-w-0 flex-1">
                <div className="break-words text-[14.5px] font-extrabold text-[#3F362E]">{parent.name}</div>
                <div className="text-[12.5px] text-[#A89A8B]">{RELATIONSHIPS[parent.relationship]} · invitación enviada</div>
              </div>
              <span className="flex-none rounded-full bg-[#F7E7A6] px-[9px] py-[4px] text-[10.5px] font-extrabold text-[#9A7B1E]">PENDIENTE</span>
            </div>
          ))}
          <button ref={triggerRef} type="button" onClick={() => {
            const dialog = dialogRef.current;
            if (!dialog) return;
            dialog.querySelector("form")?.reset();
            dialog.showModal();
            dialog.querySelector<HTMLInputElement>("[name=name]")?.focus();
          }} className="flex cursor-pointer items-center gap-3 pt-2 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D9583C]">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full border-[1.5px] border-dashed border-[#D8CBBA] text-[#B0A290]">
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
            </span>
            <span className="text-[14.5px] font-extrabold text-[#C5503A]">Vincular otro padre</span>
          </button>
        </div>
        <p className="mt-[14px] text-[13px] text-[#94887B]">{DEMO_NOTICE}</p>
      </section>
      <dialog ref={dialogRef} aria-labelledby="link-parent-title" aria-describedby="link-parent-demo" onCancel={(event) => {
        event.preventDefault();
        closeModal();
      }} onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = event.currentTarget.querySelectorAll<HTMLElement>("button, input:not([type=radio]), input[type=radio]:checked");
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }} className="m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-[480px] overflow-y-auto rounded-[24px] border border-[#ECE0D0] bg-[#FBF4EC] p-0 leading-[normal] text-[#3F362E] shadow-[0_20px_50px_-24px_rgba(63,54,46,0.35)] backdrop:bg-[#3F362E]/40">
        <div className="flex items-center justify-between border-b border-[#ECE0D0] px-[26px] py-5">
          <div>
            <h2 id="link-parent-title" className="font-fredoka text-[18px] font-semibold">Vincular padre</h2>
            <p className="text-[13px] text-[#A89A8B]">a Mateo Fernández</p>
          </div>
          <button type="button" aria-label="Cerrar" onClick={closeModal} className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[10px] bg-[#F0E6D8] text-[#94887B] focus-visible:outline-2 focus-visible:outline-[#D9583C]">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <form className="px-[26px] py-[22px]" onSubmit={(event) => {
          event.preventDefault();
          const form = event.currentTarget;
          if (!form.reportValidity()) return;
          const data = new FormData(form);
          const relationship = data.get("relationship");
          if (relationship !== "mother" && relationship !== "father" && relationship !== "guardian") return;
          const parent: Parent = {
            id: crypto.randomUUID(),
            name: String(data.get("name") ?? "").trim(),
            email: String(data.get("email") ?? "").trim(),
            relationship,
          };
          setAddedParents((previous) => [...previous, parent]);
          closeModal();
        }}>
          <div className="mb-5 flex gap-[11px] rounded-[14px] bg-[#E3ECFB] px-4 py-[13px]">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4E72C8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-px flex-none"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
            <span className="text-[13.5px] leading-[1.45] text-[#3F5694]">Le enviaremos un correo con un código para que active su cuenta. Solo verá el feed de Mateo.</span>
          </div>
          <label htmlFor="parent-name" className="mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]">NOMBRE DEL PADRE/MADRE</label>
          <input id="parent-name" name="name" required pattern={".*\\S.*"} title="Ingresá un nombre que no esté compuesto solo por espacios." placeholder="Ej. Diego Fernández" className="mb-[18px] w-full rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white px-4 py-[13px] text-[15px] placeholder:text-[#B6A99B] focus-visible:outline-2 focus-visible:outline-[#D9583C]" />
          <label htmlFor="parent-email" className="mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]">EMAIL</label>
          <input id="parent-email" name="email" type="email" required placeholder="correo@ejemplo.com" className="mb-[18px] w-full rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white px-4 py-[13px] text-[15px] placeholder:text-[#B6A99B] focus-visible:outline-2 focus-visible:outline-[#D9583C]" />
          <fieldset className="mb-5">
            <legend className="mb-[10px] text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]">PARENTESCO</legend>
            <div className="flex gap-[9px]">
              {Object.entries(RELATIONSHIPS).map(([value, label]) => (
                <label key={value} className="min-w-0 flex-1 cursor-pointer">
                  <input type="radio" name="relationship" value={value} defaultChecked={value === "mother"} className="peer sr-only" />
                  <span className="block rounded-full border-[1.5px] border-[#ECE0D0] bg-[#FFFDF9] p-[11px] text-center text-[14px] font-extrabold text-[#6E6359] peer-checked:border-[#9FB8EC] peer-checked:bg-[#CCD8F4] peer-checked:text-[#4E72C8] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#D9583C]">{label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="mb-5 rounded-[16px] border-[1.5px] border-dashed border-[#E6D08A] bg-[#FBF1D6] p-[18px] text-center">
            <div className="mb-2 text-[12px] font-extrabold tracking-[0.7px] text-[#A88526]">CÓDIGO DE INVITACIÓN</div>
            <div className="font-fredoka text-[34px] font-semibold tracking-[7px] text-[#8A7234]">7K4P9</div>
            <div className="mt-[6px] text-[13px] text-[#A88526]">Vence en 7 días</div>
          </div>
          <button type="submit" className="flex w-full cursor-pointer items-center justify-center gap-[9px] rounded-[14px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] p-[14px] text-[15.5px] font-extrabold text-white shadow-[0_10px_22px_-8px_rgba(238,129,100,0.7)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D9583C]">
            <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4z" /><path d="M22 2 11 13" /></svg>
            Enviar invitación
          </button>
          <p id="link-parent-demo" className="mt-[18px] text-[13px] leading-[1.45] text-[#94887B]">{DEMO_NOTICE}</p>
        </form>
      </dialog>
    </>
  );
}
