import { currentUser } from '@clerk/nextjs/server';
import db from './prisma';

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }
  try {
    const userDataPresentInDb = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });
    if (userDataPresentInDb) {
      return null;
    }

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name: `${user.firstName ?? ''} ${user.lastName ?? ''}`,
        email: user.emailAddresses[0]?.emailAddress || '',
        imageUrl: user.imageUrl || '',
      },
    });
    return newUser;
  } catch (error) {
    console.log(error);
    return null;
  }
};
