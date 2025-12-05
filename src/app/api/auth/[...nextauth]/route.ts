import { env } from "@/env";
import User from "@/lib/models/user";
import connectDB from "@/lib/mongodb";
import clientPromise from "@/lib/mongodb-client";
import { signInSchema } from "@/lib/validations/auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";
import Twitter from "next-auth/providers/twitter";
import { ZodError } from "zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: env.AUTH_SECRET,
  trustHost: true,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    Facebook({
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
    }),
    Twitter({
      clientId: env.TWITTER_CLIENT_ID,
      clientSecret: env.TWITTER_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Validate credentials using Zod schema
          const { identifier, password } = await signInSchema.parseAsync(
            credentials
          );

          await connectDB();

          // Check if identifier is email or phone
          const isEmail = identifier.includes("@");
          const query = isEmail ? { email: identifier } : { phone: identifier };

          const user = await User.findOne(query).select("+password");

          if (!user || !user.password) {
            // Return null to indicate invalid credentials
            // Auth.js will handle the error appropriately
            return null;
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            return null;
          }

          // Return user object with profile data
          return {
            id: user._id.toString(),
            name: user.name || undefined,
            email: user.email || undefined,
            phone: user.phone || undefined,
          };
        } catch (error) {
          // Handle Zod validation errors
          if (error instanceof ZodError) {
            // Return null to indicate that the credentials are invalid
            return null;
          }
          // Re-throw unexpected errors
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});

export const { GET, POST } = handlers;
