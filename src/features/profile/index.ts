export { useProfile } from './hooks/useProfile';
export { useProfileStore } from './store/profileStore';

// реэкспорт типов из глобалки
export type { User, WorkInfo, CommunicationPreference, Interest } from '@/src/types';

//реэкспорт ui типов
export type { DisplayUser, ProfileFormData } from './types';
export { GOAL_LABELS, PERSONALITY_LABELS, WORK_FORMAT_LABELS, BLANK_USER } from './types';