import { Driver, IamAuthService } from 'ydb-sdk';
import type { IIamCredentials } from './types';

const envVar = process.env;

const endpoint = envVar.DB_ENDPOINT;
const database = envVar.DB_PATH;

if (!endpoint || !database) {
   throw new Error('DB_ENDPOINT and DB_PATH are required');
}

const saCredentials: IIamCredentials = {
   serviceAccountId: envVar.DB_SERVICE_ACCOUNT_ID!,
   accessKeyId: envVar.DB_ACCESS_KEY_ID!,
   privateKey: Buffer.from(envVar.YDB_SA_PRIVATE_KEY as string),
   iamEndpoint: envVar.DB_IAM_ENDPOINT!,
};

const authService = new IamAuthService(saCredentials);
const YDBdriver = new Driver({ endpoint, database, authService });

export default YDBdriver;