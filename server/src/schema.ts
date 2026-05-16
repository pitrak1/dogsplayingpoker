import { createSchema } from 'graphql-yoga'
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'
import { userTypeDefs, userResolvers } from '@/modules/user'
import { mediaTypeDefs, mediaResolvers } from './modules/media'

export const schema = createSchema({
  typeDefs: mergeTypeDefs([userTypeDefs, mediaTypeDefs]),
  resolvers: mergeResolvers([userResolvers, mediaResolvers])
})
