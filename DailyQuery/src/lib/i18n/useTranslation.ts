import { useI18nStore } from './store';
import { getTranslation } from './translations';
import { useMemo } from 'react';

export function useTranslation() {
  const language = useI18nStore((state) => state.language);
  const setLanguage = useI18nStore((state) => state.setLanguage);
  
  const t = useMemo(() => getTranslation(language), [language]);

  return { t, language, setLanguage };
}
