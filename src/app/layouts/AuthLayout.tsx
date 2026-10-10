import { Link, Outlet } from 'react-router';
import coatOfArms from '../../assets/coat-of-arms.svg';
import { ROUTES } from '../../shared/constants/routes';
import styles from './AuthLayout.module.css';

export function AuthLayout() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link to={ROUTES.login} className={styles.brand}>
          Gov .org
        </Link>
      </header>
      <img
        src={coatOfArms}
        alt=""
        aria-hidden="true"
        className={styles.watermark}
      />
      <main className={styles.main}>
        <div className={styles.column}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
