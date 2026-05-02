"use client";

import { Button, Card, CloseButton, FieldError, Form, Input, Label, Spinner, TextField } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useAuthActions } from "@/src/features/auth/hooks/useAuth";
import { useAuthGuard } from "@/src/features/auth/hooks/useAuthGuard";
import { LoginRequestSchema } from "@/src/features/auth/types";
import type { LoginRequest } from "@/src/features/auth/types";
import { ApiError } from "@/src/lib/api";

export function LoginPageView() {
  const { isLoading } = useAuthGuard({ requireAuth: false, redirectTo: '/search' })
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
  });
  const { login, isLogging } = useAuthActions();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit: SubmitHandler<LoginRequest> = useCallback(async (data) => {
    setErrorMessage(null);
    try {
      await login(data);
      router.push("/search");
    } catch (err: unknown) {
      const message = err instanceof ApiError
        ? err.message
        : err instanceof Error
          ? err.message
          : "Invalid account or password";
      setErrorMessage(message);
    }
  }, [login, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-2">
      <Card className="w-full max-w-lg shadow-xl">
        <Card.Header className="flex flex-col items-center gap-1 pb-2 text-center">
          <Card.Title className="text-2xl font-black">Вход</Card.Title>
          <Card.Description className="text-center font-medium">
            Войдите в свой аккаунт Tinterest, чтобы продолжить.
          </Card.Description>
        </Card.Header>
        <Form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Card.Content className="flex flex-col gap-4">
            {errorMessage && (
              <div className="relative rounded-lg bg-danger/10 p-3 pr-10 text-center text-sm text-danger">
                {errorMessage}
            <CloseButton
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onPress={() => setErrorMessage(null)}
            />
              </div>
            )}

            <TextField isRequired isInvalid={!!errors.email} name="email">
              <Label>Почта или логин</Label>
              <Input
                placeholder="ivan@email.com"
                variant="secondary"
                {...register("email")}
              />
              <FieldError>{errors.email?.message}</FieldError>
            </TextField>

            <TextField isRequired isInvalid={!!errors.password} name="password" type="password">
              <Label>Пароль</Label>
              <Input
                placeholder="••••••••"
                variant="secondary"
                {...register("password")}
              />
              <FieldError>{errors.password?.message}</FieldError>
            </TextField>
          </Card.Content>
          <Card.Footer className="flex flex-col gap-4 pt-2">
            <Button className="w-full" size="lg" type="submit" isDisabled={isLogging}>
              Войти
            </Button>
            <p className="text-center text-sm text-muted">
              Нет аккаунта?{" "}
              <Link className="font-medium text-accent hover:underline" href="/register">
                Зарегистрироваться
              </Link>
            </p>
          </Card.Footer>
        </Form>
      </Card>
    </div>
  );
}
