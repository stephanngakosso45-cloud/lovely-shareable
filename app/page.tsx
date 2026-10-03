import Link from "next/link";
import { ArrowRight, Gift, Heart, Image as ImageIcon, Music2, Sparkles, Wand2 } from "lucide-react";

const features = [
  { icon: Heart, title: "Des émotions", text: "Crée une expérience pensée autour de votre histoire." },
  { icon: ImageIcon, title: "Tes souvenirs", text: "Ajoute photos, messages et moments importants." },
  { icon: Music2, title: "Ta musique", text: "Ajoute une ambiance musicale à ton cadeau." },
  { icon: Sparkles, title: "Des animations", text: "Fais apparaître les souvenirs avec de belles transitions." }
];

export default function Home() {
  return (
    <main className="landing">
      <nav className="nav">
        <div className="brand"><span className="brand-mark">♥</span> LOVELY</div>
        <Link className="nav-link" href="/editeur">Créer gratuitement <ArrowRight size={17}/></Link>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15}/> Une surprise qui se vit</div>
          <h1>Crée un cadeau<br/><em>qu’on n’oublie pas.</em></h1>
          <p>Transforme tes photos, tes mots et tes souvenirs en une petite expérience interactive à partager avec la personne que tu aimes.</p>
          <Link className="primary-button" href="/editeur"><Wand2 size={18}/> Commencer gratuitement <ArrowRight size={18}/></Link>
          <div className="trust"><span>✓</span> Aucun paiement · <span>✓</span> Sans installation · <span>✓</span> Partageable par lien</div>
        </div>

        <div className="hero-card-wrap">
          <div className="hero-glow"/>
          <div className="hero-card">
            <div className="hero-card-top"><span>Pour toi, mon amour</span><Heart size={17} fill="currentColor"/></div>
            <div className="hero-photo"><div className="photo-placeholder">✦</div></div>
            <div className="hero-card-bottom">
              <small>UNE PETITE SURPRISE</small>
              <h2>J’ai quelque chose<br/>à te dire…</h2>
              <div className="mini-button">Ouvrir ♥</div>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="section-heading">
          <div className="eyebrow">TOUT CE QU’IL FAUT</div>
          <h2>Une vraie petite expérience.</h2>
        </div>
        <div className="feature-grid">
          {features.map(({icon: Icon, title, text}) => (
            <div className="feature" key={title}><div className="feature-icon"><Icon size={21}/></div><h3>{title}</h3><p>{text}</p></div>
          ))}
        </div>
      </section>

      <section className="cta">
        <Gift size={30}/>
        <h2>Prêt à créer ta surprise ?</h2>
        <p>Quelques minutes suffisent.</p>
        <Link className="primary-button light" href="/editeur">Créer ma surprise <ArrowRight size={18}/></Link>
      </section>

      <footer>© {new Date().getFullYear()} LOVELY · Créé avec ♥</footer>
    </main>
  );
}