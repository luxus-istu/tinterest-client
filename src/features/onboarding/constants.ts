export const stepTitles = [
  'Основная информация',
  'Фото профиля',
  'Интересы',
  'Работа',
  'Формат общения',
  'О себе',
] as const

export const timeSlots = ['MORNING', 'AFTERNOON', 'EVENING', 'WEEKEND'] as const
export const goals = ['NEW_FRIENDS', 'NETWORKING', 'RELATIONSHIP'] as const
export const personalityTypes = ['INTROVERT', 'EXTROVERT', 'AMBIVERT'] as const

export const timeSlotLabels: Record<(typeof timeSlots)[number], string> = {
  MORNING: 'Утро',
  AFTERNOON: 'День',
  EVENING: 'Вечер',
  WEEKEND: 'Выходные',
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
