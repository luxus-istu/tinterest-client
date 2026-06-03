'use client';

import { SmartCaptcha } from "@yandex/smart-captcha";

interface YandexCaptchaProps {
  onSuccess: (token: string) => void
}

export default function YandexCaptcha({ onSuccess }: YandexCaptchaProps) {
  const isDev = process.env.NODE_ENV === 'development' ? false : true;
  const sitekey = process.env.NEXT_PUBLIC_CAPTCHA_SITEKEY || "";

  return (
    <SmartCaptcha theme='dark' sitekey={sitekey} test={isDev} onSuccess={onSuccess} />
  );
}
