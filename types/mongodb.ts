// types/mongodb.ts
import { Collection, Db } from 'mongodb'

export interface MongoConnection {
  db: Db;
}

export interface UserDocument {
  _id: string;
  email: string;
  password: string;
  status: 'free' | 'premium';
  createdAt: Date;
}