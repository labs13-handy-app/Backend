const request=require('supertest')
const server=require('../api/server.js')
const db=require('../data/dbConfig.js')

describe('Post to /register', () =>{
    afterEach(async () => {
        await db('users').delete();
    })

    it('should use json ', async () =>{
        const res= await request(server).get('')

        expect(res.type).toBe('application/json');
    })

    it('should return an array', async () => {
        await db('users').insert({ nickname:'newest',account_type:'homeowner'});
  
        const res = await db('users');
  
        expect(Array.isArray(res)).toBe(true)
      });

      it('should add the newly created user', async () => {
        await db('users').insert({ nickname:'newer',account_type:'homeowner'});
  
        const res = await db('users');

        expect(res).toHaveLength(1);
  
  
    })

    it('should add two new created users', async () => {
        await db('users').insert({ nickname:'new123',account_type:'homeowner'});
        await db('users').insert({ nickname:'new1234',account_type:'contractor'});
  
        const res = await db('users');

        expect(res).toHaveLength(2);
    })

})



      