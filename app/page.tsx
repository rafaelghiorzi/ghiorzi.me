'use client';
import BlobScene from '@/components/blob';
import { useLang } from '@/context/LanguageContext';

export default function Home() {
  const { t } = useLang();

  return (
  <main>
    <article>
      Isso é um teste de card
    </article>

    <BlobScene></BlobScene>
  </main>
  );
}