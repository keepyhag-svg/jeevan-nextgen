import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // NOTE: We will connect your database here in a future step!
        // Right now, this is just the required structure so the app doesn't crash.
        console.log("Credentials submitted:", credentials);
        
        // Return null for now until we hook up the database
        return null; 
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
})