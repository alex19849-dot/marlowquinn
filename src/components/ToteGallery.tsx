'use client';

import Image from 'next/image';
import { useState } from 'react';

type ProductPhoto = { src: string; label: string; alt: string; width: number; height: number };
const defaultPhotos = [
  { src: '/shop/filthy-bookshelf-model.webp', label: 'On the model', alt: 'Black Good Manners, Filthy Bookshelf tote carried over a model’s shoulder', width: 1157, height: 1359 },
  { src: '/shop/filthy-bookshelf-detail.webp', label: 'Print close-up', alt: 'Close-up of the black tote with ivory Good Manners lettering, magenta Filthy Bookshelf lettering and six rainbow books', width: 1254, height: 1254 },
];

export default function ToteGallery({ photos = defaultPhotos }: { photos?: readonly ProductPhoto[] }) {
  const [selected, setSelected] = useState(0);
  const photo = photos[selected];
  return <div className="tote-gallery">
    <div className="tote-gallery-main" id="tote-photo">
      <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} priority={selected === 0} sizes="(max-width:767px) calc(100vw - 36px), 55vw"/>
    </div>
    <div className="tote-gallery-choices" role="group" aria-label="Choose a product photo">
      {photos.map((item, index) => <button key={item.src} type="button" aria-pressed={selected === index} aria-controls="tote-photo" onClick={() => setSelected(index)}>
        <Image src={item.src} alt="" width={64} height={64} sizes="64px"/><span>{item.label}</span>
      </button>)}
    </div>
    <p className="fine-print">Product mockups. Colours and print placement may vary slightly.</p>
  </div>;
}
