import { Request } from 'express';
import { User } from '../../users/models/user';

export interface AppRequest extends Request {
  user?: User;
}
