import { createBrowserRouter, Navigate } from 'react-router';
import {
  ForgotPasswordRoute,
  LoginRoute,
  ResetPasswordRoute,
  VerifyCodeRoute,
} from '../../routes/auth';
import { SectionPage } from '../../routes/SectionPage';
import { ROUTES } from '../../shared/constants/routes';
import { NotFoundPage } from '../errors/NotFoundPage';
import { RouteErrorPage } from '../errors/RouteErrorPage';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { NAV_ITEMS } from '../layouts/nav-items';
import { GuestOnly, RequireAuth } from './route-guards';

export const router = createBrowserRouter([
  {
    errorElement: <RouteErrorPage />,
    children: [
      {
        element: <GuestOnly />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              { path: ROUTES.login, element: <LoginRoute /> },
              {
                path: ROUTES.forgotPassword,
                element: <ForgotPasswordRoute />,
              },
              { path: ROUTES.verifyCode, element: <VerifyCodeRoute /> },
              { path: ROUTES.resetPassword, element: <ResetPasswordRoute /> },
            ],
          },
        ],
      },
      {
        element: <RequireAuth />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                index: true,
                element: <Navigate to={ROUTES.dashboard} replace />,
              },
              {
                path: 'dashboard',
                lazy: async () => ({
                  Component: (
                    await import('../../routes/dashboard/DashboardRoute')
                  ).DashboardRoute,
                }),
              },
              {
                path: 'documents',
                lazy: async () => ({
                  Component: (
                    await import('../../routes/documents/DocumentsRoute')
                  ).DocumentsRoute,
                }),
              },
              {
                path: 'documents/:fileId',
                lazy: async () => ({
                  Component: (
                    await import(
                      '../../routes/documents/DocumentViewerRoute'
                    )
                  ).DocumentViewerRoute,
                }),
              },
              {
                path: 'tasks',
                lazy: async () => ({
                  Component: (await import('../../routes/tasks/TasksRoute'))
                    .TasksRoute,
                }),
              },
              {
                path: 'memos',
                lazy: async () => ({
                  Component: (await import('../../routes/memos/MemosRoute'))
                    .MemosRoute,
                }),
              },
              {
                path: 'settings',
                lazy: async () => ({
                  Component: (
                    await import('../../routes/settings/SettingsRoute')
                  ).SettingsRoute,
                }),
              },
              {
                path: 'users',
                lazy: async () => ({
                  Component: (await import('../../routes/users/UsersRoute'))
                    .UsersRoute,
                }),
              },
              {
                path: 'reports',
                children: [
                  {
                    index: true,
                    lazy: async () => ({
                      Component: (
                        await import('../../routes/reporting/ReportingRoute')
                      ).ReportingRoute,
                    }),
                  },
                  {
                    path: 'turnaround',
                    lazy: async () => ({
                      Component: (
                        await import('../../routes/reporting/TurnaroundRoute')
                      ).TurnaroundRoute,
                    }),
                  },
                ],
              },
              {
                path: 'department-files',
                children: [
                  {
                    index: true,
                    lazy: async () => ({
                      Component: (
                        await import(
                          '../../routes/department-files/DepartmentFilesRoute'
                        )
                      ).DepartmentFilesRoute,
                    }),
                  },
                  {
                    path: ':departmentId',
                    lazy: async () => ({
                      Component: (
                        await import(
                          '../../routes/department-files/DepartmentSubUnitsRoute'
                        )
                      ).DepartmentSubUnitsRoute,
                    }),
                  },
                  {
                    path: ':departmentId/:unitId',
                    lazy: async () => ({
                      Component: (
                        await import(
                          '../../routes/department-files/DepartmentUnitFilesRoute'
                        )
                      ).DepartmentUnitFilesRoute,
                    }),
                  },
                ],
              },
              ...NAV_ITEMS.filter(
                (item) =>
                  item.to !== ROUTES.dashboard &&
                  item.to !== ROUTES.documents &&
                  item.to !== ROUTES.tasks &&
                  item.to !== ROUTES.memos &&
                  item.to !== ROUTES.users &&
                  item.to !== ROUTES.settings &&
                  item.to !== ROUTES.reports &&
                  item.to !== ROUTES.departmentFiles,
              ).map((item) => ({
                path: item.to.replace(/^\//, ''),
                element: <SectionPage title={item.label} />,
              })),
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
