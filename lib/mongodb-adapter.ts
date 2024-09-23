// lib/mongodb-adapter.ts
import { MongoClient } from 'mongodb'
import type { Adapter } from "next-auth/adapters"

export function CustomMongoDBAdapter(client: Promise<MongoClient>): Adapter {
  return {
    async createUser(user) {
      const clientInstance = await client
      const result = await clientInstance.db().collection("users").insertOne(user)
      return { ...user, id: result.insertedId.toString() }
    },
    async getUser(id) {
      const clientInstance = await client
      const user = await clientInstance.db().collection("users").findOne({ _id: id })
      if (!user) return null
      return { ...user, id: user._id.toString() }
    },
    async getUserByEmail(email) {
      const clientInstance = await client
      const user = await clientInstance.db().collection("users").findOne({ email })
      if (!user) return null
      return { ...user, id: user._id.toString() }
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const clientInstance = await client
      const account = await clientInstance.db().collection("accounts").findOne({ providerAccountId, provider })
      if (!account) return null
      const user = await clientInstance.db().collection("users").findOne({ _id: account.userId })
      if (!user) return null
      return { ...user, id: user._id.toString() }
    },
    async updateUser(user) {
      const clientInstance = await client
      const { _id, ...userData } = user
      await clientInstance.db().collection("users").updateOne({ _id }, { $set: userData })
      return user
    },
    async deleteUser(userId) {
      const clientInstance = await client
      await clientInstance.db().collection("users").deleteOne({ _id: userId })
    },
    async linkAccount(account) {
      const clientInstance = await client
      await clientInstance.db().collection("accounts").insertOne(account)
      return account
    },
    async unlinkAccount({ providerAccountId, provider }) {
      const clientInstance = await client
      await clientInstance.db().collection("accounts").deleteOne({ providerAccountId, provider })
    },
    async createSession(session) {
      const clientInstance = await client
      const result = await clientInstance.db().collection("sessions").insertOne(session)
      return { ...session, id: result.insertedId.toString() }
    },
    async getSessionAndUser(sessionToken) {
      const clientInstance = await client
      const session = await clientInstance.db().collection("sessions").findOne({ sessionToken })
      if (!session) return null
      const user = await clientInstance.db().collection("users").findOne({ _id: session.userId })
      if (!user) return null
      return {
        session: { ...session, id: session._id.toString() },
        user: { ...user, id: user._id.toString() }
      }
    },
    async updateSession(session) {
      const clientInstance = await client
      await clientInstance.db().collection("sessions").updateOne({ sessionToken: session.sessionToken }, { $set: session })
      return session
    },
    async deleteSession(sessionToken) {
      const clientInstance = await client
      await clientInstance.db().collection("sessions").deleteOne({ sessionToken })
    },
    async createVerificationToken(verificationToken) {
      const clientInstance = await client
      const result = await clientInstance.db().collection("verificationTokens").insertOne(verificationToken)
      return { ...verificationToken, id: result.insertedId.toString() }
    },
    async useVerificationToken({ identifier, token }) {
      const clientInstance = await client
      const result = await clientInstance.db().collection("verificationTokens").findOneAndDelete({ identifier, token })
      if (!result.value) return null
      // @ts-ignore
      return result.value
    },
  }
}