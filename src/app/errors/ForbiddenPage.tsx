import { Link } from 'react-router';
import { ROUTES } from '../../shared/constants/routes';

export function ForbiddenPage() {
  return (
    <main>
      <h1>Access restricted</h1>
      <p>Your role does not have access to this section.</p>
      <p>
        <Link to={ROUTES.dashboard}>Back to dashboard</Link>
      </p>
    </main>
  );
}
