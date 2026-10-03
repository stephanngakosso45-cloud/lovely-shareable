"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Copy, Download, Gift, Heart, Image as ImageIcon, Link as LinkIcon, Music2, Palette, Plus, QrCode, Sparkles, Trash2, Upload, Wand2 } from "lucide-react";
import QRCode from "qrcode";
import { supabase } from "@/lib/supabase";

type Theme = {
  id: string;
  name: string;
  description: string;
  bg: string;
  accent: string;
  emoji: string;
};

type Memory = { title: string; date: string; text: string };

export type GiftData = {
  recipient: string;
  sender: string;
  title: string;
  message: string;
  theme: string;
  photos: string[];
  musicName: string;
  memories: Memory[];
  finalMessage: string;
};

const themes: Theme[] = [
  { id: "rose", name: "Rose", description: "Doux et romantique", bg: "#fff5f6", accent: "#e85d75", emoji: "🌹" },
  { id: "night", name: "Nuit", description: "Élégant et mystérieux", bg: "#11121a", accent: "#e8b86b", emoji: "🌙" },
  { id: "lavender", name: "Lavande", description: "Poétique et tendre", bg: "#f6f1ff", accent: "#8c6ad8", emoji: "🌸" },
  { id: "sunset", name: "Sunset", description: "Chaleureux et solaire", bg: "#fff4e9", accent: "#ed7d3a", emoji: "🌅" },
  { id: "mint", name: "Mint", description: "Frais et minimal", bg: "#eefbf6", accent: "#3da78b", emoji: "🍃" },
  { id: "sky", name: "Ciel", description: "Léger et lumineux", bg: "#eef7ff", accent: "#5593d7", emoji: "☁️" }
];

const initialData: GiftData = {
  recipient: "",
  sender: "",
  title: "Une petite surprise pour toi",
  message: "J’ai préparé quelque chose de spécial pour toi. Prends quelques instants pour le découvrir…",
  theme: "rose",
  photos: [],
  musicName: "",
  memories: [
    { title: "Notre premier souvenir", date: "", text: "Écris ici un souvenir qui compte pour vous." }
  ],
  finalMessage: "Merci d’être cette personne si spéciale. ♥"
};

async function saveGift(data: GiftData) {
  const id = crypto.randomUUID().slice(0, 10);
  const { error } = await supabase.from("gifts").insert({ id, data });
  if (error) throw error;
  return id;
}

export default function Editor() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<GiftData>(initialData);
  const [copied, setCopied] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);

  const theme = useMemo(() => themes.find(t => t.id === data.theme) ?? themes[0], [data.theme]);
  const update = <K extends keyof GiftData>(key: K, value: GiftData[K]) => setData(d => ({ ...d, [key]: value }));

  const addPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => setData(d => ({ ...d, photos: [...d.photos, String(reader.result)] }));
      reader.readAsDataURL(file);
    });
  };

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const createGift = async () => {
    try {
      setCreating(true);
      setCreateError("");
      const id = await saveGift(data);
      setCreatedId(id);
      setStep(6);
    } catch (e) {
      setCreateError("Impossible de publier la surprise. Vérifie la configuration Supabase.");
    } finally {
      setCreating(false);
    }
  };

  const shareUrl = createdId ? `${window.location.origin}/s/${createdId}` : "";
  const copyLink = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const downloadQR = async () => {
    if (!shareUrl) return;
    const url = await QRCode.toDataURL(shareUrl, { width: 1000, margin: 2 });
    const a = document.createElement("a");
    a.href = url; a.download = "lovely-qr.png"; a.click();
  };

  return (
    <div className="editor-shell" style={{"--accent": theme.accent, "--editor-bg": theme.bg} as React.CSSProperties}>
      <header className="editor-top">
        <a href="/" className="brand"><span className="brand-mark">♥</span> LOVELY</a>
        <div className="progress">
          {[1,2,3,4,5,6].map(n => <span key={n} className={n <= step ? "active" : ""}>{n < step ? <Check size={12}/> : n}</span>)}
        </div>
        <a href="/" className="exit">Quitter</a>
      </header>

      <div className="editor-layout">
        <section className="workspace">
          {step < 6 && <div className="step-label">ÉTAPE {step} SUR 5</div>}

          {step === 1 && <StepOne data={data} update={update} />}
          {step === 2 && <StepTwo data={data} update={update} addPhoto={addPhoto} />}
          {step === 3 && <StepThree data={data} update={update} />}
          {step === 4 && <StepFour data={data} update={update} />}
          {step === 5 && <StepFive data={data} createError={createError} />}

          {step === 6 && (
            <div className="success-step">
              <div className="success-icon"><Heart fill="currentColor"/></div>
              <div className="step-label">C’EST PRÊT</div>
              <h1>Ta surprise est créée.</h1>
              <p>Envoie ce lien à <strong>{data.recipient || "la personne"}</strong>. Elle pourra l’ouvrir directement dans son navigateur.</p>
              <div className="share-box">
                <LinkIcon size={18}/>
                <span>{shareUrl}</span>
                <button onClick={copyLink}>{copied ? <Check size={18}/> : <Copy size={18}/>}</button>
              </div>
              <div className="share-actions">
                <button className="primary-button" onClick={copyLink}>{copied ? "Lien copié !" : "Copier le lien"}</button>
                <button className="secondary-button" onClick={downloadQR}><QrCode size={18}/> QR Code</button>
                <a className="secondary-button" href={`/s/${createdId}`} target="_blank"><Gift size={18}/> Ouvrir</a>
              </div>
            </div>
          )}

          {step < 6 && (
            <div className="editor-actions">
              <button className="secondary-button" disabled={step === 1} onClick={() => setStep(s => s - 1)}><ArrowLeft size={17}/> Retour</button>
              <button className="primary-button" disabled={creating} onClick={() => step === 5 ? createGift() : setStep(s => s + 1)}>{creating ? "Publication…" : step === 5 ? "Créer ma surprise" : "Continuer"} <ArrowRight size={17}/></button>
            </div>
          )}
        </section>

        <aside className="preview-panel">
          <div className="preview-header"><span>APERÇU</span><span className="live-dot">● EN DIRECT</span></div>
          <Preview data={data} theme={theme}/>
        </aside>
      </div>
    </div>
  );
}

function StepOne({data, update}: {data: GiftData; update: any}) {
  return <div className="step-content">
    <div className="eyebrow"><Palette size={15}/> TON UNIVERS</div>
    <h1>Choisis une ambiance.</h1>
    <p className="lead">Le thème donne le ton à toute l’expérience.</p>
    <div className="theme-grid">
      {themes.map(t => <button key={t.id} className={`theme-card ${data.theme === t.id ? "selected":""}`} onClick={() => update("theme", t.id)} style={{background:t.bg}}>
        <span className="theme-emoji">{t.emoji}</span><strong>{t.name}</strong><small>{t.description}</small>{data.theme===t.id && <span className="theme-check"><Check size={14}/></span>}
      </button>)}
    </div>
  </div>
}

function StepTwo({data, update, addPhoto}: {data: GiftData; update:any; addPhoto:(e:ChangeEvent<HTMLInputElement>)=>void}) {
  return <div className="step-content">
    <div className="eyebrow"><Heart size={15}/> PERSONNALISE</div>
    <h1>Pour qui est cette surprise ?</h1>
    <p className="lead">Quelques mots suffisent pour commencer.</p>
    <div className="form-grid">
      <label>Prénom de la personne<input value={data.recipient} onChange={e=>update("recipient", e.target.value)} placeholder="Ex. Emma"/></label>
      <label>Ton prénom<input value={data.sender} onChange={e=>update("sender", e.target.value)} placeholder="Ex. Alex"/></label>
    </div>
    <label>Titre de la surprise<input value={data.title} onChange={e=>update("title", e.target.value)} /></label>
    <label>Ton message<textarea rows={5} value={data.message} onChange={e=>update("message", e.target.value)} /></label>
    <div className="upload-zone">
      <input id="photos" type="file" accept="image/*" multiple onChange={addPhoto} hidden/>
      <label htmlFor="photos" className="upload-label"><Upload size={24}/><strong>Ajouter tes photos</strong><span>JPG, PNG ou WEBP · plusieurs fichiers possibles</span></label>
    </div>
    {data.photos.length > 0 && <div className="thumbs">{data.photos.map((p,i)=><div className="thumb" key={i}><img src={p}/><button onClick={()=>update("photos", data.photos.filter((_,x)=>x!==i))}><Trash2 size={13}/></button></div>)}</div>}
  </div>
}

function StepThree({data, update}: {data: GiftData; update:any}) {
  return <div className="step-content">
    <div className="eyebrow"><ImageIcon size={15}/> VOS SOUVENIRS</div>
    <h1>Raconte votre histoire.</h1>
    <p className="lead">Ajoute les petits moments que tu veux lui faire revivre.</p>
    {data.memories.map((m,i)=><div className="memory-editor" key={i}>
      <div className="memory-number">{i+1}</div>
      <div className="memory-fields">
        <input value={m.title} onChange={e=>{const a=[...data.memories];a[i]={...m,title:e.target.value};update("memories",a)}} placeholder="Titre du souvenir"/>
        <input value={m.date} onChange={e=>{const a=[...data.memories];a[i]={...m,date:e.target.value};update("memories",a)}} placeholder="Date (facultatif)"/>
        <textarea value={m.text} onChange={e=>{const a=[...data.memories];a[i]={...m,text:e.target.value};update("memories",a)}} rows={3}/>
      </div>
      {data.memories.length>1 && <button className="icon-button danger" onClick={()=>update("memories",data.memories.filter((_,x)=>x!==i))}><Trash2 size={17}/></button>}
    </div>)}
    <button className="add-memory" onClick={()=>update("memories",[...data.memories,{title:"Un autre souvenir",date:"",text:"Écris quelque chose…"}])}><Plus size={17}/> Ajouter un souvenir</button>
  </div>
}

function StepFour({data, update}: {data: GiftData; update:any}) {
  return <div className="step-content">
    <div className="eyebrow"><Music2 size={15}/> L’AMBIANCE</div>
    <h1>Ajoute une touche de magie.</h1>
    <p className="lead">Tu peux ajouter un nom de morceau ici. Le fichier audio pourra être branché au stockage plus tard.</p>
    <div className="music-card">
      <div className="music-icon"><Music2/></div>
      <div><strong>Musique</strong><span>{data.musicName || "Aucun morceau sélectionné"}</span></div>
      <input id="music" type="file" accept="audio/*" hidden onChange={e=>update("musicName",e.target.files?.[0]?.name || "")}/>
      <label htmlFor="music" className="secondary-button">Choisir</label>
    </div>
    <label>Message final<textarea rows={6} value={data.finalMessage} onChange={e=>update("finalMessage",e.target.value)} /></label>
  </div>
}

function StepFive({data, createError}: {data: GiftData; createError: string}) {{
  return <div className="step-content">
    <div className="eyebrow"><Sparkles size={15}/> DERNIÈRE VÉRIFICATION</div>
    <h1>Tout est prêt ?</h1>
    <p className="lead">Voici un résumé avant de créer ton lien.</p>
    {createError && <div className="notice error"><span>{createError}</span></div>}
    <div className="review-list">
      <div><span>Destinataire</span><strong>{data.recipient || "Non renseigné"}</strong></div>
      <div><span>Expéditeur</span><strong>{data.sender || "Non renseigné"}</strong></div>
      <div><span>Thème</span><strong>{themes.find(t=>t.id===data.theme)?.name}</strong></div>
      <div><span>Photos</span><strong>{data.photos.length}</strong></div>
      <div><span>Souvenirs</span><strong>{data.memories.length}</strong></div>
    </div>
    <div className="notice"><Check size={18}/> Les données sont enregistrées localement dans ton navigateur pour cette version gratuite.</div>
  </div>
}

function Preview({data, theme}: {data: GiftData; theme: Theme}) {
  const [opened, setOpened] = useState(false);
  return <div className="preview-device">
    <div className="preview-screen" style={{background:theme.bg}}>
      {!opened ? <div className="preview-cover">
        <div className="preview-spark">✦</div>
        <small>UNE SURPRISE POUR</small>
        <h2>{data.recipient || "Toi"}</h2>
        <div className="preview-envelope">💌</div>
        <p>{data.title}</p>
        <button onClick={()=>setOpened(true)} style={{background:theme.accent}}>Ouvrir</button>
        <small className="from">De {data.sender || "quelqu’un qui pense à toi"} ♥</small>
      </div> : <div className="preview-open">
        <div className="open-heart" style={{color:theme.accent}}>♥</div>
        <small>POUR {data.recipient || "TOI"}</small>
        <h2>{data.title}</h2>
        {data.photos[0] && <img src={data.photos[0]} className="preview-photo"/>}
        <p>{data.message}</p>
        <div className="preview-memory"><span>✦</span><div><strong>{data.memories[0]?.title}</strong><small>{data.memories[0]?.text}</small></div></div>
        <p className="final">{data.finalMessage}</p>
        <button className="replay" onClick={()=>setOpened(false)}>↺ Rejouer</button>
      </div>}
    </div>
  </div>
}