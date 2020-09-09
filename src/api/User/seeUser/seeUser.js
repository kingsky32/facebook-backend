import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    seeUser: (_, args) => {
      const { email } = args;
      return prisma.user({ email });
    }
  }
};
