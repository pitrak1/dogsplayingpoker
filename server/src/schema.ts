import { createSchema } from 'graphql-yoga'
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'
import { userTypeDefs, userResolvers } from '@/modules/user'
import { playerTypeDefs, playerResolvers } from '@/modules/player'

export const schema = createSchema({
  typeDefs: mergeTypeDefs([userTypeDefs, playerTypeDefs]),
  resolvers: mergeResolvers([userResolvers, playerResolvers])
})
