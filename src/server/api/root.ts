import { userAgentFromString } from 'next/server'
import { z } from 'zod'
import * as bcrypt from 'bcrypt'
import { articleRouter } from '~/server/api/routers/article'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { sign } from 'jsonwebtoken'
import { TRPCError } from '@trpc/server'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  article: articleRouter,
  user: createTRPCRouter({
    login: publicProcedure
      .input(loginSchema)
      .mutation(async ({ input: { email, password }, ctx }) => {
        const user = await ctx.prisma.user.findFirstOrThrow({
          where: { email },
        })
        const result = await bcrypt.compare(password, user.password)
        if (result) {
          return sign({ email }, 'shh')
        }
        throw new Error('Login failed')
      }),
  }),
})

// export type definition of API
export type AppRouter = typeof appRouter
