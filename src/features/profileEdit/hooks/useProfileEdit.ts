"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileEditApi } from "../api/edit.api";
import useAuthStore from "@/src/features/auth/store/auth.store";
import { toast } from 'sonner';

export function useProfileEdit() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const basicMutation = useMutation({
    mutationFn: profileEditApi.updateBasic,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
      toast.success("Основная информация обновлена");
      setErrorMessage(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Ошибка обновления основной информации");
      setErrorMessage(null);
    },
  });

  const workMutation = useMutation({
    mutationFn: profileEditApi.updateWork,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
      toast.success('Информация о работе обновлена');
      setErrorMessage(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Ошибка обновления работы");
      setErrorMessage(null);
    },
  });

  const communicationMutation = useMutation({
    mutationFn: profileEditApi.updateCommunication,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
      toast.success('Информация о коммуникации обновлена');
      setErrorMessage(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Ошибка обновления целей общения");
      setErrorMessage(null);
    },
  });

  const interestsMutation = useMutation({
    mutationFn: profileEditApi.updateInterests,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
      toast.success('Интересы обновлены');
      setErrorMessage(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Ошибка обновления интересов");
      setErrorMessage(null);
    },
  });

  const avatarMutation = useMutation({
    mutationFn: profileEditApi.uploadAvatar,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
      toast.success('Аватар загружен');
      setErrorMessage(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Ошибка загрузки аватара");
      setErrorMessage(null);
    },
  });

  return {
    basicMutation,
    workMutation,
    communicationMutation,
    interestsMutation,
    avatarMutation,
    errorMessage,
    clearError: () => setErrorMessage(null),
  };
}