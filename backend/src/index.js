const express = require('express');
const {v4:uuid, isUuid} = require('uuid')
const app = express() // cria a aplicação;

/*
Metodos http:

GET: buscar informações do backend
Put/PATCH: Alterar  uma informação no back-end
POST : Criar uma informação no backend
DELETE: Deletar uma informação backend


*/
//na aba projects terá um metodo get para listar algo

/**
 * Tipos de parametros:
 * 
 * Query Params: Filtros e paginação
 * Route Params: 
 * Request Params
 * 
 */

/*
Middleware: É um interceptador de requisições que pode interromper ou alterar da
dos da requisição
*/
app.use(express.json())

const projects = [];


function logRequests(request,response,next){
    const{method, url} = request;

    const logLabel = `[${method.toUpperCase()}]${url}`

    console.time(logLabel)

    next()

    console.timeEnd(logLabel)
}

function validateProjectId(request,response,next){
    const {id} = request.params;

    if(!isUuid(id)){
        return response.status(400).json({error:"Invalid project ID"})
    }

    return next()
}

app.use(logRequests)
app.use('/projects/:id',validateProjectId)
app.get('/projects',(request,response) =>{
   
    return response.json(projects)
})

app.post('/projects',(request,response) =>{
    const {title, owner} = request.body;
    const project = {id:uuid(),title, owner}
    projects.push(project)
    return response.json(project)

})

app.put('/projects/:id',(request,response) =>{
    const {id} = request.params
    const {title, owner} = request.body;

    const projectIndex = projects.findIndex(project => project.id === id);
    if(projectIndex < 0){
        return response.status(400).json({error:"Project no found"})
    }

    const project = {
        id,
        title,
        owner,
    };

    projects[projectIndex] = project


    return response.json(project)

})
app.delete('/projects/:id',(request,response) =>{
    const {id} = request.params
    const projectIndex = projects.findIndex(project => project.id === id);
    if(projectIndex < 0){
        return response.status(400).json({error:"Project no found"})
    }

    projects.splice(projectIndex,1)
    console.log(projectIndex)
    return response.status(204).send()

})
//permite a aplicação funcionar na porta 3333
app.listen(3333,()=>{
    console.log("rodando")
})

