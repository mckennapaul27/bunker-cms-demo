import type { NextAuthOptions, Profile, Session } from 'next-auth';
import { Account } from 'next-auth';
import { User as AuthUser } from 'next-auth';
import { User as NextAuthUser } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectToDb from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { JWT } from 'next-auth/jwt';

// Tutorial used https://www.youtube.com/watch?v=1SjqRn_Ira4

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                await connectToDb();
                try {
                    if (credentials) {
                        const user = await User.findOne({
                            email: credentials.email,
                        });
                        if (user) {
                            const isMatch = await bcrypt.compare(
                                credentials.password,
                                user.password
                            );
                            if (isMatch) {
                                return user;
                            }
                        }
                    }
                } catch (error) {
                    if (error instanceof Error) {
                        throw new Error(error.message);
                    } else {
                        throw new Error(String(error));
                    }
                }
                return null; // Return null when credentials are invalid or an error occurs
            },
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID ?? ('' as string),
            clientSecret: process.env.GITHUB_CLIENT_SECRET ?? ('' as string),
        }),
    ],
    callbacks: {
        async signIn({
            user,
            account,
        }: {
            user: AuthUser;
            account: Account | null;
            profile?: Profile | undefined;
        }) {
            if (account) {
                if (account.provider === 'credentials') {
                    return true;
                }
                //  below is for social logins
                if (account?.provider === 'github') {
                    await connectToDb();
                    try {
                        const existing_user = await User.findOne({
                            email: user.email,
                        });
                        if (existing_user) {
                            return true;
                        }
                        const newUser = new User({
                            email: user.email,
                        });
                        await newUser.save();
                        return true;
                    } catch (error) {
                        if (error instanceof Error) {
                            throw new Error(error.message);
                        } else {
                            throw new Error(String(error));
                        }
                    }
                }
            }
            return false;
        },
        async jwt({
            user,
            token,
            account,
            profile,
        }: {
            user: AuthUser;
            token: JWT;
            account: Account | null;
            profile?: Profile | undefined;
        }) {
            // account and profile are only available on sign in with social
            // Persist the OAuth access_token and or the user id to the token right after signin

            // if (user) {
            //     token.first_name = extendedUser.first_name;
            //     token.last_name = extendedUser.last_name;
            //     token.email = extendedUser.email;
            //     token.user_id = extendedUser._id;
            // }

            if (user) {
                console.log('user here:', user);
                token.first_name = (user as any).first_name;
                token.last_name = (user as any).last_name;
                token.email = user.email; // Assuming email exists on the User type
                token.user_id = (user as any)._id;
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            session.user = {
                ...session.user,
                first_name: token.first_name,
                last_name: token.last_name,
                email: token.email,
                user_id: token.user_id,
            } as any;

            return session;
        },
    },
};
