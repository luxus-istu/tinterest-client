export const stepTitles = [
  'Основная информация',
  'Фото профиля',
  'Интересы',
  'Работа',
  'Формат общения',
  'О себе',
] as const

export const workFormats = ['OFFICE', 'REMOTE', 'HYBRID'] as const
export const communicationFormats = ['OFFLINE', 'ONLINE', 'TEXT'] as const
export const goals = ['NEW_FRIENDS', 'NETWORKING', 'RELATIONSHIP'] as const
export const personalityTypes = ['INTROVERT', 'EXTROVERT', 'AMBIVERT'] as const

export const workFormatLabels: Record<(typeof workFormats)[number], string> = {
  OFFICE: 'Офис',
  REMOTE: 'Удаленно',
  HYBRID: 'Гибрид',
}

export const communicationFormatLabels: Record<(typeof communicationFormats)[number], string> = {
  OFFLINE: 'Оффлайн',
  ONLINE: 'Онлайн',
  TEXT: 'Переписка',
}

export const goalLabels: Record<(typeof goals)[number], string> = {
  NEW_FRIENDS: 'Новые друзья',
  NETWORKING: 'Нетворкинг',
  RELATIONSHIP: 'Отношения',
}

export const personalityTypeLabels: Record<(typeof personalityTypes)[number], string> = {
  INTROVERT: 'Интроверт',
  EXTROVERT: 'Экстраверт',
  AMBIVERT: 'Амбиверт',
}
