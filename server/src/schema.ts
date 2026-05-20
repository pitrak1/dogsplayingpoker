import { createSchema } from 'graphql-yoga'
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'
import { userTypeDefs, userResolvers } from '@/modules/user'
import { mediaTypeDefs, mediaResolvers } from './modules/media'
import { petTypeDefs, petResolvers } from './modules/pet'

export const schema = createSchema({
  typeDefs: mergeTypeDefs([userTypeDefs, mediaTypeDefs, petTypeDefs]),
  resolvers: mergeResolvers([userResolvers, mediaResolvers, petResolvers])
})