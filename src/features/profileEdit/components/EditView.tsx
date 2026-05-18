"use client";

import { useQuery } from "@tanstack/react-query";
import { profileApi } from "@/src/features/auth/api/profile.api";
import useAuthStore from "@/src/features/auth/store/auth.store";
import { useProfileEdit } from "../hooks/useProfileEdit";
import { profileEditApi } from "../api/edit.api";
import { useForm, useWatch } from "react-hook-form";
import { timeSlotLabels } from "@/src/features/onboarding/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BasicInfoEditSchema,
  WorkEditSchema,
  CommunicationEditSchema,
  InterestsEditSchema,
  type BasicInfoEditFormValues,
  type WorkEditFormValues,
  type CommunicationEditFormValues,
  type InterestsEditFormValues,
} from "../types";
import type { Interest } from "@/src/features/onboarding/types";
import {
  Card,
  CardHeader,
  CardContent,
  Input,
  TextArea,
  Button,
  Checkbox,
  Avatar,
  Spinner,
  Select,
  Label,
  ListBox,
  TextField,
  FieldError,
} from "@heroui/react";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";

const TIME_SLOTS = [
  'MORNING',
  'AFTERNOON',
  'EVENING',
  'WEEKEND',
] as const;


const GOAL_OPTIONS = [
  { value: "NEW_FRIENDS", label: "Новые друзья" },
  { value: "NETWORKING", label: "Нетворкинг" },
  { value: "RELATIONSHIP", label: "Отношения" },
];

const PERSONALITY_TYPES = [
  { value: "INTROVERT", label: "Интроверт" },
  { value: "EXTROVERT", label: "Экстраверт" },
  { value: "AMBIVERT", label: "Амбиверт" },
];

export function EditView() {
  const storedUser = useAuthStore((s) => s.user);
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", "me"],
    queryFn: () => profileApi.getMe(),
    initialData: storedUser,
  });

  const {
    basicMutation,
    workMutation,
    communicationMutation,
    interestsMutation,
    avatarMutation,
    errorMessage,
    clearError,
  } = useProfileEdit();

  const interestsQuery = useQuery<Interest[]>({
    queryKey: ["interests"],
    queryFn: profileEditApi.getInterests,
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const basicForm = useForm<BasicInfoEditFormValues>({
    resolver: zodResolver(BasicInfoEditSchema),
    defaultValues: {
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      middleName: profile?.middleName || "",
      dateOfBirth: profile?.dateOfBirth || "",
      gender: profile?.gender || "MALE",
      language: profile?.language === "en" ? "en" : "ru",
      city: profile?.city || "",
      about: profile?.about || "",
    },
  });

  const workForm = useForm<WorkEditFormValues>({
    resolver: zodResolver(WorkEditSchema),
    defaultValues: {
      jobTitle: profile?.jobTitle || "",
      department: profile?.department || "",
    },
  });

  const communicationForm = useForm<CommunicationEditFormValues>({
    resolver: zodResolver(CommunicationEditSchema),
    defaultValues: {
      goal: profile?.goal || "NEW_FRIENDS",
      personalityType: profile?.personalityType || "INTROVERT",
      timeSlots: profile?.timeSlots || [],
    },
  });

  // Форма интересов (будет отдельный компонент с чекбоксами из API)
  const interestsForm = useForm<InterestsEditFormValues>({
    resolver: zodResolver(InterestsEditSchema),
    defaultValues: {
      interests: profile?.interests || [],
    },
  });

  useEffect(() => {
    if (!profile) return;

    basicForm.reset({
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      middleName: profile.middleName || "",
      dateOfBirth: profile.dateOfBirth || "",
      gender: profile.gender || "MALE",
      language: profile.language === "en" ? "en" : "ru",
      city: profile.city || "",
      about: profile.about || "",
    });

    workForm.reset({
      jobTitle: profile.jobTitle || "",
      department: profile.department || "",
    });

    communicationForm.reset({
      goal: profile.goal || "NEW_FRIENDS",
      personalityType: profile.personalityType || "INTROVERT",
      timeSlots: profile.timeSlots || [],
    });

    interestsForm.reset({
      interests: profile.interests || [],
    });
  }, [profile, basicForm, workForm, communicationForm, interestsForm]);

  const basicGender = basicForm.watch("gender");
  const basicLanguage = basicForm.watch("language");
  const communicationGoal = communicationForm.watch("goal");
  const communicationPersonalityType = communicationForm.watch("personalityType");
  const communicationTimeSlots = communicationForm.watch("timeSlots");
  const selectedInterests = useWatch({
    control: interestsForm.control,
    name: "interests",
  }) ?? [];

  const onSubmitBasic: SubmitHandler<BasicInfoEditFormValues> = (values) => {
    basicMutation.mutate(values);
  };

  const onSubmitWork: SubmitHandler<WorkEditFormValues> = (values) => {
    workMutation.mutate({
      jobTitle: values.jobTitle || "",
      department: values.department || "",
    });
  };

  const onSubmitCommunication: SubmitHandler<CommunicationEditFormValues> = (values) => {
    communicationMutation.mutate(values);
  };

  const onSubmitInterests: SubmitHandler<InterestsEditFormValues> = (values) => {
    interestsMutation.mutate(values);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      avatarMutation.mutate(file);
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" color="warning" />
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-white">Не удалось загрузить профиль</p>
      </main>
    );
  }

  return (
    <main className="flex justify-center">
      <div className="w-full max-w-screen-sm px-5 pb-16">
        <header className="flex items-center justify-between pt-15">
          <Link href="/profile">
            <ArrowLeft className="h-6 w-6 stroke-white stroke-2" />
          </Link>
          <h1 className="text-2xl font-bold text-white">Редактирование профиля</h1>
          <div className="w-6" />
        </header>

        {errorMessage && (
          <div className="mt-4 rounded-lg bg-danger/10 p-3 text-center text-sm text-danger">
            {errorMessage}
            <button onClick={clearError} className="ml-2 text-white underline">
              Закрыть
            </button>
          </div>
        )}

        <Card className="mt-6 border-none bg-[#0A0A0A] shadow-lg shadow-white/5">
          <CardHeader className="pb-2">
            <h2 className="text-lg font-bold text-white">Аватар</h2>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Avatar size="lg" className="h-24 w-24">
              <Avatar.Image
                alt="Avatar"
                src={avatarFile ? URL.createObjectURL(avatarFile) : profile.avatarUrl || undefined}
              />
              <Avatar.Fallback>avatar</Avatar.Fallback>
            </Avatar>
            <label className="cursor-pointer rounded-full bg-[#2C2C2E] px-4 py-2 text-sm text-white hover:bg-[#3C3C3E]">
              <Upload className="mr-2 inline h-4 w-4" />
              Загрузить новый
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
            {avatarMutation.isPending && <Spinner size="sm" />}
          </CardContent>
        </Card>

        <Card className="mt-6 border-none bg-[#0A0A0A] shadow-lg shadow-white/5">
          <CardHeader>
            <h2 className="text-lg font-bold text-white">Основная информация</h2>
          </CardHeader>
          <CardContent>
             <form onSubmit={basicForm.handleSubmit(onSubmitBasic)} className="flex flex-col gap-4">
              <TextField isInvalid={!!basicForm.formState.errors.firstName}>
                <Label>Имя</Label>
                <Input {...basicForm.register("firstName")} />
                <FieldError>{basicForm.formState.errors.firstName?.message}</FieldError>
              </TextField>

              <TextField isInvalid={!!basicForm.formState.errors.lastName}>
                <Label>Фамилия</Label>
                <Input {...basicForm.register("lastName")} />
                <FieldError>{basicForm.formState.errors.lastName?.message}</FieldError>
              </TextField>

              <TextField>
                <Label>Отчество</Label>
                <Input {...basicForm.register("middleName")} />
              </TextField>

              <TextField type="date" isInvalid={!!basicForm.formState.errors.dateOfBirth}>
                <Label>Дата рождения</Label>
                <Input {...basicForm.register("dateOfBirth")} />
                <FieldError>{basicForm.formState.errors.dateOfBirth?.message}</FieldError>
              </TextField>

              <Select
                selectedKey={basicGender || null}
                onSelectionChange={(key) => {
                  if (key === "MALE" || key === "FEMALE") {
                    basicForm.setValue("gender", key);
                  }
                }}
              >
                <Label>Пол</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    <ListBox.Item id="MALE" textValue="Мужской">
                      Мужской
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="FEMALE" textValue="Женский">
                      Женский
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>

              <Select
                selectedKey={basicLanguage || null}
                onSelectionChange={(key) => {
                  if (key === "ru" || key === "en") {
                    basicForm.setValue("language", key);
                  }
                }}
              >
                <Label>Язык интерфейса</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    <ListBox.Item id="ru" textValue="Русский">
                      Русский
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="en" textValue="English">
                      English
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>

              <TextField isInvalid={!!basicForm.formState.errors.city}>
                <Label>Город</Label>
                <Input {...basicForm.register("city")} />
                <FieldError>{basicForm.formState.errors.city?.message}</FieldError>
              </TextField>
              <Label htmlFor="textarea">О себе</Label>
              <TextArea id="textarea" placeholder="О себе" {...basicForm.register("about")} />

              <Button type="submit" variant="primary" isDisabled={basicMutation.isPending}>
                Сохранить основную информацию
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6 border-none bg-[#0A0A0A] shadow-lg shadow-white/5">
          <CardHeader>
            <h2 className="text-lg font-bold text-white">Работа</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={workForm.handleSubmit(onSubmitWork)} className="flex flex-col gap-4">
              <Label htmlFor="work1">Должность</Label>
              <Input id="work1" aria-label="Должность" {...workForm.register("jobTitle")} />
              <Label htmlFor="work2">Должность</Label>
              <Input id="work2" aria-label="Отдел" {...workForm.register("department")} />
              <Button type="submit" variant="primary" isDisabled={workMutation.isPending}>
                Сохранить работу
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6 border-none bg-[#0A0A0A] shadow-lg shadow-white/5">
          <CardHeader>
            <h2 className="text-lg font-bold text-white">Цели и общение</h2>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={communicationForm.handleSubmit(onSubmitCommunication)}
              className="flex flex-col gap-4"
            >
              <Select
                selectedKey={communicationGoal || null}
                onSelectionChange={(key) => {
                  if (typeof key === "string") {
                    communicationForm.setValue("goal", key);
                  }
                }}
              >
                <Label>Цель</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {GOAL_OPTIONS.map((opt) => (
                      <ListBox.Item key={opt.value} id={opt.value} textValue={opt.label}>
                        {opt.label}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>

              <Select
                selectedKey={communicationPersonalityType || null}
                onSelectionChange={(key) => {
                  if (typeof key === "string") {
                    communicationForm.setValue("personalityType", key);
                  }
                }}
              >
                <Label>Тип личности</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {PERSONALITY_TYPES.map((pt) => (
                      <ListBox.Item key={pt.value} id={pt.value} textValue={pt.label}>
                        {pt.label}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>

              <div className="grid gap-3 sm:grid-cols-2">
                {TIME_SLOTS.map((slot) => (
                  <Checkbox
                    key={slot}
                    isSelected={communicationTimeSlots.includes(slot)}
                    onChange={(checked) => {
                      const nextSlots = checked
                        ? [...communicationTimeSlots, slot]
                        : communicationTimeSlots.filter((value) => value !== slot);
                      communicationForm.setValue("timeSlots", nextSlots);
                    }}
                  >
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                    <Checkbox.Content>
                      <Label>{timeSlotLabels[slot] ?? slot}</Label>
                    </Checkbox.Content>
                  </Checkbox>
                ))}
              </div>

              <Button type="submit" variant="primary" isDisabled={communicationMutation.isPending}>
                Сохранить цели
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Интересы */}
        <Card className="mt-6 border-none bg-[#0A0A0A] shadow-lg shadow-white/5">
          <CardHeader>
            <h2 className="text-lg font-bold text-white">Интересы</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={interestsForm.handleSubmit(onSubmitInterests)} className="flex flex-col gap-4">
              {interestsQuery.isLoading && (
                <p className="text-sm text-[#8E8E93]">Загружаем список интересов...</p>
              )}
              {interestsQuery.isError && (
                <p className="text-sm text-danger">Не удалось загрузить интересы.</p>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                {interestsQuery.data?.map((interest) => {
                  const isSelected = selectedInterests.includes(interest.name);

                  return (
                    <Checkbox
                      key={interest.id}
                      isSelected={isSelected}
                      onChange={(checked) => {
                        const nextValues = checked
                          ? Array.from(new Set([...selectedInterests, interest.name]))
                          : selectedInterests.filter((name) => name !== interest.name);

                        interestsForm.setValue("interests", nextValues, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                    >
                      <Checkbox.Control>
                        <Checkbox.Indicator />
                      </Checkbox.Control>
                      <Checkbox.Content>
                        <Label>{interest.name}</Label>
                      </Checkbox.Content>
                    </Checkbox>
                  );
                })}
              </div>

              <Button type="submit" variant="primary" isDisabled={interestsMutation.isPending}>
                Сохранить интересы
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}