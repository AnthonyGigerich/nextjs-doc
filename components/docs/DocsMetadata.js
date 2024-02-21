import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import styles from '../../styles/DocsMetadata.module.css';
import Authors from '../nav/Authors';
import { useRouter } from 'next/router';

const DocsMetadata = ({ metadata }) => {
  const { type, tags, date, authors, license, partners, "partners-names": partnersNames, "partners-images": partnersImages } = metadata || {};
  const router = useRouter();

  // Convertir les chaînes de partenaires en tableaux
  const partnersArray = typeof partners === 'string' ? partners.split(',').map(partner => partner.trim()).filter(partner => partner) : [];
  const partnersNamesArray = typeof partnersNames === 'string' ? partnersNames.split(',').map(name => name.trim()).filter(name => name) : [];
  const partnersImagesArray = typeof partnersImages === 'string' ? partnersImages.split(',').map(image => image.trim()).filter(image => image) : [];
  
  const renderTypeWithEmoji = (type) => {
    let emoji = '';
    switch (type) {
      case 'Formation':
        emoji = '🧑🏽‍🏫 ';
        break;
      case 'Atelier':
        emoji = '🎯 ';
        break;
      case 'Bibliographie':
        emoji = '📚 ';
        break;
      case 'Liste de ressources':
        emoji = '📋 ';
        break;
      case 'Guide':
        emoji = '📘 ';
        break;
      case 'Infographie':
        emoji = '📊 ';
        break;
      case 'Galerie d‘images':
        emoji = '📷 ';
        break;
      case 'Cas pratique':
        emoji = '🔎 ';
        break;
      case 'Datagramme':
        emoji = '👓';
        break;
      case 'Blog':
        emoji = '✏️';
        break;
    }
    return `${emoji}${type}`;
  };

  const tagsArray = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags;
  const authorsArray = typeof authors === 'string' ? authors.split(',').map(author => author.trim()) : authors;

  const handleAuthorClick = (authorId) => {
    router.push(`/authors/${authorId}`);
  };

  const handleTagClick = (tag) => {
    const url = `/docs?tag=${encodeURIComponent(tag)}`;
    window.open(url, '_blank');
  };

  const handleTypeClick = (type) => {
    const url = `/docs?type=${encodeURIComponent(type)}`;
    window.open(url, '_blank');
  };

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    return format(dateObj, 'd MMMM yyyy', { locale: fr });
  };

  return (
    <div className={styles.docsMetadata}>
      <div className={styles.metadataRow}>
        {date && (
          <p>
            <strong>🗓</strong>&nbsp;{formatDate(date)}
          </p>
        )}
        {date && type && <>&nbsp; &nbsp;&nbsp; &nbsp;</>}
        {type && (
          <p>
          <button
            className={styles.typeButton}
            onClick={() => handleTypeClick(type)}
          >
            {renderTypeWithEmoji(type)}
          </button>
          </p>
        )}
      </div>
      {tagsArray && (
        <div className={styles.metadataRow}>
          {tagsArray.map((tag) => (
            <button
              key={tag}
              className={styles.tagButton}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
      {authorsArray && (
        <div className={styles.metadataRow}>
          <Authors
            authorIds={authorsArray}
            largeText={true}
            onAuthorClick={handleAuthorClick}
            onlyDatactivist={false}
          />
        </div>
      )}
      {license === 'ccbysa' && (
        <div className={styles.metadataRow}>
          <div className={styles.ccBySaWrapper}>
            <img
              src="/images/icons/cc-by-sa.png"
              alt="cc-by-sa"
              className={styles.ccBySaImage}
            />
            <div className={styles.ccBySaLightbox}>
              🔄 Vous pouvez partager et adapter ce contenu librement, à
              condition de le créditer et de le partager sous une licence
              compatible.
            </div>
          </div>
        </div>
      )}
      {partnersArray.length > 0 && (
        <div className={styles.metadataRow}>
          {partnersArray.map((partner, index) => (
            <div key={partner} className={styles.partnersWrapper}>
              <a href={`/partners/${partner}`} className={styles.partnerLink}>
              <img
                src={partnersImagesArray[index]}
                alt={`Logo de ${partnersNamesArray[index]}`}
                className={styles.partnersImage}
              />
              </a>
            </div>
            
          ))}
        </div>
      )}
    </div>
  );
};

export default DocsMetadata;
