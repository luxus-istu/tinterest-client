'use client'

import { useMemo, useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Chip,
  Input,
  Label,
  Table,
} from '@heroui/react'
import { useAdmin } from '../hooks/useAdmin'

export function AdminView() {
  const [selectedTab, setSelectedTab] = useState<'users' | 'interests'>('users')
  const [newInterest, setNewInterest] = useState('')

  const {
    usersQuery,
    statisticsQuery,
    interestsQuery,
    searchText,
    setSearchText,
    usersPage,
    setUsersPage,
    interestsPage,
    setInterestsPage,
    interestsPageSize,
    blockMutation,
    unblockMutation,
    addInterestMutation,
    deleteInterestMutation,
  } = useAdmin()

  const users = usersQuery.data?.content ?? []
  const interests = useMemo(() => interestsQuery.data ?? [], [interestsQuery.data])
  const pagedInterests = useMemo(() => {
    const start = interestsPage * interestsPageSize
    return interests.slice(start, start + interestsPageSize)
  }, [interests, interestsPage, interestsPageSize])

  const totalUserPages = usersQuery.data?.totalPages ?? 1
  const totalInterestPages = Math.max(1, Math.ceil(interests.length / interestsPageSize))

  const isBusy =
    blockMutation.isPending ||
    unblockMutation.isPending ||
    addInterestMutation.isPending ||
    deleteInterestMutation.isPending

  const statistics = statisticsQuery.data

  const statusText = useMemo(() => {
    if (usersQuery.isLoading || statisticsQuery.isLoading || interestsQuery.isLoading) {
      return 'Загрузка данных...'
    }
    if (usersQuery.isError || statisticsQuery.isError || interestsQuery.isError) {
      return 'Ошибка загрузки данных админки'
    }
    return null
  }, [usersQuery.isLoading, statisticsQuery.isLoading, interestsQuery.isLoading, usersQuery.isError, statisticsQuery.isError, interestsQuery.isError])

  const handleAddInterest = async () => {
    if (!newInterest.trim()) {
      return
    }

    await addInterestMutation.mutateAsync(newInterest.trim())
    setNewInterest('')
  }

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Админ-панель</h1>
            <p className="text-sm text-gray-400">Управление пользователями, интересами и статистикой.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="bg-[#0A0A0A] p-4">
              <CardTitle className="text-white text-base">Пользователи</CardTitle>
              <CardDescription className="text-gray-400">{statistics?.totalUsers ?? '—'}</CardDescription>
            </Card>
            <Card className="bg-[#0A0A0A] p-4">
              <CardTitle className="text-white text-base">Матчи</CardTitle>
              <CardDescription className="text-gray-400">{statistics?.totalMatches ?? '—'}</CardDescription>
            </Card>
            <Card className="bg-[#0A0A0A] p-4">
              <CardTitle className="text-white text-base">Интересов</CardTitle>
              <CardDescription className="text-gray-400">{interests.length}</CardDescription>
            </Card>
          </div>
        </div>

        <Card className="bg-[#0A0A0A] shadow-lg">
          <CardHeader className="flex flex-col gap-3 border-b border-gray-800 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-white">Управление данными</CardTitle>
              <CardDescription className="text-gray-400">Просмотр и администрирование пользователей и интересов.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedTab === 'users' ? 'primary' : 'secondary'}
                onPress={() => setSelectedTab('users')}
              >
                Пользователи
              </Button>
              <Button
                variant={selectedTab === 'interests' ? 'primary' : 'secondary'}
                onPress={() => setSelectedTab('interests')}
              >
                Интересы
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-4">
            {statusText ? (
              <div className="rounded-xl border border-gray-800 bg-[#111111] p-6 text-sm text-gray-300">
                {statusText}
              </div>
            ) : null}

            {selectedTab === 'users' && (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <div className="grid gap-2">
                    <Label htmlFor="adminEmail">Фильтр по email</Label>
                    <Input
                      id="adminEmail"
                      placeholder="Поиск по email"
                      value={searchText}
                      onChange={(event) => setSearchText(event.target.value)}
                      variant="secondary"
                    />
                  </div>
                </div>

                <Table>
                  <Table.ScrollContainer>
                    <Table.Content aria-label="Таблица пользователей" className="min-w-225">
                      <Table.Header>
                        <Table.Column isRowHeader>Имя</Table.Column>
                        <Table.Column>Email</Table.Column>
                        <Table.Column>Роль</Table.Column>
                        <Table.Column>Статус</Table.Column>
                        <Table.Column>Создан</Table.Column>
                        <Table.Column>Действие</Table.Column>
                      </Table.Header>
                      <Table.Body>
                        {users.map((user) => (
                          <Table.Row key={user.id}>
                            <Table.Cell>{`${user.firstName} ${user.lastName}`}</Table.Cell>
                            <Table.Cell>{user.email}</Table.Cell>
                            <Table.Cell>
                              <Chip
                                className={
                                  user.role === 'ADMIN'
                                    ? 'bg-red-600 text-white'
                                    : user.role === 'MODERATOR'
                                    ? 'bg-amber-500 text-black'
                                    : 'bg-gray-700 text-white'
                                }
                                variant="secondary"
                              >
                                {user.role}
                              </Chip>
                            </Table.Cell>
                            <Table.Cell>
                              <Chip
                                className={user.blocked ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}
                                variant="secondary"
                              >
                                {user.blocked ? 'Заблокирован' : 'Активен'}
                              </Chip>
                            </Table.Cell>
                            <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                            <Table.Cell>
                              <Button
                                size="sm"
                                variant="outline"
                                isDisabled={isBusy}
                                onPress={() =>
                                  user.blocked
                                    ? unblockMutation.mutate(user.id)
                                    : blockMutation.mutate(user.id)
                                }
                              >
                                {user.blocked ? 'Разблокировать' : 'Заблокировать'}
                              </Button>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Content>
                  </Table.ScrollContainer>
                  </Table>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-400">
                    <span>
                      Страница {usersPage + 1} из {totalUserPages}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        isDisabled={usersPage === 0}
                        onPress={() => setUsersPage((prev) => Math.max(0, prev - 1))}
                      >
                        Назад
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        isDisabled={usersPage >= totalUserPages - 1}
                        onPress={() => setUsersPage((prev) => Math.min(totalUserPages - 1, prev + 1))}
                      >
                        Вперёд
                      </Button>
                    </div>
                  </div>
                </div>
            )}

            {selectedTab === 'interests' && (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                  <div className="grid gap-2">
                    <Label htmlFor="newInterest">Добавить интерес</Label>
                    <div className="flex gap-2">
                      <Input
                        id="newInterest"
                        placeholder="Название интереса"
                        value={newInterest}
                        onChange={(event) => setNewInterest(event.target.value)}
                        variant="secondary"
                      />
                      <Button
                        variant="primary"
                        onPress={handleAddInterest}
                        isDisabled={addInterestMutation.isPending || !newInterest.trim()}
                      >
                        Добавить
                      </Button>
                    </div>
                  </div>
                </div>

                <Table>
                  <Table.ScrollContainer>
                    <Table.Content aria-label="Таблица интересов" className="min-w-150">
                      <Table.Header>
                        <Table.Column isRowHeader>ID</Table.Column>
                        <Table.Column>Название</Table.Column>
                        <Table.Column>Действие</Table.Column>
                      </Table.Header>
                      <Table.Body>
                        {pagedInterests.map((interest) => (
                          <Table.Row key={interest.id}>
                            <Table.Cell>{interest.id}</Table.Cell>
                            <Table.Cell>{interest.name}</Table.Cell>
                            <Table.Cell>
                              <Button
                                size="sm"
                                variant="outline"
                                isDisabled={deleteInterestMutation.isPending}
                                onPress={() => deleteInterestMutation.mutate(interest.id)}
                              >
                                Удалить
                              </Button>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Content>
                  </Table.ScrollContainer>
                </Table>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-400">
                  <span>
                    Страница {interestsPage + 1} из {totalInterestPages}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      isDisabled={interestsPage === 0}
                      onPress={() => setInterestsPage((prev) => Math.max(0, prev - 1))}
                    >
                      Назад
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      isDisabled={interestsPage >= totalInterestPages - 1}
                      onPress={() => setInterestsPage((prev) => Math.min(totalInterestPages - 1, prev + 1))}
                    >
                      Вперёд
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="border-t border-gray-800 px-4 py-3 text-xs text-gray-500">
            Данных пользователей: {users.length} | Всего интересов: {interests.length}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
