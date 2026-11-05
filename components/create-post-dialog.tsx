import { useEffect, useRef, useState } from "react";

export const DEMO_NOTICE = "Demo: las publicaciones y fotos no se envían ni se guardan; se descartan al recargar o salir del feed";

export const RECIPIENTS = {
  mateo: { name: "Mateo", avatar: "M", avatarBg: "bg-[#A9D9E8]", avatarColor: "text-[#1F7A93]" },
  sofia: { name: "Sofía", avatar: "S", avatarBg: "bg-[#F4B8CC]", avatarColor: "text-[#C44A7A]" },
  benjamin: { name: "Benjamín", avatar: "B", avatarBg: "bg-[#B9DEC4]", avatarColor: "text-[#3E8B62]" },
  valentina: { name: "Valentina", avatar: "V", avatarBg: "bg-[#F4DC8E]", avatarColor: "text-[#9A7B1E]" },
  tomas: { name: "Tomás", avatar: "T", avatarBg: "bg-[#C9B6E8]", avatarColor: "text-[#7B5FC0]" },
  emma: { name: "Emma", avatar: "E", avatarBg: "bg-[#F4B8CC]", avatarColor: "text-[#C44A7A]" },
  lucas: { name: "Lucas", avatar: "L", avatarBg: "bg-[#A9D9E8]", avatarColor: "text-[#1F7A93]" },
  olivia: { name: "Olivia", avatar: "O", avatarBg: "bg-[#B9DEC4]", avatarColor: "text-[#3E8B62]" },
  room: { name: "Toda la sala", avatar: null, avatarBg: "bg-[#CCD8F4]", avatarColor: "text-[#4E72C8]" },
};

export const POST_TYPES = {
  food: { label: "Comida", bg: "bg-[#F7E7A6]", color: "text-[#9A7B1E]", dot: "bg-[#9A7B1E]" },
  nap: { label: "Siesta", bg: "bg-[#E7DCF6]", color: "text-[#7B5FC0]", dot: "bg-[#7B5FC0]" },
  activity: { label: "Actividad", bg: "bg-[#C7E7F1]", color: "text-[#2E89A6]", dot: "bg-[#2E89A6]" },
  milestone: { label: "Logro", bg: "bg-[#CFEBD8]", color: "text-[#3E9B6C]", dot: "bg-[#3E9B6C]" },
  mood: { label: "Ánimo", bg: "bg-[#F9D2DE]", color: "text-[#C56486]", dot: "bg-[#C56486]" },
  photo: { label: "Foto", bg: "bg-[#FBD8CC]", color: "text-[#D9684A]", dot: "bg-[#D9684A]" },
  announcement: { label: "Anuncio", bg: "bg-[#CCD8F4]", color: "text-[#4E72C8]", dot: "bg-[#4E72C8]" },
};

export type PostPhoto = { id: string; name: string; url: string };
export type NewPost = {
  id: string;
  recipients: (keyof typeof RECIPIENTS)[];
  type: keyof typeof POST_TYPES;
  description: string;
  createdAt: Date;
  photos: PostPhoto[];
};

const FOCUS_STYLE = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9583C]";

export default function CreatePostDialog({ onClose, onPublish }: {
  onClose: () => void;
  onPublish: (post: NewPost) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const draftUrls = useRef(new Set<string>());
  const selectionSession = useRef({ version: 0 });
  const [recipients, setRecipients] = useState<NewPost["recipients"]>(["mateo"]);
  const [recipientError, setRecipientError] = useState("");
  const [type, setType] = useState<NewPost["type"]>("activity");
  const [photos, setPhotos] = useState<PostPhoto[]>([]);
  const [photoError, setPhotoError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current!;
    const urls = draftUrls.current;
    const session = selectionSession.current;
    dialog.showModal();
    dialog.querySelector<HTMLTextAreaElement>("textarea")?.focus();
    return () => {
      session.version++;
      dialog.close();
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  function closeModal() {
    dialogRef.current?.close();
    onClose();
  }

  async function addPhotos(files: File[]) {
    if (!files.length) return;
    setPhotoError("");
    if (photos.length + files.length > 4) {
      setPhotoError("Podés agregar hasta 4 fotos por publicación.");
      return;
    }
    for (const file of files) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setPhotoError(`«${file.name}»: elegí una imagen JPEG, PNG o WebP.`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setPhotoError(`«${file.name}»: el tamaño máximo es 5 MiB por foto.`);
        return;
      }
    }

    const version = ++selectionSession.current.version;
    const batch: PostPhoto[] = [];
    setIsLoading(true);
    try {
      for (const file of files) {
        const url = URL.createObjectURL(file);
        draftUrls.current.add(url);
        batch.push({ id: crypto.randomUUID(), name: file.name, url });
      }
      await Promise.all(batch.map(async (photo) => {
        const image = new Image();
        image.src = photo.url;
        try {
          await image.decode();
        } catch {
          throw new Error(`«${photo.name}»: no se pudo leer la imagen.`);
        }
      }));
      if (version !== selectionSession.current.version) return;
      setPhotos((previous) => [...previous, ...batch]);
    } catch (error) {
      for (const photo of batch) {
        if (draftUrls.current.delete(photo.url)) URL.revokeObjectURL(photo.url);
      }
      if (version === selectionSession.current.version) {
        setPhotoError(error instanceof Error ? error.message : "No se pudieron cargar las fotos.");
      }
    } finally {
      if (version === selectionSession.current.version) setIsLoading(false);
    }
  }

  return (
    <dialog ref={dialogRef} aria-labelledby="create-post-title" aria-describedby="create-post-demo" onCancel={(event) => {
      event.preventDefault();
      closeModal();
    }} onKeyDown={(event) => {
      if (event.key !== "Tab") return;
      const controls = event.currentTarget.querySelectorAll<HTMLElement>("button:not(:disabled), textarea, input[type=checkbox], input[type=radio]:checked");
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }} className="m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-[580px] overflow-y-auto rounded-[24px] border border-[#ECE0D0] bg-[#FBF4EC] p-0 leading-[normal] text-[#3F362E] shadow-[0_20px_50px_-24px_rgba(63,54,46,0.35)] backdrop:bg-[#3F362E]/40">
      <form onSubmit={(event) => {
        event.preventDefault();
        if (isLoading) return;
        const form = event.currentTarget;
        const description = form.querySelector<HTMLTextAreaElement>("textarea")!;
        description.setCustomValidity(description.value.trim() ? "" : "Contá cómo le fue hoy; no uses solo espacios.");
        if (!form.reportValidity()) return;
        if (!recipients.length) {
          setRecipientError("Elegí al menos un niño o Toda la sala.");
          form.querySelector<HTMLInputElement>("input[name=recipients]")?.focus();
          return;
        }
        onPublish({ id: crypto.randomUUID(), recipients, type, description: description.value.trim(), createdAt: new Date(), photos });
        // Published photos now belong to the feed, not the discarded draft.
        draftUrls.current.clear();
        closeModal();
      }}>
        <div className="flex items-center justify-between gap-2 border-b border-[#ECE0D0] px-[26px] py-5">
          <button type="button" onClick={closeModal} className={`cursor-pointer text-[15px] font-bold text-[#94887B] ${FOCUS_STYLE}`}>Cancelar</button>
          <h2 id="create-post-title" className="text-center font-fredoka text-[18px] font-semibold">Nueva publicación</h2>
          <button type="submit" disabled={isLoading} className={`cursor-pointer text-[15px] font-extrabold text-[#D9583C] disabled:cursor-wait disabled:opacity-50 ${FOCUS_STYLE}`}>Publicar</button>
        </div>
        <div className="px-[26px] py-6">
          <fieldset className="mb-[22px]" aria-describedby="post-recipients-error">
            <legend className="mb-[10px] text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]">PARA</legend>
            <div className="flex flex-wrap gap-[9px]">
              {(Object.keys(RECIPIENTS) as NewPost["recipients"]).map((key) => {
                const person = RECIPIENTS[key];
                return (
                  <label key={key} className="cursor-pointer">
                    <input type="checkbox" name="recipients" value={key} checked={recipients.includes(key)} onChange={(event) => {
                      const checked = event.currentTarget.checked;
                      setRecipients((previous) => {
                        if (key === "room") return checked ? ["room"] : [];
                        return checked ? [...previous.filter((value) => value !== "room"), key] : previous.filter((value) => value !== key);
                      });
                      setRecipientError("");
                    }} className="peer sr-only" />
                    <span className={`flex min-h-[40px] items-center gap-2 rounded-full border-[1.5px] border-[#ECE0D0] bg-[#FFFDF9] py-[6px] text-[14px] font-bold text-[#6E6359] peer-checked:border-[#3F362E] peer-checked:bg-[#3F362E] peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#D9583C] ${person.avatar ? "pl-[6px] pr-[14px]" : "px-4"}`}>
                      {person.avatar && <span aria-hidden="true" className={`flex h-[26px] w-[26px] items-center justify-center rounded-full font-fredoka text-[13px] font-semibold ${person.avatarBg} ${person.avatarColor}`}>{person.avatar}</span>}
                      {person.name}
                    </span>
                  </label>
                );
              })}
            </div>
            <p id="post-recipients-error" role="alert" className="text-[13px] text-[#C5503A]">{recipientError}</p>
          </fieldset>
          <fieldset className="mb-[22px]">
            <legend className="mb-[10px] text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]">TIPO</legend>
            <div className="flex flex-wrap gap-[9px]">
              {(Object.keys(POST_TYPES) as NewPost["type"][]).map((key) => {
                const postType = POST_TYPES[key];
                return (
                  <label key={key} className="cursor-pointer">
                    <input type="radio" name="type" value={key} checked={type === key} onChange={() => setType(key)} className="peer sr-only" />
                    <span className={`block rounded-full px-4 py-2 text-[13.5px] font-extrabold peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#D9583C] ${type === key ? `${postType.dot} text-white` : `${postType.bg} ${postType.color}`}`}>{postType.label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
          <label htmlFor="post-description" className="mb-[10px] block text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]">DESCRIPCIÓN</label>
          <textarea id="post-description" name="description" required placeholder="Contá cómo le fue hoy…" onChange={(event) => event.currentTarget.setCustomValidity("")} className={`mb-[22px] min-h-[120px] w-full resize-y rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white px-4 py-[14px] text-[15px] leading-[1.5] text-[#3F362E] placeholder:text-[#B6A99B] ${FOCUS_STYLE}`} />
          <div id="post-photos-label" className="mb-[10px] text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]">FOTOS</div>
          <input id="post-photos" type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={isLoading} aria-labelledby="post-photos-label" aria-describedby="post-photos-help post-photos-error" hidden onChange={(event) => {
            const files = Array.from(event.currentTarget.files ?? []);
            event.currentTarget.value = "";
            void addPhotos(files);
          }} />
          <div className="flex flex-wrap gap-3" aria-busy={isLoading}>
            {photos.map((photo) => (
              <div key={photo.id} className="relative h-24 w-24">
                {/* eslint-disable-next-line @next/next/no-img-element -- Local blob URLs are not server-optimized images. */}
                <img src={photo.url} alt={photo.name} width={96} height={96} className="h-24 w-24 rounded-[14px] border border-[#ECE0D0] object-cover" />
                <button type="button" disabled={isLoading} aria-label={`Quitar ${photo.name}`} onClick={() => {
                  URL.revokeObjectURL(photo.url);
                  draftUrls.current.delete(photo.url);
                  setPhotos((previous) => previous.filter((item) => item.id !== photo.id));
                  setPhotoError("");
                  dialogRef.current?.querySelector<HTMLButtonElement>("#add-post-photo")?.focus();
                }} className={`absolute right-1 top-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-[#FFFDF9] text-[#C5503A] ${FOCUS_STYLE}`}>
                  <span aria-hidden="true">×</span>
                </button>
              </div>
            ))}
            <button id="add-post-photo" type="button" disabled={isLoading} onClick={() => dialogRef.current?.querySelector<HTMLInputElement>("input[type=file]")?.click()} className={`flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-[6px] rounded-[14px] border-[1.5px] border-dashed border-[#DBCDBA] bg-[#F4ECE1] text-[#B0A290] disabled:cursor-wait disabled:opacity-50 ${FOCUS_STYLE}`}>
              <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C5503A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
              <span className="text-[12px]">Agregar</span>
            </button>
          </div>
          <p id="post-photos-help" className="mt-[10px] text-[12px] text-[#94887B]">Hasta 4 fotos JPEG, PNG o WebP de 5 MiB cada una.</p>
          <p role="status" className="text-[13px] text-[#94887B]">{isLoading ? "Cargando fotos…" : ""}</p>
          <p id="post-photos-error" role="alert" className="break-words text-[13px] text-[#C5503A]">{photoError}</p>
          <p id="create-post-demo" className="mt-[18px] text-[13px] leading-[1.45] text-[#94887B]">{DEMO_NOTICE}</p>
        </div>
      </form>
    </dialog>
  );
}
