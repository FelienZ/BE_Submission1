import type { User } from '../../models/types/user.js';
import UserMapper from '../utils/UserMapper.js';

describe('UserMapper Repo util unit test', ()=>{
  it('Should Mapping DB return value with proper Note Entity', ()=>{
    const dbResponse = {
      id : '12345',
      name: 'mas amba',
      password: '12359',
      email: 'amba@example.com',
      created_at: new Date(),
      updated_at: new Date()
    };
    const entity: User = {
      id : '12345',
      name: 'mas amba',
      password: '12359',
      email: 'amba@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const MappedResponse = UserMapper(dbResponse);
         

    expect(MappedResponse).toHaveProperty('createdAt');
    expect(typeof MappedResponse).toEqual(typeof entity);
  });
});