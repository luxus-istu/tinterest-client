export interface ChatUser {
  id: string
  name: string
  avatar: string
  isOnline: boolean
}

export interface Message {
  id: string
  chatId: string
  senderId: string
  senderName: string
  senderAvatar: string
  text: string
  timestamp: string
}

export interface Chat {
  id: string
  user: ChatUser
  isGroup: boolean
  memberCount?: number
  onlineCount?: number
  members?: ChatUser[]
  lastSender?: string
  messages: Message[]
  lastMessage: string
  lastMessageTime: string
  lastMessageDate: string
  unreadCount: number
}

const users: ChatUser[] = [
  {
    id: 'u1',
    name: 'Анна Смирнова',
    avatar: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg',
    isOnline: true,
  },
  {
    id: 'u2',
    name: 'Дмитрий Волков',
    avatar: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg',
    isOnline: true,
  },
  {
    id: 'u3',
    name: 'Елена Кузнецова',
    avatar: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg',
    isOnline: false,
  },
  {
    id: 'u4',
    name: 'Алексей Петров',
    avatar: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg',
    isOnline: true,
  },
  {
    id: 'u5',
    name: 'Мария Орлова',
    avatar: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg',
    isOnline: false,
  },
  { id: 'me', name: 'Вы', avatar: '', isOnline: true },
]

export const currentUserId = 'me'

const today = new Date()
const yesterday = new Date(today)
yesterday.setDate(yesterday.getDate() - 1)
const monday = new Date(today)
monday.setDate(monday.getDate() - ((today.getDay() + 6) % 7))

function iso(date: Date, time: string) {
  const [h, m] = time.split(':').map(Number)
  const d = new Date(date)
  d.setHours(h, m, 0, 0)
  return d.toISOString()
}

const avatarMap: Record<string, string> = {}
users.forEach((u) => {
  if (u.avatar) avatarMap[u.id] = u.avatar
})

function msg(senderId: string, senderName: string, text: string, timestamp: string): Message {
  return {
    id: '',
    chatId: '',
    senderId,
    senderName,
    senderAvatar: avatarMap[senderId] || '',
    text,
    timestamp,
  }
}

export const chats: Chat[] = [
  {
    id: 'chat1',
    user: users[0],
    isGroup: false,
    lastMessage: 'Отлично, договорились на завтра!',
    lastMessageTime: '14:23',
    lastMessageDate: iso(today, '14:23'),
    unreadCount: 3,
    messages: [
      { ...msg('u1', 'Анна', 'Привет! Как продвигается работа над проектом?', '14:15'), id: 'm1', chatId: 'chat1' },
      { ...msg('me', 'Вы', 'Привет! Всё хорошо, почти закончил макеты', '14:17'), id: 'm2', chatId: 'chat1' },
      { ...msg('u1', 'Анна', 'Супер! А что по срокам? Успеваем к пятнице?', '14:19'), id: 'm3', chatId: 'chat1' },
      { ...msg('me', 'Вы', 'Думаю да, осталось только сверстать пару страниц', '14:21'), id: 'm4', chatId: 'chat1' },
      { ...msg('u1', 'Анна', 'Отлично, договорились на завтра!', '14:23'), id: 'm5', chatId: 'chat1' },
    ],
  },
  {
    id: 'chat2',
    user: users[1],
    isGroup: false,
    lastMessage: 'Спасибо за информацию!',
    lastMessageTime: '12:05',
    lastMessageDate: iso(today, '12:05'),
    unreadCount: 0,
    messages: [
      { ...msg('me', 'Вы', 'Дмитрий, отправь пожалуйста документы по новому клиенту', '11:55'), id: 'm6', chatId: 'chat2' },
      { ...msg('u2', 'Дмитрий', 'Да, сейчас скину. Они у меня во вкладках', '11:58'), id: 'm7', chatId: 'chat2' },
      { ...msg('u2', 'Дмитрий', 'Вот файлы: договор, ТЗ и смета. Проверь пожалуйста', '12:02'), id: 'm8', chatId: 'chat2' },
      { ...msg('me', 'Вы', 'Получил, всё на месте. Спасибо за информацию!', '12:05'), id: 'm9', chatId: 'chat2' },
    ],
  },
  {
    id: 'chat3',
    user: users[2],
    isGroup: false,
    lastMessage: 'Можно встретиться в 15:00?',
    lastMessageTime: '09:47',
    lastMessageDate: iso(today, '09:47'),
    unreadCount: 1,
    messages: [
      { ...msg('u3', 'Елена', 'Здравствуйте! Меня зовут Елена, я менеджер проектов', '09:30'), id: 'm10', chatId: 'chat3' },
      { ...msg('me', 'Вы', 'Добрый день, Елена! Рад знакомству', '09:35'), id: 'm11', chatId: 'chat3' },
      { ...msg('u3', 'Елена', 'Можно встретиться в 15:00?', '09:47'), id: 'm12', chatId: 'chat3' },
    ],
  },
  {
    id: 'chat4',
    user: users[3],
    isGroup: false,
    lastMessage: 'Идет тестирование, скоро будет готово',
    lastMessageTime: 'Вчера',
    lastMessageDate: iso(yesterday, '17:15'),
    unreadCount: 0,
    messages: [
      { ...msg('u4', 'Алексей', 'Я запустил сервер для QA тестирования', 'Вчера, 16:12'), id: 'm13', chatId: 'chat4' },
      { ...msg('me', 'Вы', 'Отлично, как там дела? Много багов?', 'Вчера, 16:30'), id: 'm14', chatId: 'chat4' },
      { ...msg('u4', 'Алексей', 'Пока нашли 5 критичных, исправляю', 'Вчера, 16:45'), id: 'm15', chatId: 'chat4' },
      { ...msg('me', 'Вы', 'Держи в курсе, пожалуйста', 'Вчера, 17:00'), id: 'm16', chatId: 'chat4' },
      { ...msg('u4', 'Алексей', 'Идет тестирование, скоро будет готово', 'Вчера, 17:15'), id: 'm17', chatId: 'chat4' },
    ],
  },
  {
    id: 'chat5',
    user: users[4],
    isGroup: false,
    lastMessage: 'У меня есть интересная идея, давай обсудим',
    lastMessageTime: 'Пн',
    lastMessageDate: iso(monday, '10:22'),
    unreadCount: 5,
    messages: [
      { ...msg('u5', 'Мария', 'Привет! Видел твою презентацию на митапе', 'Пн, 10:05'), id: 'm18', chatId: 'chat5' },
      { ...msg('me', 'Вы', 'О, привет! Интересно было?', 'Пн, 10:12'), id: 'm19', chatId: 'chat5' },
      { ...msg('u5', 'Мария', 'Очень! Особенно понравилась часть про архитектуру', 'Пн, 10:15'), id: 'm20', chatId: 'chat5' },
      { ...msg('u5', 'Мария', 'Кстати, у меня есть интересная идея для совместного проекта', 'Пн, 10:18'), id: 'm21', chatId: 'chat5' },
      { ...msg('u5', 'Мария', 'Давай как-нибудь встретимся и обсудим?', 'Пн, 10:20'), id: 'm22', chatId: 'chat5' },
      { ...msg('u5', 'Мария', 'У меня есть интересная идея, давай обсудим', 'Пн, 10:22'), id: 'm23', chatId: 'chat5' },
    ],
  },
  {
    id: 'group1',
    user: { id: 'g1', name: 'Дизайн Tinterest', avatar: '', isOnline: false },
    isGroup: true,
    memberCount: 8,
    onlineCount: 3,
    members: [users[0], users[1], users[2], users[3]],
    lastSender: 'Анна',
    lastMessage: 'Отличный макет! Мне нравится цветовая гамма',
    lastMessageTime: '13:42',
    lastMessageDate: iso(today, '13:42'),
    unreadCount: 12,
    messages: [
      { ...msg('u1', 'Анна', 'Коллеги, кто отвечает за главный экран?', '12:00'), id: 'g1m1', chatId: 'group1' },
      { ...msg('u3', 'Елена', 'Я занимаюсь! Уже почти готово', '12:05'), id: 'g1m2', chatId: 'group1' },
      { ...msg('u4', 'Алексей', 'Скидывайте макеты в Figma, я посмотрю', '12:10'), id: 'g1m3', chatId: 'group1' },
      { ...msg('u1', 'Анна', 'Отличный макет! Мне нравится цветовая гамма', '13:42'), id: 'g1m4', chatId: 'group1' },
    ],
  },
  {
    id: 'group2',
    user: { id: 'g2', name: 'Митап Разработчиков', avatar: '', isOnline: false },
    isGroup: true,
    memberCount: 24,
    onlineCount: 7,
    members: [users[1], users[4], users[3], users[0]],
    lastSender: 'Дмитрий',
    lastMessage: 'Кто идет на конференцию в субботу?',
    lastMessageTime: '10:15',
    lastMessageDate: iso(today, '10:15'),
    unreadCount: 0,
    messages: [
      { ...msg('u2', 'Дмитрий', 'Всем привет! В субботу будет большой митап', '09:30'), id: 'g2m1', chatId: 'group2' },
      { ...msg('u5', 'Мария', 'Да, слышала! Кто выступает?', '09:35'), id: 'g2m2', chatId: 'group2' },
      { ...msg('u2', 'Дмитрий', 'Будут доклады по React 19 и AI в разработке', '09:40'), id: 'g2m3', chatId: 'group2' },
      { ...msg('me', 'Вы', 'Я пойду, давно хотел послушать про AI', '10:00'), id: 'g2m4', chatId: 'group2' },
      { ...msg('u2', 'Дмитрий', 'Кто идет на конференцию в субботу?', '10:15'), id: 'g2m5', chatId: 'group2' },
    ],
  },
]
