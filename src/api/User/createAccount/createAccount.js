import { prisma } from "../../../../generated/prisma-client";
import sha256 from "sha256";

export default {
  Mutation: {
    createAccount: async (_, args) => {
      const { username, email, password, firstName = "", lastName = "", bio = "" } = args;
      const cryptPassword = sha256(password);
      const exists = await prisma.$exists.user({ email });
      if (exists) {
        throw Error("This email is already taken");
      }
      await prisma.createUser({
        username,
        email,
        password: cryptPassword,
        firstName,
        lastName,
        bio
      });
      return true;
    }
  }
};
