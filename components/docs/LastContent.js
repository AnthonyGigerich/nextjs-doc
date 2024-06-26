import React, { useEffect, useState } from 'react';
import styles from '../../styles/Roadmap.module.css';
import authors from '../../public/sitedata/authors.json';

const LastContent = () => {
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/docscatalog?action=metadatalist');
      const data = await res.json();
      // Sort by date
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setApiData(data);
    };
    fetchData();
  }, []);

  const memoizedDates = {};

  const formatDate = (dateString) => {
    if (memoizedDates[dateString]) return memoizedDates[dateString];

    const options = { year: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('fr-FR', options).format(
      new Date(dateString),
    );
    memoizedDates[dateString] = formattedDate;
    return formattedDate;
  };

  const groupByYear = (items) => {
    return items.reduce((acc, item) => {
      const year = formatDate(item.date);
      acc[year] = [...(acc[year] || []), item];
      return acc;
    }, {});
  };

  const groupedByYear = groupByYear(apiData);

  return (
    <div className={styles.lastcontentContainer}>
      {Object.keys(groupedByYear)
        .reverse()
        .map((year, index) => (
          <div key={index}>
            <h2 className={styles.monthTitle}>{year}</h2>
            <table>
              <tbody>
                {groupedByYear[year]
                  .filter((item) => item.index !== '0') // Adjusted filter condition
                  .map((item, index) => (
                    <tr key={index}>
                      <td>
                        <a href={`/docs/${item['﻿name']}`} className={styles.link}>
                          {item.title}
                        </a>
                      </td>
                      <td>
                        {item.authors.split(',').map((authorId, idx) => (
                          <div key={idx} className={styles.authorFlexContainer}>
                            {authors[authorId] ? (
                              <>
                                <img
                                  src={authors[authorId].image}
                                  alt={authors[authorId].name}
                                  className={styles.authorImage}
                                />
                                <div className={styles.authorName}>
                                  {authors[authorId].name}
                                </div>
                              </>
                            ) : (
                              'Author not found'
                            )}
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ))}
    </div>
  );
};

export default LastContent;
