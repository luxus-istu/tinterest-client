"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileEditApi } from "../api/edit.api";
import useAuthStore from "@/src/features/auth/store/auth.store";
import { toast } from 'sonner';

function getApiErrorMessage(error: unknown, fallback: string) {
  if (typeof error !== "object" || error === null) return fallback;

  if ("response" in error && typeof error.response === "object" && error.response !== null) {
    const response = error.response as { data?: unknown };
    if (
      response.data &&
      typeof response.data === "object" &&
      response.data !== null &&
      "message" in response.data &&
      typeof (response.data as { message?: unknown }).message === "string"
    ) {
      return (response.data as { message: string }).message;
    }
  }

  return fallback;
}

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
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Ошибка обновления основной информации"));
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
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Ошибка обновления работы"));
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
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Ошибка обновления целей общения"));
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
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Ошибка обновления интересов"));
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
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Ошибка загрузки аватара"));
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