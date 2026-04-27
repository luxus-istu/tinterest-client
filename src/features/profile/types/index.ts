export type {
    User,
    ErrorResponse,
    WorkInfo,
    CommunicationPreference,
    Interest
} from '@/src/types';

export type ProfileFormData = {
    firstName: string;
    lastName: string;
    middle_name: string;
    about: string;
    date_of_birth: string;
    gender: 'MALE' | 'FEMALE' | '';
    language: 'ru' | 'en' | '';
};

export type DisplayUser = {
    fullName: string;
    age: number | null;
    avatar_url: string;
    city: string;
    job_title: string;
    about: string;
    interests: Interest[];
    communication_goal: string;
    completion_percentage: number;
};

export const GOAL_LABELS: Record<string, string> = {
    'NEW_FRIENDS': 'Новые друзья',
    'RELATIONSHIP': 'Отношения',
    'NETWORKING': 'Нетворкинг'
};

export const PERSONALITY_LABELS: Record<string, string> = {
    'INTROVERT': 'Интроверт',
    'EXTROVERT': 'Экстраверт',
    'AMBIVERT': 'Амбиверт'
};

export const WORK_FORMAT_LABELS: Record<string, string> = {
    'OFFICE': 'Офис',
    'REMOTE': 'Удаленно',
    'HYBRID': 'Гибрид'
};

//blank значения для заполнения профиля
export const BLANK_USER: Partial<User> = {
    id: 0,
    firstName: '',
    lastName: '',
    middle_name: '',
    date_of_birth: '',
    gender: 'MALE',
    language: 'ru',
    email: '',
    about: '',
    avatar_url: '/assets/default-avatar.jpg',
    has_filled_profile: false,
    role: 'USER',
    blocked: false,
    email_verified: false,
    work_info: {
        id: 0,
        city: '',
        job_title: '',
        department: '',
        work_format: 'OFFICE'
    },
    communication_preference: {
        id: 0,
        goal: 'NEW_FRIENDS',
        personality_type: 'AMBIVERT',
        communication_format: ['ONLINE']
    },
    interests: []
};