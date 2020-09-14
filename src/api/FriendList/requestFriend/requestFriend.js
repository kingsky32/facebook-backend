import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    requestFriend: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { id, friendId } = args;
      const { user } = request;
      try {
        const existingFriendList = await prisma.$exists.friendList({ id });
        if (existingFriendList) {
          await prisma.createFriendList({
            user: {
              connect: {
                id: friendId
              }
            },
            friend: {
              connect: {
                id: user.id
              }
            },
            request: true
          });
          await prisma.updateFriendList({
            data: {
              request: true
            },
            where: {
              id
            }
          });
        }
        return true;
      } catch (e) {
        return false;
      }
    }
  }
};
