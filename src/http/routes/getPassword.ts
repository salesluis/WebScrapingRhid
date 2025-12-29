import type { FastifyInstance } from 'fastify';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { getPasswordController } from '../controller/getPasswordController.ts';
import { env } from '../../env.ts';

export const passwordRoute: FastifyPluginCallbackZod = (
  app: FastifyInstance
) => {
  // Simple API key check to protect this expensive endpoint
  app.get('/rhid', {
    preHandler: (request, reply, done) => {
      const apiKey = request.headers['x-api-key'] as string | undefined;
      if (!apiKey || apiKey !== env.API_KEY) {
        reply.code(401).send({ error: 'Unauthorized' });
        return;
      }
      done();
    },
  }, getPasswordController);
};
