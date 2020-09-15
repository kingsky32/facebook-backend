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
              id
            }
          }
        ]
      };
      const requestFriendFilterOptions = {
        AND: [
          {
            user: {
              id
            }
          },
          {
            opponent: {
              id: user.id
            }
          }
        ]
      };
      try {
        if (user.id === id) throw Error("You can't make friends with yourself.");
        const exstingFrined = await prisma.$exists.friendList({
          AND: [
            {
              user: {
                id
              }
            },
            {
              friend: {
                id: user.id
              }
            }
          ]
        });
        if (exstingFrined) throw Error("Unknown error");
        const existingFriendList = await prisma.$exists.friendList(filterOptions);
        if (existingFriendList) {
          await prisma.deleteManyFriendLists(filterOptions);
          await prisma.deleteManyRequestFriends(requestFriendFilterOptions);
          return 0;
        } else {
          await prisma.createFriendList({
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
          await prisma.createRequestFriend({
            user: {
              connect: {
                id
              }
            },
            opponent: {
              connect: {
                id: user.id
              }
            }
          });
        }
        return 1;
      } catch (e) {
        return 0;
      }
    }
  }
};
