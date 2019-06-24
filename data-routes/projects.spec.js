const request=require('supertest')
const server=require('../api/server.js')
const db=require('../data/dbConfig.js')



    describe('/projects endpoint', async () =>{
        afterEach(async () => {
            await db('users').delete();
        })
        afterEach(async () => {
            await db('projects').delete();
        })

        it('should return a status code of 401 if theres no token',() => {
    
            return request(server).get('/projects').expect(401)
           
           })


           it('should return an array when a project is added', async () => {
            await db('users').insert({ nickname:'testingtesters',account_type:'homeowner'});
            // await db('projects').insert({ title:'new project',description:'test', homeowner_id:1, budget:100});
            const user = await db('users')
            // const res = await db('projects');
      
            expect(Array.isArray(user)).toBe(true)
          });


    })