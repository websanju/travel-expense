import Credentials from "next-auth/providers/credentials";
import type {
  NextAuthOptions,
  User,
} from "next-auth";
import { getServerSession } from "next-auth/next";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "text",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (
          !credentials?.email ||
          !credentials?.password
        ) {
          return null;
        }

        const user =
          await prisma.user.findUnique({
            where: {
              email:
                credentials.email,
            },
          });

        if (!user) {
          return null;
        }

        const valid =
          await bcrypt.compare(
            credentials.password,
            user.password
          );

        if (!valid) {
          return null;
        }

        const authUser: User = {
          id: user.id,
          email: user.email,
          name: user.name,
        };

        return authUser;
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge:
      30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    maxAge:
      30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({
      token,
      user,
    }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },

    async session({
      session,
      token,
    }) {
      if (session.user) {
        (
          session.user as {
            id?: string;
          }
        ).id =
          token.id as string;
      }

      return session;
    },
  },

  secret:
    process.env.NEXTAUTH_SECRET,
};

export type SessionShape = {
  user?: {
    id?: string;
    email?: string;
    name?: string | null;
  } | null;
};

export async function auth(): Promise<
  SessionShape | null
> {
  try {
    const session =
      await getServerSession(
        authOptions
      );

    return session as SessionShape | null;
  } catch {
    return null;
  }
}