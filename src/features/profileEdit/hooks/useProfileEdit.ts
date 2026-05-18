"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileEditApi } from "../api/edit.api";
import useAuthStore from "@/src/features/auth/store/auth.store";

export function useProfileEdit() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const basicMutation = useMutation({
    mutationFn: profileEditApi.updateBasic,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
      setErrorMessage(null);
    },
    onError: (error: any) => {
      setErrorMessage(error?.response?.data?.message || "Ошибка обновления основной информации");
    },
  });

  const workMutation = useMutation({
    mutationFn: profileEditApi.updateWork,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
      setErrorMessage(null);
    },
    onError: (error: any) => {
      setErrorMessage(error?.response?.data?.message || "Ошибка обновления работы");
    },
  });

  const communicationMutation = useMutation({
    mutationFn: profileEditApi.updateCommunication,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
      setErrorMessage(null);
    },
    onError: (error: any) => {
      setErrorMessage(error?.response?.data?.message || "Ошибка обновления целей общения");
    },
  });

  const interestsMutation = useMutation({
    mutationFn: profileEditApi.updateInterests,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
      setErrorMessage(null);
    },
    onError: (error: any) => {
      setErrorMessage(error?.response?.data?.message || "Ошибка обновления интересов");
    },
  });

  const avatarMutation = useMutation({
    mutationFn: profileEditApi.uploadAvatar,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
      setErrorMessage(null);
    },
    onError: (error: any) => {
      setErrorMessage(error?.response?.data?.message || "Ошибка загрузки аватара");
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