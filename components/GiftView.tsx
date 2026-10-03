"use client";

import { useEffect, useState } from "react";
import { Heart, Sparkles, RotateCcw } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Memory = { title: string; date: string; text: string };
type GiftData = {
  recipient: string; sender: string; title: string; message: string; theme: string;
  photos: string[]; musicName: string; memories: Memory[]; finalMessage: string;
};

const themes: Record<string, {bg:string; accent:string}> = {
  rose:{bg:"#fff5f6",accent:"#e85d75"}, night:{bg:"#11121a",accent:"#e8b86b"},
  lavender:{bg:"#f6f1ff",accent:"#8c6ad8"}, sunset:{bg:"#fff4e9",accent:"#ed7d3a"},
  mint:{bg:"#eefbf6",accent:"#3da78b"}, sky:{bg:"#eef7ff",accent:"#5593d7"}
};

export default function GiftView({id}:{id:string}) {
  const [data,setData] = useState<GiftData|null>(null);
  const [opened,setOpened] = useState(false);
  const [page,setPage] = useState(0);

  useEffect(()=> {
    let mounted = true;
    (async () => {
      const { data: row } = await supabase.from("gifts").select("data").eq("id", id).single();
      if (mounted && row?.data) setData(row.data as GiftData);
    })();
    return () => { mounted = false; };
  },[id]);

  if(!data) return <main className="gift-error"><Heart/><h1>Cette surprise n’est pas disponible.</h1><p>Le lien est peut-être ouvert sur un autre navigateur ou a été supprimé.</p></main>;

  const theme=themes[data.theme] ?? themes.rose;

  if(!opened) return <main className="gift-view" style={{background:theme.bg,"--accent":theme.accent} as React.CSSProperties}>
    <div className="gift-opening">
      <div className="floating">✦</div>
      <small>UNE SURPRISE POUR</small>
      <h1>{data.recipient || "Toi"}</h1>
      <div className="big-envelope" onClick={()=>setOpened(true)}>💌</div>
      <h2>{data.title}</h2>
      <p>Une petite expérience préparée spécialement pour toi.</p>
      <button className="primary-button" onClick={()=>setOpened(true)}>Ouvrir la surprise ♥</button>
      <small className="gift-from">De {data.sender || "quelqu’un"} · avec amour</small>
    </div>
  </main>;

  const slides = [
    <div key="intro" className="gift-slide"><span className="big-heart" style={{color:theme.accent}}>♥</span><small>POUR {data.recipient || "TOI"}</small><h1>{data.title}</h1><p>{data.message}</p></div>,
    <div key="memories" className="gift-slide"><small>QUELQUES SOUVENIRS</small><h1>Notre histoire.</h1><div className="gift-memories">{data.memories.map((m,i)=><article key={i}><span style={{color:theme.accent}}>{String(i+1).padStart(2,"0")}</span><div><small>{m.date}</small><h3>{m.title}</h3><p>{m.text}</p></div></article>)}</div></div>,
    <div key="photos" className="gift-slide"><small>NOS MOMENTS</small><h1>Ces instants-là.</h1>{data.photos.length ? <div className="gift-photo-grid">{data.photos.map((p,i)=><img key={i} src={p} alt="" />)}</div> : <div className="empty-photo">Ajoute des photos dans l’éditeur pour les voir ici.</div>}</div>,
    <div key="final" className="gift-slide final-slide"><Sparkles size={28}/><h1>Pour finir…</h1><p>{data.finalMessage}</p><span className="big-heart" style={{color:theme.accent}}>♥</span><small>— {data.sender || "Avec amour"}</small></div>
  ];

  return <main className="gift-view" style={{background:theme.bg,"--accent":theme.accent} as React.CSSProperties}>
    <div className="gift-progress">{slides.map((_,i)=><span key={i} className={i===page?"active":""}/>)}</div>
    {slides[page]}
    <div className="gift-controls">
      <button disabled={page===0} onClick={()=>setPage(p=>p-1)}>←</button>
      {page < slides.length-1 ? <button className="gift-next" onClick={()=>setPage(p=>p+1)}>Continuer →</button> : <button onClick={()=>{setOpened(false);setPage(0)}}><RotateCcw size={16}/> Rejouer</button>}
    </div>
  </main>;
}