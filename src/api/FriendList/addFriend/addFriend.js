import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    addFriend: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { id } = args;
      const { user } = request;
      const filterOptions = {
        AND: [
          {
            user: {
              id: user.id
            }
          },
          {
            friend: {
              id: id
            }
          }
        ]
      };
      try {
        const existingFriendList = await prisma.$exists.friendList(filterOptions);
        if (existingFriendList) {
          await prisma.deleteManyFriendLists(filterOptions);
        } else {
          const newFriend = await prisma.createFriendList({
            user: {
              connect: {
                id: user.id
              }
            },
            friend: {
              connect: {
                id
              }
            },
            request: false
          });
        }
        return true;
      } catch (e) {
        return false;
      }
    }
  }
};
