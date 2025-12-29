import fastifyCors from '@fastify/cors';
import Fastify, { type FastifyInstance, type FastifyReply } from 'fastify';
import { env } from './env.ts';
import { passwordRoute } from './http/routes/getPassword.ts';

const app: FastifyInstance = Fastify();
app.register(fastifyCors, {
  origin: env.ORIGIN_REQUEST,
});

app.get("/test", (_, reply: FastifyReply) => {
  reply.code(200).send("Test endpoint");
});
app.register(passwordRoute);

app.listen({ port: env.PORT, host: '0.0.0.0' });
