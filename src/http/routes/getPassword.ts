import type { FastifyInstance } from 'fastify';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { getPasswordController } from '../controller/getPasswordController.ts';

export const passwordRoute: FastifyPluginCallbackZod = (
  app: FastifyInstance
) => {
  app.get('/rhid', getPasswordController);
};
