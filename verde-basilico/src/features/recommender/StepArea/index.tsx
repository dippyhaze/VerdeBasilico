import React, { useState, useEffect, useRef } from 'react';
import styles from './index.module.css';
import { areaToCountryCode } from '../../../utils/recipeUtils';
import StepHeader from '../../../components/StepHeader';
import Loader from '../../../components/Loader';

interface Area {
  strArea: string;
}

const COMMON_AREAS = [
  { name: 'Italian' },
  { name: 'Chinese' },
  { name: 'Mexican' },
  { name: 'Japanese' },
  { name: 'French' },
  { name: 'American' },
  { name: 'British' },
  { name: 'Indian' },
  { name: 'Greek' },
  { name: 'Spanish' }
];

interface Props {
  onNext: (area: string) => void;
}

const StepArea: React.FC<Props> = ({ onNext }) => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
      .then(res => res.json())
      .then(data => {
        const apiAreas: Area[] = data.meals;
        const filtered = apiAreas.filter(apiArea =>
          COMMON_AREAS.some(common => common.name === apiArea.strArea)
        );
        setAreas(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div className={styles.container}>
      <StepHeader stepInfo="Step 1: Scegli una cucina" />

      <div className={styles.areaGrid} ref={scrollRef}>
        {loading ? (
          <Loader text="Carichiamo le cucine..." />
        ) : (
          areas.map((area) => (
            <button
              key={area.strArea}
              type="button"
              className={styles.areaCard}
              onClick={() => onNext(area.strArea)}
            >
              <div className={styles.areaIcon}>
                {areaToCountryCode[area.strArea] ? (
                  <img
                    src={`https://flagcdn.com/w80/${areaToCountryCode[area.strArea].toLowerCase()}.png`}
                    alt={area.strArea}
                    height="30"
                    style={{ borderRadius: '4px', objectFit: 'cover' }}
                  />
                ) : (
                  '🍽️'
                )}
              </div>
              <span className={styles.areaLabel}>{area.strArea}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default StepArea;