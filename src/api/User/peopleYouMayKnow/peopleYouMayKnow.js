import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    peopleYouMayKnow: (_, __, { request }) => {
      const { user } = request;
      return prisma.users({
        where: {
          AND: [
            {
              friends_every: {
                request: true
              }
            }
          ],
          NOT: [
            {
              id: user.id
            }
          ]
        }
      });
    }
  }
};