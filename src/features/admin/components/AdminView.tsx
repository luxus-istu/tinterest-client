'use client'

import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Table,
  Avatar,
  Chip,
  Button,
} from '@heroui/react'
import { mockUsers, mockInterests } from '../mocks/admin_mocks'

export function AdminView() {
  const [selectedTab, setSelectedTab] = useState<'users' | 'interests'>('users')

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-3xl font-bold text-white">Админ-панель</h1>

        <Card className="bg-[#0A0A0A] shadow-lg">
          <CardHeader className="flex flex-col items-start border-b border-gray-800">
            <CardTitle className="text-white">Управление данными</CardTitle>
            <CardDescription className="text-gray-400">
              Просмотр и управление пользователями и интересами
            </CardDescription>
            <div className="mt-4 flex gap-2">
              <Button
                variant={selectedTab === 'users' ? 'solid' : 'light'}
                color={selectedTab === 'users' ? 'primary' : 'default'}
                onPress={() => setSelectedTab('users')}
              >
                Пользователи
              </Button>
              <Button
                variant={selectedTab === 'interests' ? 'solid' : 'light'}
                color={selectedTab === 'interests' ? 'primary' : 'default'}
                onPress={() => setSelectedTab('interests')}
              >
                Интересы
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-4">
            {selectedTab === 'users' && (
              <Table>
                <Table.ScrollContainer>
                  <Table.Content aria-label="Таблица пользователей" className="min-w-[800px]">
                    <Table.Header>
                      <Table.Column isRowHeader>Аватар</Table.Column>
                      <Table.Column>Имя</Table.Column>
                      <Table.Column>Email</Table.Column>
                      <Table.Column>Роль</Table.Column>
                      <Table.Column>Статус</Table.Column>
                      <Table.Column>Интересы</Table.Column>
                    </Table.Header>
                    <Table.Body>
                      {mockUsers.map((user) => (
                        <Table.Row key={user.id}>
                          <Table.Cell>
                            <Avatar className="mx-auto h-20 w-20">
                              <Avatar.Image src={user.avatarUrl} />
                              <Avatar.Fallback>{user.firstName.charAt(0)}</Avatar.Fallback>
                            </Avatar>
                          </Table.Cell>
                          <Table.Cell>{`${user.firstName} ${user.lastName}`}</Table.Cell>
                          <Table.Cell>{user.email}</Table.Cell>
                          <Table.Cell>
                            <Chip
                              color={
                                user.role === 'ADMIN'
                                  ? 'danger'
                                  : user.role === 'MODERATOR'
                                    ? 'warning'
                                    : 'default'
                              }
                              variant="flat"
                            >
                              {user.role}
                            </Chip>
                          </Table.Cell>
                          <Table.Cell>
                            <Chip color={user.blocked ? 'danger' : 'success'} variant="flat">
                              {user.blocked ? 'Заблокирован' : 'Активен'}
                            </Chip>
                          </Table.Cell>
                          <Table.Cell>
                            <div className="flex flex-wrap gap-1">
                              {user.interests.map((interest) => (
                                <Chip
                                  key={interest}
                                  size="sm"
                                  variant="flat"
                                  className="bg-[#2C2C2E]"
                                >
                                  {interest}
                                </Chip>
                              ))}
                            </div>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Content>
                </Table.ScrollContainer>
              </Table>
            )}

            {selectedTab === 'interests' && (
              <Table>
                <Table.ScrollContainer>
                  <Table.Content aria-label="Таблица интересов" className="min-w-[600px]">
                    <Table.Header>
                      <Table.Column isRowHeader>ID</Table.Column>
                      <Table.Column>Название</Table.Column>
                      <Table.Column>Категория</Table.Column>
                      <Table.Column>Популярность</Table.Column>
                    </Table.Header>
                    <Table.Body>
                      {mockInterests.map((interest) => (
                        <Table.Row key={interest.id}>
                          <Table.Cell>{interest.id}</Table.Cell>
                          <Table.Cell>{interest.name}</Table.Cell>
                          <Table.Cell>{interest.category}</Table.Cell>
                          <Table.Cell>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < interest.level ? 'fill-yellow-500' : 'fill-gray-600'
                                    }`}
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M10 15l-5.5 3 1.5-6-4-3.5 6-0.5L10 2l2.5 6 6 0.5-4 3.5 1.5 6z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-xs">{interest.level}/5</span>
                            </div>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Content>
                </Table.ScrollContainer>
              </Table>
            )}
          </CardContent>

          <CardFooter className="border-t border-gray-800 text-xs text-gray-500">
            Всего пользователей: {mockUsers.length} | Всего интересов: {mockInterests.length}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
