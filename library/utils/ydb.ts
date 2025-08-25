import YDBdriver from './ydb.config';

export async function initDb() {
   if (!await YDBdriver.ready(10000)) {
      throw new Error('Driver is not ready');
   }
   console.log('YDB driver initialized successfully');
   return YDBdriver;
}

export async function createTable() {
   const query = `
    CREATE TABLE IF NOT EXISTS users (
    user_id Utf8 NOT NULL,
    email Utf8 NOT NULL,
    password_hash Utf8 NOT NULL,
    full_name Utf8,
    created_at Timestamp NOT NULL,
    last_login Timestamp,
    is_active Bool DEFAULT true,
    PRIMARY KEY (user_id)
   );

   CREATE UNIQUE INDEX idx_users_email ON users (email);

   CREATE TABLE roles (
    role_id Utf8 NOT NULL,
    name Utf8 NOT NULL,
    permissions Json,
    PRIMARY KEY (role_id)
   );

   CREATE TABLE user_roles (
    user_id Utf8 NOT NULL,
    role_id Utf8 NOT NULL,
    assigned_at Timestamp NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
   );

   CREATE TABLE books (
    book_id Utf8 NOT NULL,
    isbn Utf8,
    title Utf8 NOT NULL,
    description Utf8,
    publish_year Uint16,
    cover_url Utf8,
    file_url Utf8,
    total_copies Uint32 DEFAULT 1,
    available_copies Uint32 DEFAULT 1,
    created_at Timestamp NOT NULL,
    updated_at Timestamp,
    PRIMARY KEY (book_id)
   );

   CREATE TABLE authors (
    author_id Utf8 NOT NULL,
    full_name Utf8 NOT NULL,
    bio Utf8,
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
    parent_id Utf8,
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
    borrowed_at Timestamp NOT NULL,
    returned_at Timestamp,
    due_at Timestamp NOT NULL,
    status Utf8 NOT NULL,
    PRIMARY KEY (borrowing_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
   );

   CREATE TABLE reviews (
    review_id Utf8 NOT NULL,
    book_id Utf8 NOT NULL,
    user_id Utf8 NOT NULL,
    rating Uint8 NOT NULL,
    text Utf8,
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

   try {
      // Правильное использование для версии 5.11.1
      await YDBdriver.tableClient.withSession(async (session) => {
         // Для DDL запросов используем executeSchemeQuery
         await session.executeQuery(query);
      });
      console.log('Таблицы успешно созданы');
   } catch (error) {
      console.error('Ошибка при создании таблиц:', error);
      throw error;
   }
}

// Функция для выполнения SQL запросов
export async function executeQuery<T>(query: string, params?: any): Promise<T[]> {
   try {
      let result: any;

      await YDBdriver.tableClient.withSession(async (session) => {
         // Для обычных запросов используем executeQuery
         result = await session.executeQuery(query, params);
      });

      return result?.resultSets?.[0]?.rows?.map((row: any) => row.toObject()) as T[] || [];
   } catch (error) {
      console.error('Ошибка выполнения запроса:', error);
      throw error;
   }
}

// Функция для работы с транзакциями
export async function withTransaction<T>(callback: (session: any) => Promise<T>): Promise<T> {
   let result: T;

   await YDBdriver.tableClient.withSession(async (session) => {
      // Начинаем транзакцию
      const txMeta = await session.beginTransaction({
         serializableReadWrite: {}
      });

      try {
         result = await callback(session);
         // Коммитим транзакцию
         await session.commitTransaction({ txId: txMeta.id! });
      } catch (error) {
         // Откатываем в случае ошибки
         await session.rollbackTransaction({ txId: txMeta.id! });
         throw error;
      }
   });

   return result!;
}

// Функция для описания таблицы
export async function describeTable(tableName: string): Promise<any> {
   try {
      let result: any;

      await YDBdriver.tableClient.withSession(async (session) => {
         result = await session.describeTable(tableName);
      });

      return result;
   } catch (error) {
      console.error('Ошибка описания таблицы:', error);
      throw error;
   }
}

// Простая функция для тестирования соединения
export async function testConnection(): Promise<boolean> {
   try {
      await YDBdriver.tableClient.withSession(async (session) => {
         const result = await session.executeQuery('SELECT 1 as test;');
         console.log('Connection test successful');
      });
      return true;
   } catch (error) {
      console.error('Connection test failed:', error);
      return false;
   }
}

