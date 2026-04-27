import { User, BLANK_USER } from '../types';
import type { ErrorResponse } from '@/src/types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// временные mock данные для тестирования, тест работы типо api 
let mockUserData: User = {
    id: 1,
    firstName: 'Иван',
    lastName: 'Петров',
    middle_name: 'Александрович',
    date_of_birth: '1998-05-15',
    gender: 'MALE',
    language: 'ru',
    email: 'ivan@example.com',
    about: 'Люблю гулять и бегать под дождём! Присоединишься?',
    avatar_url: '/assets/example1.jpg',
    has_filled_profile: true,
    role: 'USER',
    blocked: false,
    email_verified: true,
    work_info: {
        id: 1,
        city: 'Ижевск',
        job_title: 'HR-менеджер',
        department: 'Отдел кадров',
        work_format: 'HYBRID'
    },
    communication_preference: {
        id: 1,
        goal: 'NEW_FRIENDS',
        personality_type: 'AMBIVERT',
        communication_format: ['ONLINE', 'OFFLINE']
    },
    interests: [
        { interest_id: 1, name: 'Фото', level: 4 },
        { interest_id: 2, name: 'Спорт', level: 3 },
        { interest_id: 3, name: 'Музыка', level: 5 },
        { interest_id: 4, name: 'Путешествия', level: 4 }
    ]
};

class ProfileApi {
    private useMockData: boolean = true;

    async getProfile(): Promise<User> {
        if (this.useMockData) {
            await delay(800);
            return { ...mockUserData };
        }
        
        // TODO: подруб реального api 
        // const response = await fetch('/api/users/me');
        // if (!response.ok) {
        //     const error: ErrorResponse = await response.json();
        //     throw new Error(error.message);
        // }
        // return response.json();
        
        throw new Error('API not implemented');
    }

    async updateProfile(data: Partial<User>): Promise<User> {
        if (this.useMockData) {
            await delay(600);
            mockUserData = { ...mockUserData, ...data };
            return { ...mockUserData };
        }
        
        // TODO: подруб реального api 
        // const response = await fetch('/api/users/me', {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // });
        // return response.json();
        
        throw new Error('API not implemented');
    }

    async updateAvatar(file: File): Promise<{ avatar_url: string }> {
        if (this.useMockData) {
            await delay(1000);
            const mockUrl = URL.createObjectURL(file);
            mockUserData.avatar_url = mockUrl;
            return { avatar_url: mockUrl };
        }
        
        // TODO: реальная загрузка
        // const formData = new FormData();
        // formData.append('avatar', file);
        // const response = await fetch('/api/users/me/avatar', {
        //     method: 'POST',
        //     body: formData
        // });
        // return response.json();
        
        throw new Error('API not implemented');
    }

    async updateInterests(interests: number[]): Promise<User> {
        if (this.useMockData) {
            await delay(500);
            mockUserData.interests = interests.map(id => ({
                interest_id: id,
                name: `Интерес ${id}`,
                level: 3
            }));
            return { ...mockUserData };
        }
        
        throw new Error('API not implemented');
    }

    async resetToBlank(): Promise<User> {
        if (this.useMockData) {
            await delay(500);
            mockUserData = { ...BLANK_USER, id: mockUserData.id } as User;
            return { ...mockUserData };
        }
        
        throw new Error('API not implemented');
    }
}

export const profileApi = new ProfileApi();