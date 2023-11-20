import type {NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import mongoose from 'mongoose';
import type {RespostaPadraoMsg} from '../types/RespotaPadraoMsg';

export const conectarMongoDB = (handler : NextApiHandler) => 
    async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {

        //Verificar se o banco ja esta conectado, se estiver seguir para o endpoint
        // ou proximo middleware
        if(mongoose.connections[0].readyState){
            return handler(req, res);
        }

        //ja que nao esta conectado vamos conectar
        //obter a variavel de ambientes prenenchida da env
        const {DB_CONEXAO_STRING} = process.env;

        //se a env estiver vazia aborta o uso de sistema e avisa o programador
        if(!DB_CONEXAO_STRING){
            return res.status(500).json({erro : 'ENV de confiruacao do banco, nao informado'});
        }   

        mongoose.connection.on('Connected', () => console.log('Banco de dados Conectado'));
        mongoose.connection.on('Error', erro => console.log('Ocorreu erro a conecatard no Banco', erro));
        await mongoose.connect(DB_CONEXAO_STRING);

        //Agora posso seguir para o endpoint, pois estou conectado no banco.
        return handler(req,res);
    }