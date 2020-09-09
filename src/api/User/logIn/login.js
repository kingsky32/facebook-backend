import { prisma } from "../../../../generated/prisma-client";
import { generateToken } from "../../../utils";
import sha256 from "sha256";

export default {
  Mutation: {
    logIn: async (_, args) => {
      const { email, password } = args;
      const user = await prisma.user({ email });
      const cryptPassword = sha256(password);
      if (user.email === email && user.password === cryptPassword) {
        return generateToken(user.id);
      } else {
        throw Error("Wrong email/password combination");
      }
    }
  }
};
