import { prisma } from "../../../generated/prisma-client";

export default {
  FriendList: {
    user: ({ id }) => prisma.friendList({ id }).user(),
    friend: ({ id }) => prisma.friendList({ id }).friend(),
    request: ({ id }) => prisma.friendList({ id }).request()
  }
};
