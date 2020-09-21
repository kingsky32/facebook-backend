import { prisma } from "../../../generated/prisma-client";

export default {
  User: {
    posts: ({ id }) => prisma.user({ id }).posts(),
    likes: ({ id }) => prisma.user({ id }).likes(),
    comments: ({ id }) => prisma.user({ id }).comments(),
    rooms: ({ id }) => prisma.user({ id }).rooms(),
    postsCount: ({ id }) => prisma.postsConnection({ where: { user: { id } } }).aggregate().count(),
    peopleYouMayKnow: (_, __, { request }) => {
      const { user } = request;
      return prisma.users({
        where: {
          AND: [
            {
              friends_none: {
                request: true
              }
            },
            {
              NOT: [
                {
                  id: user.id
                }
              ]
            }
          ]
        }
      });
    },
    friends: ({ id }) =>
      prisma.user({ id }).friends({
        where: {
          AND: [
            {
              user: { id }
            },
            {
              request: true
            }
          ]
        }
      }),
    requestFriends: ({ id }) => prisma.user({ id }).requestFriends(),
    friendsCount: ({ id }) =>
      prisma
        .friendListsConnection({
          where: {
            AND: [
              {
                user: { id }
              },
              {
                request: true
              }
            ]
          }
        })
        .aggregate()
        .count(),
    fullName: parent => `${parent.firstName} ${parent.lastName}`,
    isFriend: async (parent, _, { request }) => {
      const { user } = request;
      const { id: parentId } = parent;
      try {
        const FriendState = await prisma.$exists.user({
          AND: [
            {
              id: user.id
            },
            {
              friends_some: {
                friend: {
                  id: parentId
                }
              }
            },
            {
              friends_every: {
                request: true
              }
            }
          ]
        });
        const requestFriendState = await prisma.$exists.user({
          AND: [
            {
              id: user.id
            },
            {
              friends_some: {
                friend: {
                  id: parentId
                }
              }
            },
            {
              friends_every: {
                request: false
              }
            }
          ]
        });
        if (FriendState) {
          return 2;
        } else if (requestFriendState) {
          return 1;
        } else {
          return 0;
        }
      } catch (error) {
        return 0;
      }
    },
    isFollowing: async (parent, _, { request }) => {
      const { user } = request;
      const { id: parentId } = parent;
      try {
        return prisma.$exists.user({
          AND: [
            {
              id: user.id
            },
            {
              following_some: {
                id: parentId
              }
            }
          ]
        });
      } catch (error) {
        return false;
      }
    },
    isSelf: (parent, _, { request }) => {
      const { user } = request;
      const { id: parentId } = parent;
      return user.id === parentId;
    }
  }
};
