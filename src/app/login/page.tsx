"use client";

import {
  Button,
  Card,
  Form,
  Input,
  Label,
  TextField,
  FieldError,
} from "@heroui/react";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAuthActions } from "@/src/features/auth/hooks/useAuth";
import { LoginRequest } from "@/src/features/auth/types";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();
  const { login, isLogging } = useAuthActions();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit: SubmitHandler<LoginRequest> = async (data) => {
    setErrorMessage(null);
    try {
      await login(data);
      router.push("/");
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid account or password");
    }
  };

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
              <div className="rounded-lg bg-danger/10 p-3 text-sm text-danger text-center">
                {errorMessage}
              </div>
            )}

            <TextField isRequired isInvalid={!!errors.account} name="account">
              <Label>Почта или логин</Label>
              <Input
                placeholder="ivan@email.com"
                variant="secondary"
                {...register('account', { required: true, pattern: { value: /^\S+@\S+$/i, message: "Некорректная почта" } })}
              />
              <FieldError>{errors.account?.message}</FieldError>
            </TextField>

            <TextField isRequired isInvalid={!!errors.password} name="password" type="password">
              <Label>Пароль</Label>
              <Input
                placeholder="••••••••"
                variant="secondary"
                {...register('password', { required: true, minLength: { value: 8, message: "Минимум 8 символов" } })}
              />
              <FieldError>{errors.password?.message}</FieldError>
            </TextField>
          </Card.Content>
          <Card.Footer className="flex flex-col gap-4 pt-2">
            <Button
              className="w-full"
              size="lg"
              type="submit"
              isDisabled={isLogging}
            >
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
