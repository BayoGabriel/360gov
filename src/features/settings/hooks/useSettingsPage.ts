import {
  useProfileSettings,
  useSettingsOptions,
} from '../queries/settings.queries';

/** Screen-level orchestration for the settings route. */
export function useSettingsPage() {
  const profileQuery = useProfileSettings();
  const optionsQuery = useSettingsOptions(true);
  return { profileQuery, optionsQuery };
}
