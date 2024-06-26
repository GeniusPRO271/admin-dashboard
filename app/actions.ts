'use server';

import { CreateUser, UpdateUserRole, UserRegister, addUserToSpace, changeSpaceOfDevice, deleteSpacebyId, deleteUserOfSpacebyId, syncDevices, updateSpaceById } from '@/lib/db';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { space } from 'postcss/lib/list';
import { signIn } from './api/auth/[...nextauth]';

export async function createUser(body: UserRegister) {
  await CreateUser(body);
  revalidatePath('/dashboard');
}

export async function deleteSpace(spaceId: number) {
  await deleteSpacebyId(spaceId);
  revalidatePath('/dashboard/spaces');
}

export async function deleteUserSpace(spaceId: number, userId: number) {
  await deleteUserOfSpacebyId(userId,spaceId);
  revalidatePath('/board');
}

export async function AddUserSpace(spaceId: number, userId:number) {
  await addUserToSpace(userId, spaceId);
  revalidatePath('/board')
}

export async function updateSpace(spaceId: number, spaceName: string, parentSpaceId: number) {
  console.log("updating space")
  await updateSpaceById(spaceId,spaceName, parentSpaceId);
  revalidatePath('/dashboard/spaces');
}

export async function updateUserRole(userId: number, roleId: number) {
  console.log("updating role")
  await UpdateUserRole(userId, roleId);
  revalidatePath('/dashboard');
}

export async function changeDeviceSpace(spaceId: number, deviceId: number) {
  console.log("updating device")
  await changeSpaceOfDevice(spaceId, deviceId);
  revalidatePath('/dashboard/devices');
}


export async function devicesSync(){
  console.log("devicesSync")
  await syncDevices()
  revalidatePath('/dashboard/devices');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    console.log(formData)
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}