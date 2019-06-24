const request=require('supertest')
const server=require('./server.js')

describe('server', () => {
    
     it('should return a 200 when connected to the api',() =>{
        return request(server).get('/').expect(200)
    })

     it('should return the message Hello World!!',() =>{
        return request(server).get('/').then(res =>{
            const {body} =res;

            expect(body.message).toBe('Hello World!!')
    })
 })
     it('should use json ', async () =>{
        const res= await request(server).get('')

        expect(res.type).toBe('application/json');
 })
    it('sets the env to testing',() =>{
        expect(process.env.DB_ENV).toBe('testing');
})
})