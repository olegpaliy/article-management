import { Prisma } from '@prisma/client'
import { z } from 'zod'
import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from '~/server/api/trpc'

const idSchema = z.object({ id: z.string() })

const articleSchema = z.object({
  title: z.string(),
  content: z.string(),
  author: z.string(),
})

const articleUpdateSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  author: z.string(),
})

const paginationSchema = z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1).max(100),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  search: z.string().optional(),
})

export const articleRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(paginationSchema)
    .query(async ({ input, ctx }) => {
      const { page, pageSize, sortBy, sortOrder, search } = input

      const where: Prisma.ArticleWhereInput | undefined = search
        ? {
            OR: [
              {
                title: { contains: search, mode: Prisma.QueryMode.insensitive },
              },
              {
                content: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                author: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            ],
          }
        : undefined

      const orderBy = sortBy
        ? {
            [sortBy]: sortOrder ?? 'asc',
          }
        : undefined

      const articles = await ctx.prisma.article.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      })

      const totalCount = await ctx.prisma.article.count({ where })

      return {
        articles,
        totalCount,
        page,
        pageSize,
      }
    }),

  getOne: publicProcedure.input(idSchema).query(({ input, ctx }) => {
    return ctx.prisma.article.findUnique({
      where: { id: +input.id },
    })
  }),

  createArticle: adminProcedure
    .input(articleSchema)
    .mutation(({ input, ctx }) => {
      return ctx.prisma.article.create({
        data: articleSchema.parse(input),
      })
    }),

  updateArticle: adminProcedure
    .input(articleUpdateSchema)
    .mutation(({ input, ctx }) => {
      return ctx.prisma.article.update({
        where: {
          id: +input.id,
        },
        data: articleSchema.parse(input),
      })
    }),

  deleteArticle: adminProcedure.input(idSchema).mutation(({ input, ctx }) => {
    return ctx.prisma.article.delete({
      where: { id: +input.id },
    })
  }),
})
