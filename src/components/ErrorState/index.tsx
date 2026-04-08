import { RotateCcw, SearchX } from 'lucide-react';
import styles from './index.module.css';

function ErrorState({ children, handleReset }: { children: React.ReactNode, handleReset: () => void }) {
    return (
        <div className={styles.emptyState}>
            <div className={styles.emptyIconWrapper}>
                <SearchX size={64} className={styles.emptyIcon} />
            </div>
            {children}
            <button
                className={styles.resetBtn}
                onClick={handleReset}
            >
                <RotateCcw size={18} /> Torna Indietro
            </button>
        </div>
    )
}

export default ErrorState;