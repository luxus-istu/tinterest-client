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
import { SubmitHandler, useForm } from "react-hook-form";

type RegisterInputs = {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const { register, handleSubmit } = useForm<RegisterInputs>();

  const onSubmit: SubmitHandler<RegisterInputs> = (data: RegisterInputs) => {
    console.log(data);
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
        <Form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Card.Content className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField isRequired name="firstName">
                <Label>Имя</Label>
                <Input placeholder="Иван" variant="secondary" {...register('firstName', { required: true, max: 255, min: 3 })} />
                <FieldError />
              </TextField>
              <TextField isRequired name="lastName">
                <Label>Фамилия</Label>
                <Input placeholder="Иванов" variant="secondary" {...register('lastName', { required: true, max: 255, min: 3 })} />
                <FieldError />
              </TextField>
            </div>

            <RadioGroup isRequired orientation="horizontal" defaultValue={'male'}>
              <Label>Пол</Label>
              <div className="flex gap-4 pt-2" {...register('gender', { required: true })}>
                <Radio value="male" >
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
              <FieldError />
            </RadioGroup>

            <TextField isRequired name="email" type="email">
              <Label>Почта</Label>
              <Input placeholder="ivan@email.com" variant="secondary"{...register('email', { required: true })} />
              <FieldError />
            </TextField>

            <TextField isRequired name="password" type="password">
              <Label>Пароль</Label>
              <Input placeholder="••••••••" variant="secondary" {...register('password', { required: true, max: 255, min: 8 })} />
              <FieldError />
            </TextField>
          </Card.Content>
          <Card.Footer className="flex flex-col gap-4 pt-2">
            <Button className="w-full" size="lg" type="submit">
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
      </Card>
    </div>
  );
}
