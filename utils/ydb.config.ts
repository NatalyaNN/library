import { Driver, IamAuthService } from 'ydb-sdk';
import { IIamCredentials } from './types';

const envVar = process.env;

const endpoint = envVar.DB_ENDPOINT;
const database = envVar.DB_PATH;

const saCredentials: IIamCredentials = {
   serviceAccountId: envVar.DB_SERVICE_ACCOUNT_ID!,
   accessKeyId: envVar.DB_ACCESS_KEY_ID!,
   privateKey: Buffer.from(envVar.YDB_SA_PRIVATE_KEY as string),
   iamEndpoint: envVar.DB_IAM_ENDPOINT!,
   // iamEndpoint: envVar.DB_IAM_ENDPOINT!,
};

const authService = new IamAuthService(saCredentials);
const YDBdriver = new Driver({ endpoint, database, authService });

export default YDBdriver;