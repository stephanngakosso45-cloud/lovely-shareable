# LOVELY — version partageable

Cette version permet de créer une surprise, de la sauvegarder dans Supabase et d'envoyer un lien qui peut être ouvert sur un autre téléphone.

## 1. Installer

```bash
npm install
npm run dev
```

## 2. Créer la base Supabase

1. Crée un projet gratuit sur Supabase.
2. Ouvre **SQL Editor**.
3. Copie tout le contenu de `supabase.sql`.
4. Exécute-le.

## 3. Ajouter les clés

Crée `.env.local` à la racine :

```env
NEXT_PUBLIC_SUPABASE_URL=https://TON-PROJET.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TA-CLE-ANON
```

Les deux valeurs se trouvent dans les réglages API du projet Supabase.

## 4. Tester

```bash
npm run dev
```

Crée une surprise. LOVELY produit une URL du type :

`http://localhost:3000/s/abc123`

Sur un vrai hébergement, elle deviendra :

`https://ton-site.vercel.app/s/abc123`

Tu peux alors l'envoyer par WhatsApp : la personne ouvre le lien sur son propre téléphone.

## 5. Mettre en ligne gratuitement

1. Mets le projet sur GitHub.
2. Importe le dépôt dans Vercel.
3. Ajoute dans Vercel les mêmes variables :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Déploie.

## Limite actuelle

Les photos sont stockées dans le JSON du cadeau sous forme de Data URL. Pour de grosses photos, il est préférable de passer à **Supabase Storage**. Cette version est surtout destinée à un prototype fonctionnel.

## Sécurité

La politique SQL fournie autorise la lecture publique des cadeaux connaissant leur identifiant et l'insertion anonyme. Pour une version commerciale, il faut ajouter authentification, règles RLS plus strictes, limitation de taille, expiration/suppression et stockage séparé des images.
