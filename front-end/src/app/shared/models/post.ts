import { User } from './user';

export interface Post {
  id?: number;
  description: string;
  image: string;
  status?: 'active' | 'deleted';
  user_id?: number;
  User?: User; // Assuming you have a User model as well
}
