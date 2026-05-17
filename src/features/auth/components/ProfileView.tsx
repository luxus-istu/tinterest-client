"use client";

import { useQuery } from "@tanstack/react-query";
import { profileApi } from "@/src/features/auth/api/profile.api";
import useAuthStore from "@/src/features/auth/store/auth.store";
import { useAuthActions } from "@/src/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LogOut,
  MessageCircle,
  MapPin,
  Pencil,
  User,
  Clock,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@heroui/react";

function calculateAge(birthDateStr: string | undefined): number | null {
  if (!birthDateStr) return null;
  const birthDate = new Date(birthDateStr);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function ProfileView() {
  const router = useRouter();
  const storedUser = useAuthStore((s) => s.user);
  const { logout, isLoggingOut } = useAuthActions();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile", "me"],
    queryFn: () => profileApi.getMe(),
    initialData: storedUser,
  });

  const profile = data;

  if (isLoading && !profile) {
    return (
      <main className="px-5">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-white">Загрузка...</div>
        </div>
      </main>
    );
  }

  if (isError || !profile) {
    return (
      <main className="px-5">
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
          <User size={48} className="text-gray-400" strokeWidth={1.5} />
          <p className="text-white">Не удалось загрузить профиль</p>
        </div>
      </main>
    );
  }

  const age = calculateAge(profile.dateOfBirth);
  const ageString = age ? `${age} лет` : "возраст не указан";
  const interests = (profile.interests || []).slice(0, 6);

  const getInterestName = (interest: string | { name: string }): string => {
    return typeof interest === "string" ? interest : interest.name;
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <main className="flex justify-center">
      <div className="w-full max-w-screen-sm px-5">
        <header className="flex items-center justify-between pt-15">
          <h1 className="text-3xl font-bold text-white">Профиль</h1>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="rounded-full p-2 transition-colors hover:bg-white/10"
            aria-label="Выйти"
          >
            {isLoggingOut ? (
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <LogOut className="h-6 w-6 stroke-white stroke-2" />
            )}
          </button>
        </header>

        <section className="flex flex-col items-start justify-center pt-10">
          <div className="flex items-center justify-between gap-6">
            <div
              className="size-28 rounded-full bg-cover bg-center"
              style={{ backgroundImage: `url('${profile.avatarUrl || ""}')` }}
            />
            <div className="flex flex-col gap-2">
              <p className="text-xl font-bold text-white">
                {profile.firstName || profile.lastName
                  ? `${profile.firstName || ""} ${profile.lastName || ""}`
                  : "username"}
                <span>, {ageString}</span>
              </p>
              <div className="flex w-fit items-center justify-center gap-2 rounded-full bg-[#2C2C2E] px-2 py-1.5">
                <MessageCircle className="h-5 stroke-white stroke-2" />
                <p className="text-white">{profile.goal || "Не указана"}</p>
              </div>
            </div>
          </div>

          <section className="mt-6 w-full pb-10">
            <h2 className="mb-4 text-2xl font-bold text-white">Ваша анкета</h2>
            <Card className="border-none bg-[#0A0A0A] shadow-lg shadow-white/5">
              <CardHeader className="p-0">
                <div
                  className="aspect-4/6 w-full rounded-t-xl bg-cover bg-center p-6"
                  style={{ backgroundImage: `url('${profile.avatarUrl || ""}')` }}
                >
                  <div className="flex justify-between">
                    <div className="flex flex-col gap-2">
                      <p className="text-xl font-bold text-white">
                        {profile.firstName || profile.lastName
                          ? `${profile.firstName || ""} ${profile.lastName || ""}`
                          : "username"}
                        <span>, {ageString}</span>
                      </p>
                      <div className="flex w-fit items-center justify-center gap-2 rounded-full bg-[#2C2C2E] px-2 py-1.5">
                        <MessageCircle className="h-5 stroke-white stroke-2" />
                        <p className="text-white">{profile.goal || "Не указана"}</p>
                      </div>
                      <div className="flex w-fit items-center justify-center gap-2 rounded-full bg-[#2C2C2E] px-2 py-1.5">
                        <MapPin className="h-5 stroke-white stroke-2" />
                        <p className="text-white">{profile.city || "Город не указан"}</p>
                      </div>
                    </div>
                    <Link href="/profile/edit">
                      <Pencil className="h-9 stroke-white stroke-2" />
                    </Link>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col gap-5 p-6">
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-lg font-bold text-[#8E8E93]">Обо мне</h3>
                  <div className="max-h-40 overflow-y-auto whitespace-pre-wrap wrap-break-word rounded-md pr-1">
                    <p className="text-lg text-white">
                      {profile.about || "Информация не указана"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <h3 className="text-lg font-bold text-[#8E8E93]">Должность</h3>
                  <p className="text-lg text-white">
                    {profile.jobTitle || "Не указана"}
                    {profile.department && ` · ${profile.department}`}
                  </p>
                </div>

                {profile.personalityType && (
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-lg font-bold text-[#8E8E93]">Тип личности</h3>
                    <p className="text-lg text-white">{profile.personalityType}</p>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <h3 className="text-lg font-bold text-[#8E8E93]">Меня интересует</h3>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {interests.map((interest, idx) => (
                      <div
                        key={idx}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2C2C2E] px-2 py-1.5"
                      >
                        <span className="truncate text-sm text-white">
                          {getInterestName(interest)}
                        </span>
                      </div>
                    ))}
                    {interests.length === 0 && (
                      <p className="col-span-2 text-gray-400 sm:col-span-3">
                        Интересы не указаны
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>

              {profile.timeSlots && profile.timeSlots.length > 0 && (
                <CardFooter className="flex flex-col items-start gap-1.5 p-6 pt-0">
                  <h3 className="text-lg font-bold text-[#8E8E93]">Удобное время</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.timeSlots.map((slot) => (
                      <div
                        key={slot}
                        className="flex items-center gap-2 rounded-lg bg-[#2C2C2E] px-3 py-1.5"
                      >
                        <Clock className="h-4 stroke-white" />
                        <span className="text-sm text-white">{slot}</span>
                      </div>
                    ))}
                  </div>
                </CardFooter>
              )}
            </Card>
          </section>
        </section>
      </div>
    </main>
  );
}