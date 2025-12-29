import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ProcessRequest } from '../../interface/request.ts';
import scraping from '../../services/scraping.ts';

export const getPasswordController = async (
  request: FastifyRequest<{ Querystring: ProcessRequest }>,
  reply: FastifyReply
) => {
  try {
    const { serial, senha } = request.query;

    if (
      !serial ||
      typeof serial !== 'string' ||
      !senha ||
      typeof senha !== 'string'
    ) {
      await reply.code(400).send({ error: 'dados inválidos ou ausentes' });
      return;
    }

    const contraSenha = await scraping(serial, senha);
    await reply.code(200).send(contraSenha);
  } catch (error) {
    await reply.code(500).send({ error: `Erro interno do servidor:${error}` });
  }
};
