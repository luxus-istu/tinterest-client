import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User } from '@/src/types';
import { BLANK_USER } from '../types';
import { profileApi } from '../api/profileApi';

interface ProfileStoreState {
    user: User | null;
    isLoading: boolean;
    isSaving: boolean;
    isEditing: boolean;
    error: string | null;
    isEdited: boolean;
}

interface ProfileStoreActions {
    setUser: (user: User) => void;
    updateField: <K extends keyof User>(field: K, value: User[K]) => void;
    updateNestedField: {
        workInfo: <K extends keyof User['work_info']>(field: K, value: User['work_info'][K]) => void;
        communicationPref: <K extends keyof User['communication_preference']>(
            field: K, 
            value: User['communication_preference'][K]
        ) => void;
    };
    startEditing: () => void;
    cancelEditing: () => void;
    resetToBlank: () => void;
    fetchUser: () => Promise<void>;
    saveUser: () => Promise<void>;
    updateAvatar: (file: File) => Promise<void>;
    updateInterests: (interestIds: number[]) => Promise<void>;
    clearError: () => void;
}

type ProfileStore = ProfileStoreState & ProfileStoreActions;

export const useProfileStore = create<ProfileStore>()(
    devtools(
        (set, get) => ({
            user: null,
            isLoading: false,
            isSaving: false,
            isEditing: false,
            error: null,
            isEdited: false,

            setUser: (user) => set({ user, isEdited: false, error: null }),
            
            updateField: (field, value) => {
                const { user } = get();
                if (!user) return;
                set({ user: { ...user, [field]: value }, isEdited: true });
            },
            
            updateNestedField: {
                workInfo: (field, value) => {
                    const { user } = get();
                    if (!user?.work_info) return;
                    set({
                        user: {
                            ...user,
                            work_info: { ...user.work_info, [field]: value }
                        },
                        isEdited: true
                    });
                },
                communicationPref: (field, value) => {
                    const { user } = get();
                    if (!user?.communication_preference) return;
                    set({
                        user: {
                            ...user,
                            communication_preference: { 
                                ...user.communication_preference, 
                                [field]: value 
                            }
                        },
                        isEdited: true
                    });
                }
            },
            
            startEditing: () => set({ isEditing: true, error: null }),
            
            cancelEditing: () => {
                const { fetchUser } = get();
                fetchUser();
                set({ isEditing: false, error: null });
            },
            
            resetToBlank: () => {
                set({
                    user: { ...BLANK_USER, id: get().user?.id || 0 } as User,
                    isEdited: true,
                    error: null
                });
            },
            
            fetchUser: async () => {
                set({ isLoading: true, error: null });
                try {
                    const user = await profileApi.getProfile();
                    set({ user, isLoading: false, isEdited: false });
                } catch (error) {
                    set({ 
                        error: error instanceof Error ? error.message : 'Ошибка загрузки профиля',
                        isLoading: false 
                    });
                }
            },
            
            saveUser: async () => {
                const { user, isEdited } = get();
                if (!user || !isEdited) return;
                
                set({ isSaving: true, error: null });
                try {
                    const updatedUser = await profileApi.updateProfile(user);
                    set({ 
                        user: updatedUser, 
                        isSaving: false, 
                        isEdited: false, 
                        isEditing: false 
                    });
                } catch (error) {
                    set({ 
                        error: error instanceof Error ? error.message : 'Ошибка сохранения',
                        isSaving: false 
                    });
                }
            },
            
            updateAvatar: async (file: File) => {
                set({ isSaving: true, error: null });
                try {
                    const { avatar_url } = await profileApi.updateAvatar(file);
                    const { user } = get();
                    if (user) {
                        set({
                            user: { ...user, avatar_url },
                            isSaving: false,
                            isEdited: true
                        });
                    }
                } catch (error) {
                    set({ 
                        error: error instanceof Error ? error.message : 'Ошибка загрузки аватара',
                        isSaving: false 
                    });
                }
            },
            
            updateInterests: async (interestIds: number[]) => {
                set({ isSaving: true, error: null });
                try {
                    const updatedUser = await profileApi.updateInterests(interestIds);
                    set({
                        user: updatedUser,
                        isSaving: false,
                        isEdited: false
                    });
                } catch (error) {
                    set({ 
                        error: error instanceof Error ? error.message : 'Ошибка обновления интересов',
                        isSaving: false 
                    });
                }
            },
            
            clearError: () => set({ error: null })
        }),
        { name: 'ProfileStore' }
    )
);