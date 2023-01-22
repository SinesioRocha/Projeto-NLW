import fastify from "fastify";
import cors from '@fastify/cors'//Responsavel por permitir que o font possa acessar o back
import { appRoutes } from "./routes";

const app = fastify()

app.register(cors)//Responsavel por permitir que o font possa acessar o backcd
/**
 * Metodo HTTP: Get(Para Buscar alguma infomação), Post(Para Criar alguma coisa/Recurso), 
 *              Put(Atualizar algum Recurso por completo), Patch(Atualizar algum Recurso por parte), 
 *              Delete(Deletar algum recurso)
 */
app.register(appRoutes)

app.listen({
    port: 3333,
}).then(()=>{
    console.log('HTTP Server running!')
})