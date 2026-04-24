"use client";

import {
  Button,
  Card,
  Description,
  FieldError,
  Form,
  Input,
  InputOTP,
  Label,
  REGEXP_ONLY_DIGITS,
  Radio,
  RadioGroup,
  TextField,
} from "@heroui/react";
import Link from "next/link";
import { useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { useAuthActions } from "@/src/features/auth/hooks/useAuth";
import type { RegisterRequest } from "@/src/features/auth/types";
import { useRouter } from "next/navigation";

type RegisterStep = "register" | "verify" | "verified";

export default function RegisterPageView() {
  const { register, handleSubmit, control, formState: { errors } } = useForm<RegisterRequest>({
    defaultValues: {
      gender: "male",
    },
  });

  const router = useRouter();

  const {
    register: registerAction,
    verifyEmailOtp,
    resendEmailOtp,
    isRegistering,
    isVerifyingEmailOtp,
    isResendingEmailOtp,
  } = useAuthActions();

  const [step, setStep] = useState<RegisterStep>("register");
  const [registeredEmail, setRegisteredEmail] = useState<string>("");
  const [otp, setOtp] = useState("");
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit: SubmitHandler<RegisterRequest> = async (data) => {
    setErrorMessage(null);
    setInfoMessage(null);
    try {
      const response = await registerAction(data);
      setRegisteredEmail(response.email);
      setInfoMessage(response.message);
      setStep("verify");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      setErrorMessage(message);
    }
  };

  const handleVerifyOtp = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const response = await verifyEmailOtp({ email: registeredEmail, otp });
      setSuccessMessage(response.message);
      setStep("verified");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "OTP verification failed";
      setErrorMessage(message);
    }
  };

  const handleResendOtp = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const response = await resendEmailOtp({ email: registeredEmail });
      setInfoMessage(response.message);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to resend OTP";
      setErrorMessage(message);
    }
  };

  const resetRegistration = () => {
    setStep("register");
    setOtp("");
    setRegisteredEmail("");
    setInfoMessage(null);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const renderOtpSlots = () => (
    <>
      <InputOTP.Group>
        <InputOTP.Slot index={0} />
        <InputOTP.Slot index={1} />
        <InputOTP.Slot index={2} />
      </InputOTP.Group>
      <InputOTP.Separator />
      <InputOTP.Group>
        <InputOTP.Slot index={3} />
        <InputOTP.Slot index={4} />
        <InputOTP.Slot index={5} />
      </InputOTP.Group>
    </>
  );

  const renderHeader = () => {
    if (step === "verify") {
      return (
        <>
          <Card.Title className="text-2xl font-black">Подтверждение почты</Card.Title>
          <Card.Description className="text-center font-medium">
            Введите 6-значный код подтверждения
          </Card.Description>
        </>
      );
    }

    if (step === "verified") {
      return (
        <>
          <Card.Title className="text-2xl font-black">Почта подтверждена</Card.Title>
          <Card.Description className="text-center font-medium">
            Аккаунт готов к использованию.
          </Card.Description>
        </>
      );
    }

    return (
      <>
        <Card.Title className="text-2xl font-black">Регистрация</Card.Title>
        <Card.Description className="font-medium text-center">
          Присоединяйтесь к Tinterest сегодня. Заполните свои данные, чтобы начать.
        </Card.Description>
      </>
    );
  };

  const renderRegisterStep = () => (
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
              {...register("firstName", { required: "Введите имя", minLength: { value: 2, message: "Минимум 2 символа" } })}
            />
            <FieldError>{errors.firstName?.message}</FieldError>
          </TextField>
          <TextField isRequired isInvalid={!!errors.lastName} name="lastName">
            <Label>Фамилия</Label>
            <Input
              placeholder="Иванов"
              variant="secondary"
              {...register("lastName", { required: "Введите фамилию", minLength: { value: 2, message: "Минимум 2 символа" } })}
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
            {...register("email", {
              required: true,
              pattern: { value: /^\S+@\S+$/i, message: "Некорректная почта" },
            })}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </TextField>

        <TextField isRequired isInvalid={!!errors.password} name="password" type="password">
          <Label>Пароль</Label>
          <Input
            placeholder="••••••••"
            variant="secondary"
            {...register("password", {
              required: true,
              minLength: { value: 8, message: "Минимум 8 символов" },
            })}
          />
          <FieldError>{errors.password?.message}</FieldError>
        </TextField>
      </Card.Content>
      <Card.Footer className="flex flex-col gap-4 pt-2">
        <Button className="w-full" size="lg" type="submit" isDisabled={isRegistering}>
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
  );

  const renderVerifyStep = () => (
    <Form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        void handleVerifyOtp();
      }}
    >
      <Card.Content className="flex flex-col gap-4">
        {errorMessage && (
          <div className="rounded-lg bg-danger/10 p-3 text-sm text-danger text-center">
            {errorMessage}
          </div>
        )}

        <div className="rounded-xl border border-success/30 bg-success/10 p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-success/90">
            Код отправлен на почту
          </p>
          <p className="mt-1 break-all text-base font-bold text-foreground">
            {registeredEmail}
          </p>
          <p className="mt-2 text-sm text-muted">
            Проверьте входящие и папку «Спам»
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Label>Код подтверждения</Label>
          <Description>Подсказка для демо: используйте код 123456</Description>
          <InputOTP
            maxLength={6}
            name="otp"
            pattern={REGEXP_ONLY_DIGITS}
            value={otp}
            variant="secondary"
            onChange={(value) => {
              setOtp(value);
              if (errorMessage) {
                setErrorMessage(null);
              }
            }}
          >
            {renderOtpSlots()}
          </InputOTP>
        </div>
      </Card.Content>

      <Card.Footer className="flex flex-col gap-3 pt-2">
        <Button className="w-full" size="lg" type="submit" isDisabled={otp.length !== 6 || isVerifyingEmailOtp}>
          Подтвердить почту
        </Button>
        <Button
          className="w-full"
          type="button"
          variant="outline"
          isDisabled={isResendingEmailOtp}
          onPress={handleResendOtp}
        >
          Отправить код повторно
        </Button>
        <Button className="w-full" type="button" variant="outline" onPress={resetRegistration}>
          Изменить данные регистрации
        </Button>
      </Card.Footer>
    </Form>
  );

  const renderVerifiedStep = () => (
    <Card.Content className="flex flex-col items-center gap-4 py-6 text-center">
      {(successMessage || infoMessage) && (
        <p className="text-lg font-bold text-success">{successMessage ?? infoMessage}</p>
      )}
      <Button className="w-full max-w-xs" variant="primary" onClick={() => router.push('/login')}>
        Перейти ко входу
      </Button>
    </Card.Content>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-2">
      <Card className="w-full max-w-lg shadow-xl">
        <Card.Header className="flex flex-col items-center gap-1 pb-2 text-center">
          {renderHeader()}
        </Card.Header>

        {step === "register" && renderRegisterStep()}
        {step === "verify" && renderVerifyStep()}
        {step === "verified" && renderVerifiedStep()}
      </Card>
    </div>
  );
}
