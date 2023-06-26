const repositorio = require('../repository/user_repository');
const url = "http://localhost:3000/user";

// Listar todos os produtos do banco de dados.
exports.getAll = ((req, res, next) => {
    repositorio.getAll().
        then(data => res.status(200).send({
            data,
            request: {
                tipo: "GET",
                descricao: "",
                url: url
            }
        })
        ).
        catch(error =>
            res.status(200).send({
                message: "Ocorreu um erro ao listar os produtos.",
                versao: "0.0.01",
                request: {
                    tipo: "GET",
                    descricao: "",
                    url: url
                }
            })
        );

});

// Postar um novo produto no banco de dados.
exports.postar = ((req, res, next) => {

    repositorio.postar(req.body.name, req.body.email, req.body.password).
    then(() =>
        res.status(200).send({
            message: "User adicionado com sucesso!!",
            request: {
                tipo: "POST",
                descricao: "",
                url: url
            }
        })).
    catch(error => res.status(201).send({
        message: "Ocorreu um erro ao adicionar o usuario."
    }));
});