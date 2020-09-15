import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    confirmFriend: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { id } = args;
      try {
        const existingrequestFriend = await prisma.$exists.requestFriend({ id });
        if (existingrequestFriend) {
          const user = await prisma.requestFriend({ id }).user();
          const opponent = await prisma.requestFriend({ id }).opponent();
          const [friendList] = await prisma.friendLists({
            where: {
              AND: [
                {
                  user: {
                    id: opponent.id
                  }
                },
                {
                  friend: {
                    id: user.id
                  }
                }
              ]
            }
          });
          await prisma.deleteRequestFriend({ id });
          await prisma.createFriendList({
            user: {
              connect: {
                id: user.id
              }
            },
            friend: {
              connect: {
                id: opponent.id
              }
            },
            request: true
          });
          await prisma.updateFriendList({
            where: {
              id: friendList.id
            },
            data: {
              request: true
            }
          });
          return true;
        }
        return false;
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
};
