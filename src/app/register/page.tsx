"use client";

import {
  Button,
  Card,
  Form,
  Input,
  Label,
  Radio,
  RadioGroup,
  TextField,
  FieldError,
} from "@heroui/react";
import Link from "next/link";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { useAuthActions } from "@/src/features/auth/hooks/useAuth";
import type { RegisterRequest } from "@/src/features/auth/types";
import { type AnchorHTMLAttributes, type DetailedHTMLProps, useState } from "react";

export default function RegisterPage() {
  const { register, handleSubmit, control, formState: { errors } } = useForm<RegisterRequest>({
    defaultValues: {
      gender: 'male'
    }
  });
  const { register: registerAction, isRegistering } = useAuthActions();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit: SubmitHandler<RegisterRequest> = async (data) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const response = await registerAction(data);
      setSuccessMessage(response.message);
    } catch (err: any) {
      setErrorMessage(err.message || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-2">
      <Card className="w-full max-w-lg shadow-xl">
        <Card.Header className="flex flex-col items-center gap-1 pb-2 text-center">
          <Card.Title className="text-2xl font-black">Регистрация</Card.Title>
          <Card.Description className="font-medium text-center">
            Присоединяйтесь к Tinterest сегодня. Заполните свои данные, чтобы начать.
          </Card.Description>
        </Card.Header>

        {successMessage ? (
          <Card.Content className="flex flex-col items-center gap-4 py-6 text-center text-success">
            <p className="text-lg font-bold">{successMessage}</p>
            <Button
              variant="primary"
              render={(props) => <Link {...props as DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>} href="/login" />}
            >
              Перейти ко входу
            </Button>
          </Card.Content>
        ) : (
          <Form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <Card.Content className="flex flex-col gap-4">
              {errorMessage && (
                <div className="rounded-lg bg-danger/10 p-3 text-sm text-danger">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextField isRequired isInvalid={!!errors.firstName} name="firstName">
                  <Label>Имя</Label>
                  <Input
                    placeholder="Иван"
                    variant="secondary"
                    {...register('firstName', { required: "Введите имя", minLength: { value: 2, message: "Минимум 2 символа" } })}
                  />
                  <FieldError>{errors.firstName?.message}</FieldError>
                </TextField>
                <TextField isRequired isInvalid={!!errors.lastName} name="lastName">
                  <Label>Фамилия</Label>
                  <Input
                    placeholder="Иванов"
                    variant="secondary"
                    {...register('lastName', { required: "Введите фамилию", minLength: { value: 2, message: "Минимум 2 символа" } })}
                  />
                  <FieldError>{errors.lastName?.message}</FieldError>
                </TextField>
              </div>

              <Controller
                control={control}
                name="gender"
                rules={{ required: true }}
                render={({ field }) => (
                  <RadioGroup
                    isRequired
                    orientation="horizontal"
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <Label>Пол</Label>
                    <div className="flex gap-4 pt-2">
                      <Radio value="male">
                        <Radio.Control>
                          <Radio.Indicator />
                        </Radio.Control>
                        <Radio.Content>
                          <Label>Мужской</Label>
                        </Radio.Content>
                      </Radio>
                      <Radio value="female">
                        <Radio.Control>
                          <Radio.Indicator />
                        </Radio.Control>
                        <Radio.Content>
                          <Label>Женский</Label>
                        </Radio.Content>
                      </Radio>
                    </div>
                  </RadioGroup>
                )}
              />

              <TextField isRequired isInvalid={!!errors.email} name="email" type="email">
                <Label>Почта</Label>
                <Input
                  placeholder="ivan@email.com"
                  variant="secondary"
                  {...register('email', {
                    required: true,
                    pattern: { value: /^\S+@\S+$/i, message: "Некорректная почта" }
                  })}
                />
                <FieldError>{errors.email?.message}</FieldError>
              </TextField>

              <TextField isRequired isInvalid={!!errors.password} name="password" type="password">
                <Label>Пароль</Label>
                <Input
                  placeholder="••••••••"
                  variant="secondary"
                  {...register('password', {
                    required: true,
                    minLength: { value: 8, message: "Минимум 8 символов" }
                  })}
                />
                <FieldError>{errors.password?.message}</FieldError>
              </TextField>
            </Card.Content>
            <Card.Footer className="flex flex-col gap-4 pt-2">
              <Button
                className="w-full"
                size="lg"
                type="submit"
                isDisabled={isRegistering}
              >
                Зарегистрироваться
              </Button>
              <p className="text-center text-sm text-muted">
                Уже есть аккаунт?{" "}
                <Link className="font-medium text-accent hover:underline" href="/login">
                  Войти
                </Link>
              </p>
            </Card.Footer>
          </Form>
        )}
      </Card>
    </div>
  );
}
