import styles from './index.module.css';

function StepHeader({ stepInfo }: { stepInfo: string }) {
    return (
        <header className={styles.wizardHeader}>
            <h2 className={styles.wizardTitle}>Ricetta Express</h2>
            <p className={styles.stepInfo}>{stepInfo}</p>
        </header>
    )
}

export default StepHeader;