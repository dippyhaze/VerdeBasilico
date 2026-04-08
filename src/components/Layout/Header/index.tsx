import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import styles from './index.module.css';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div onClick={() => navigate('/')} className={styles.logo}>
        <Leaf size={24} className={styles.icon} /> Verde <span>Basilico</span>
      </div>
    </header>
  );
};

export default Header;