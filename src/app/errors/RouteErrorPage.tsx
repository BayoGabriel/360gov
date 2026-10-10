import { isRouteErrorResponse, Link, useRouteError } from 'react-router';
import { ROUTES } from '../../shared/constants/routes';

export function RouteErrorPage() {
  const error = useRouteError();

  let title = 'Something went wrong';
  let detail = 'An unexpected error occurred while loading this page.';

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    detail =
      typeof error.data === 'string'
        ? error.data
        : 'The page could not be loaded.';
  } else if (error instanceof Error) {
    detail = error.message;
  }

  return (
    <main>
      <h1>{title}</h1>
      <p>{detail}</p>
      <p>
        <Link to={ROUTES.login}>Back to sign in</Link>
      </p>
    </main>
  );
}
