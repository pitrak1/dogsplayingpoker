import { createSchema } from 'graphql-yoga'
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'
import { userTypeDefs, userResolvers } from '@/modules/user'
import { playerTypeDefs, playerResolvers } from '@/modules/player'
import { mediaTypeDefs, mediaResolvers } from './modules/media'

export const schema = createSchema({
  typeDefs: mergeTypeDefs([userTypeDefs, playerTypeDefs, mediaTypeDefs]),
  resolvers: mergeResolvers([userResolvers, playerResolvers, mediaResolvers])
})
