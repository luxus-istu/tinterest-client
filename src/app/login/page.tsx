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

type LoginInputs = {
  account: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginInputs>();

  const onSubmit: SubmitHandler<LoginInputs> = (data: LoginInputs) => {
    console.log("Login Data:", data);
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
            <TextField isRequired name="account">
              <Label>Почта или логин</Label>
              <Input
                placeholder="ivan@email.com"
                variant="secondary"
                {...register('account', { required: true })}
              />
              <FieldError />
            </TextField>

            <TextField isRequired name="password" type="password">
              <Label>Пароль</Label>
              <Input
                placeholder="••••••••"
                variant="secondary"
                {...register('password', { required: true })}
              />
              <FieldError />
            </TextField>
          </Card.Content>
          <Card.Footer className="flex flex-col gap-4 pt-2">
            <Button className="w-full" size="lg" type="submit">
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
