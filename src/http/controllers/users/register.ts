import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error";
import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodyShema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodyShema.parse(request.body);

  try {
    const registerUseCase = makeRegisterUseCase();

    await registerUseCase.execute({
      name,
      email,
      password,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof UserAlreadyExistsError){
      return reply.status(409).send({
        message: error.message,
      });
    }

    throw error
  }

  return reply.status(201).send();
}
