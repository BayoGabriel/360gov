import { Link } from 'react-router';
import { ROUTES } from '../../shared/constants/routes';

export function NotFoundPage() {
  return (
    <main>
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <p>
        <Link to={ROUTES.login}>Back to sign in</Link>
      </p>
    </main>
  );
}
