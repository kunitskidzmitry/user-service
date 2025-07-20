# 📘 User Service API

Сервис управления пользователями с регистрацией, авторизацией, ролями и блокировкой пользователей. Реализован на Express + TypeScript + Prisma + PostgreSQL.

---

## 📦 Установка и запуск

### 1. Клонируйте репозиторий

```bash
git clone https://github.com/kunitskidzmitry/user-service.git
cd user-service
```

### 2. Установите зависимости

```bash
npm install
```

### 3. Настройте переменные окружения

Создайте `.env` файл в корне проекта:

```env
PORT=3000
JWT_SECRET=supersecuresecret123
DATABASE_URL=postgresql://postgres:EmLdKthzHTNSMCZfPgWEoWqziDFsUvbz@interchange.proxy.rlwy.net:46772/railway

```

> 🔸 Замените `USER`, `PASSWORD`, `HOST`, `PORT`, `DATABASE` на ваши значения PostgreSQL.

---

### 4. Настройте базу данных

```bash
npx prisma generate
npx prisma migrate dev --name init
```

> 🔸 Можно также запустить `npx prisma studio` для визуального просмотра БД.

---

### 5. Запустите сервер

```bash
npm run dev
```

---

## 🧪 Тестирование API через Postman

1. Откройте Postman
2. Импортируйте коллекцию:
    - `UserService_Postman_Collection.json` (прилагается)
3. Используйте переменную `{{token}}` в запросах:
    - Получите `token` через `POST /api/login`
    - Вставьте его вручную в переменные Postman

---

## 🔐 Авторизация и роли

Каждый запрос к защищённым маршрутам требует заголовок:

```makefile
Authorization: Bearer <token>
```

**Права доступа:**

| Маршрут                      | Кто имеет доступ           |
|-----------------------------|----------------------------|
| `GET /users/me`             | любой авторизованный       |
| `GET /users/:id`            | сам пользователь или admin |
| `GET /users`                | только admin               |
| `PATCH /users/block/:id`    | сам пользователь или admin |

---

## 📋 Что было сделано:

### 🔸 Регистрация

- Успешная регистрация
- Повторная регистрация с тем же email → ошибка

### 🔸 Авторизация

- Успешный вход
- Неверный пароль/email → ошибка

### 🔸 Получение пользователей

- `GET /users` как admin → полный список
- `GET /users/:id` как user → только себя
- `GET /users/:id` как admin → любого

### 🔸 Блокировка

- Пользователь может заблокировать сам себя
- Admin может заблокировать любого

---

## ⚙️ Стек технологий

- Node.js + Express
- TypeScript
- Prisma ORM + PostgreSQL
- JWT для авторизации
- bcrypt для хеширования пароля
