import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    seeFeed: async (_, __, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { user } = request;
      const friends = await prisma
        .user({ id: user.id })
        .friends({
          where: {
            AND: [
              {
                user: { id: user.id }
              },
              {
                request: true
              }
            ]
          }
        })
        .friend();
      return prisma.posts({
        where: {
          user: {
            id_in: [...friends.map(user => user.friend.id), user.id]
          }
        },
        orderBy: "createdAt_DESC"
      });
    }
  }
};
