import { Driver, getCredentialsFromEnv } from 'ydb-sdk';
import { defineNitroPlugin } from '#imports';

export default defineNitroPlugin(async (nitroApp) => {
   const driver = new Driver({
      endpoint: process.env.YDB_ENDPOINT!,
      database: process.env.YDB_DATABASE!,
      authService: getCredentialsFromEnv(),
   });

   if (!await driver.ready(10000)) {
      console.error('⚠️ YDB connection failed!');
      process.exit(1);
   }

   console.log('✅ YDB connected');

   // Добавляем драйвер в контекст Nitro
   nitroApp.driver = driver;
});