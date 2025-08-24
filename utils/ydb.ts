// utils/ydb.ts
import YDBdriver from '../ydb.config';

export async function initDb() {
   await YDBdriver.init();
   const pool = new YDBdriver.pool.ThreadsafeSessionPool();
   await pool.init();
   return pool;
}

async function createTable() {
   const query = `
    CREATE TABLE IF NOT EXISTS users (
    user_id Utf8 NOT NULL,               -- UUID или автоинкремент
    email Utf8 NOT NULL,                 -- Уникальный email
    password_hash Utf8 NOT NULL,         -- Хеш пароля (bcrypt)
    full_name Utf8,                      -- Полное имя
    created_at Timestamp NOT NULL,       -- Дата регистрации
    last_login Timestamp,                -- Последний вход
    is_active Bool DEFAULT true,         -- Активен ли аккаунт
    PRIMARY KEY (user_id)
   );

   CREATE UNIQUE INDEX idx_users_email ON users (email);   -- Уникальный индекс для email

   CREATE TABLE roles (
    role_id Utf8 NOT NULL,               -- UUID
    name Utf8 NOT NULL,                  -- Название (admin, librarian, reader)
    permissions Json,                    -- Права в JSON (например, { "create_book": true })
    PRIMARY KEY (role_id)
   );

   -- Примеры ролей:
   -- Admin: { "manage_books": true, "manage_users": true }
   -- Librarian: { "manage_books": true, "view_users": true }
   -- Reader: { "borrow_books": true }

   CREATE TABLE user_roles (
    user_id Utf8 NOT NULL,
    role_id Utf8 NOT NULL,
    assigned_at Timestamp NOT NULL,      -- Когда назначена роль
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
   );

   CREATE TABLE books (
    book_id Utf8 NOT NULL,               -- UUID
    isbn Utf8,                           -- ISBN (если есть)
    title Utf8 NOT NULL,                 -- Название
    description Utf8,                    -- Описание
    publish_year Uint16,                 -- Год издания
    cover_url Utf8,                      -- Ссылка на обложку (Object Storage)
    file_url Utf8,                       -- Ссылка на файл (PDF/EPUB)
    total_copies Uint32 DEFAULT 1,       -- Общее количество копий
    available_copies Uint32 DEFAULT 1,   -- Доступные копии
    created_at Timestamp NOT NULL,       -- Дата добавления
    updated_at Timestamp,                -- Дата изменения
    PRIMARY KEY (book_id)
   );

   -- Индекс для поиска по названию/автору
   CREATE INDEX idx_books_title ON books (title);
   CREATE INDEX idx_books_author ON books (author);

   CREATE TABLE authors (
    author_id Utf8 NOT NULL,
    full_name Utf8 NOT NULL,
    bio Utf8,                            -- Биография
    PRIMARY KEY (author_id)
   );

   CREATE TABLE book_authors (
    book_id Utf8 NOT NULL,
    author_id Utf8 NOT NULL,
    PRIMARY KEY (book_id, author_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES authors(author_id) ON DELETE CASCADE
   );

   CREATE TABLE categories (
    category_id Utf8 NOT NULL,
    name Utf8 NOT NULL,
    parent_id Utf8,                      -- Для иерархии (например, "Фантастика" → "Киберпанк")
    PRIMARY KEY (category_id),
    FOREIGN KEY (parent_id) REFERENCES categories(category_id) ON DELETE CASCADE
   );

   CREATE TABLE book_categories (
    book_id Utf8 NOT NULL,
    category_id Utf8 NOT NULL,
    PRIMARY KEY (book_id, category_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
   );

   CREATE TABLE borrowings (
    borrowing_id Utf8 NOT NULL,
    book_id Utf8 NOT NULL,
    user_id Utf8 NOT NULL,
    borrowed_at Timestamp NOT NULL,      -- Дата выдачи
    returned_at Timestamp,               -- Дата возврата (NULL если не возвращена)
    due_at Timestamp NOT NULL,           -- Срок возврата
    status Utf8 NOT NULL,                -- "active", "returned", "overdue"
    PRIMARY KEY (borrowing_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
   );

   CREATE INDEX idx_borrowings_active ON borrowings (status) WHERE status = "active";  -- Индекс для поиска активных выдач

   CREATE TABLE reviews (
    review_id Utf8 NOT NULL,
    book_id Utf8 NOT NULL,
    user_id Utf8 NOT NULL,
    rating Uint8 NOT NULL,               -- Оценка (1-5)
    text Utf8,                           -- Текст отзыва
    created_at Timestamp NOT NULL,
    PRIMARY KEY (review_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
   );

   CREATE TABLE bookmarks (
    user_id Utf8 NOT NULL,
    book_id Utf8 NOT NULL,
    created_at Timestamp NOT NULL,
    PRIMARY KEY (user_id, book_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE
   );
  `;

   const session = await YDBdriver.tableClient.createSession();
   try {
      await session.executeScheme(query);
      console.log('Таблицы успешно созданы');
   } finally {
      await session.close();
   }
}

// Вызовите при старте сервера
createTable().catch(console.error);