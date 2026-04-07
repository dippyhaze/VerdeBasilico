import { Loader2 } from 'lucide-react';
import styles from './index.module.css';

function Loader({ text }: { text: string }) {
    return (
        <div className={styles.loadingState}>
            <Loader2 className={styles.spinner} size={32} />
            <p>{text}</p>
        </div>
    )
}

export default Loader;