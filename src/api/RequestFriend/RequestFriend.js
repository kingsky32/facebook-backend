import { prisma } from "../../../generated/prisma-client";

export default {
  RequestFriend: {
    user: ({ id }) => prisma.requestFriend({ id }).user(),
    opponent: ({ id }) => prisma.requestFriend({ id }).opponent()
  }
};
