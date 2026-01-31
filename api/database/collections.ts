'use server';

import aj from '@/lib/arcjet';
import db from '@/lib/prisma';
import { request } from '@arcjet/next';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { getCollectionResponse } from './collection/get-collection';

export type CreateCollectionRequest = {
  name: string;
  description?: string;
};

export type DeleteCollectionRequest = {
  id: string;
};
export async function getCollections(): Promise<getCollectionResponse[]> {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const collections = await db.collection.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return collections;
}

export async function deleteCollection(data: DeleteCollectionRequest) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error('User not found');

    // Check if collection exists and belongs to user
    const collection = await db.collection.findFirst({
      where: {
        id: data.id,
        userId: user.id,
      },
    });

    if (!collection) throw new Error('Collection not found');

    // Delete the collection (entries will be cascade deleted)
    await db.collection.delete({
      where: { id: data.id },
    });

    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export async function createCollectionFn(data: CreateCollectionRequest) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const req = await request();
  const decision = await aj.protect(req, { userId, requested: 1 });

  if (decision.isDenied()) {
    throw new Error('Rate limit exceeded');
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error('User not found');

  const collection = await db.collection.create({
    data: {
      name: data.name,
      description: data.description,
      userId: user.id,
    },
  });

  revalidatePath('/dashboard');
  return collection;
}
