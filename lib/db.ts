import axios, { AxiosResponse } from 'axios';

const baseURL: string = 'https://lock-system.up.railway.app';


export interface SelectUser {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
}

export interface DeviceInfo {
  Id: number;
  Online: boolean;
  Name: string;
  ProductName: string;
  ProviderDeviceID: string;
  ProductKey: string;
  ProviderUUID: string;
  SpaceID: number | null; // Assuming SpaceID can be either a number or null
}

export interface Device {
  ID: number;
  Name: string;
  ProductName: string;
  ProviderDeviceID: string;
  Online: boolean;
  ProductKey: string;
  ProviderUUID: string;
  Instruction?: string | null;
  QrCode?: string | null;
  SpaceID?: number | null;
}

export interface SpaceInfo {
  ID: number;
  Name: string;
  ParentSpaceID: number | null;
  SubSpaces: SpaceInfo[] | null;
  Devices: Device[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
}

export interface Role {
  CreatedAt: string; // ISO 8601 date string
  UpdatedAt: string; // ISO 8601 date string
  DeletedAt: string | null; // ISO 8601 date string or null
  ID: number; // Unique identifier
  name: string; // Name of the role
  description: string; // Description of the role
}

function handleStatusCode(statusCode: number): [any | null, Error | null] {
  switch (statusCode) {
    case 400:
      return [null, new Error('Bad request: Invalid user data.')];
    case 401:
      return [null, new Error('Unauthorized: User not authenticated.')];
    case 403:
      return [null, new Error('Forbidden: Insufficient permissions.')];
    case 404:
      return [null, new Error('Not found: User not found.')];
    // Add more cases as needed for other status codes
    default:
      return [null, new Error(`Unknown error: ${statusCode}`)];
  }
}

export async function UpdateUserRole(userId: number ,roleId : number){
  try {

    let data: any = {
      role_id: roleId
  }

    const response: AxiosResponse = await axios.put(
      `${baseURL}/admin/v1/user/${userId}`,
      JSON.stringify(data)
    );

    console.log("user Updated=", response.data);

    return response.data; // Return response data if needed
  } catch (error) {
    console.error('Error updating User Role:', error);
    throw error; // Rethrow error to handle it in the caller function
  }
}
export async function GetRoles(): Promise<Role[]> {
  try {
    // Make GET request to fetch users from the external API
    const response = await axios.get(`${baseURL}/admin/v1/user/roles`);
    const roles : Role[] = response.data;
    console.log('roles=', response.data);
    return roles;
  } catch (error) {
    // Handle error
    console.error('Error fetching users:', error);
    return [];
  }
}
export async function getSpacesFlow(): Promise<SpaceInfo[]> {
  try {
    // Make GET request to fetch users from the external API
    const response = await axios.get(`${baseURL}/admin/v1/spaces-full`);
    const spaceData = response.data.message;
    console.log(response.data.message);
    return spaceData;
  } catch (error) {
    // Handle error
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function getSpaces(
  search: string,
  offset: number
): Promise<{
  spaces: SpaceInfo[];
  newOffset: number | null;
}> {
  try {
    // Make GET request to fetch users from the external API
    const response = await axios.get(`${baseURL}/admin/v1/spaces`);
    const spaceData = response.data.message;
    // If search term is provided, filter users based on search term
    if (search) {
      const filteredUsers = spaceData.filter((space: SpaceInfo) =>
        space.Name.toLowerCase().includes(search.toLowerCase())
      );
      return {
        spaces: filteredUsers,
        newOffset: null
      };
    }

    // If offset is null, return empty users array and null offset
    if (offset === null) {
      return { spaces: [], newOffset: null };
    }

    // If offset is provided, return users based on offset and limit

    const startIndex = offset;
    const endIndex = offset + 20;
    const moreUsers = spaceData.slice(startIndex, endIndex);
    const newOffset = endIndex < spaceData.length ? endIndex : null;
    return { spaces: moreUsers, newOffset };
  } catch (error) {
    // Handle error
    console.error('Error fetching users:', error);
    return { spaces: [], newOffset: null };
  }
}

export async function getDevices(
  search: string,
  offset: number
): Promise<{
  devices: DeviceInfo[];
  newOffset: number | null;
}> {
  try {
    // Make GET request to fetch users from the external API
    const response = await axios.get(`${baseURL}/v1/devices`);
    const deviceData = response.data.result;
    // If search term is provided, filter users based on search term
    if (search) {
      const filteredUsers = deviceData.filter((device: DeviceInfo) =>
        device.Name.toLowerCase().includes(search.toLowerCase())
      );
      return {
        devices: filteredUsers,
        newOffset: null
      };
    }

    // If offset is null, return empty users array and null offset
    if (offset === null) {
      return { devices: [], newOffset: null };
    }

    // If offset is provided, return users based on offset and limit

    const startIndex = offset;
    const endIndex = offset + 20;
    const moreUsers = deviceData.slice(startIndex, endIndex);
    const newOffset = endIndex < deviceData.length ? endIndex : null;
    return { devices: moreUsers, newOffset };
  } catch (error) {
    // Handle error
    console.error('Error fetching users:', error);
    return { devices: [], newOffset: null };
  }
}
export async function getUsersAndAllowed(spaceId: string): Promise<{
  users: SelectUser[];
  allowed: SelectUser[];
}> {
  try {
    // Make GET request to fetch users from the external API
    const response = await axios.get(`${baseURL}/admin/v1/users`);
    const userData = response.data.data;

    const responseAllowed = await axios.get(
      `${baseURL}/admin/v1/space/${spaceId}/whitelist`
    );
    if (responseAllowed.data.message != 'empty') {
      const usersAllowed = responseAllowed.data.message;
      return { users: userData, allowed: usersAllowed };
    } else {
      return { users: userData, allowed: [] };
    }
  } catch (error) {
    // Handle error
    console.error('Error fetching users:', error);
    return { users: [], allowed: [] };
  }
}

export async function getUsers(
  search: string,
  offset: number
): Promise<{
  users: SelectUser[];
  newOffset: number | null;
}> {
  try {
    // Make GET request to fetch users from the external API
    const response = await axios.get(`${baseURL}/admin/v1/users`);
    const userData = response.data.data;
    // If search term is provided, filter users based on search term
    if (search) {
      const filteredUsers = userData.filter((user: SelectUser) =>
        user.name.toLowerCase().includes(search.toLowerCase())
      );
      return {
        users: filteredUsers,
        newOffset: null
      };
    }

    // If offset is null, return empty users array and null offset
    if (offset === null) {
      return { users: [], newOffset: null };
    }

    // If offset is provided, return users based on offset and limit

    const startIndex = offset;
    const endIndex = offset + 20;
    const moreUsers = userData.slice(startIndex, endIndex);
    const newOffset = endIndex < userData.length ? endIndex : null;
    return { users: moreUsers, newOffset };
  } catch (error) {
    // Handle error
    console.error('Error fetching users:', error);
    return { users: [], newOffset: null };
  }
}

export async function syncDevices() {
  try {
    console.log('Syncing devices');
    const response: AxiosResponse = await axios.post(`${baseURL}/v1/devices`);
    console.log(response.data.message);
  } catch (error) {}
}

export async function changeSpaceOfDevice(spaceId: number, deviceId: number) {
  try {
    let data: any = {
      DeviceId: deviceId,
      SpaceId: spaceId
    };

    const response: AxiosResponse = await axios.put(
      `${baseURL}/v1/device`,
      JSON.stringify(data)
    );

    return response.data.message; // Return response data if needed
  } catch (error) {
    console.error('Error changeSpaceOfDevice:', error);
    throw error; // Rethrow error to handle it in the caller function
  }
}

export async function updateSpaceById(
  spaceId: number,
  spaceName: string,
  parentSpaceId?: number
) {
  try {
    let data: any = {
      Name: spaceName
    };

    if (parentSpaceId !== undefined) {
      data.ParentSpaceID = parentSpaceId;
    }

    const response: AxiosResponse = await axios.put(
      `${baseURL}/admin/v1/space/${spaceId}`,
      JSON.stringify(data)
    );

    console.log(response.data.message); // Assuming response contains data to log

    return response.data; // Return response data if needed
  } catch (error) {
    console.error('Error updating space:', error);
    throw error; // Rethrow error to handle it in the caller function
  }
}

export interface UserRegister {
  Name: string;
  Email: string;
  Username: string;
  Password: string;
}

export async function CreateUser(body: UserRegister): Promise<[any | null, Error | null]> {
  try {
    const response = await axios.post(`${baseURL}/v1/user/register`, body);

    console.log(response.data); // Assuming response contains data to log

    return response.data.message; // Return response data if needed
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const statusCode = error.response.status;

      // Handle different status codes with custom error messages
      return handleStatusCode(statusCode)
    } else {
      // For non-Axios errors or errors without a response, throw the original error
      throw error;
    }
  }
}

export interface SpaceRegister {
  Name: string;
  ParentSpaceID?: number;
}

export async function CreateSpace(body: SpaceRegister) {
  try {
    const response = await axios.post(`${baseURL}/admin/v1/space`, body);

    console.log(response.data); // Assuming response contains data to log

    return response.data; // Return response data if needed
  } catch (error) {
    console.error('Error deleting space:', error);
    throw error; // Rethrow error to handle it in the caller function
  }
}

export async function deleteSpacebyId(id: number) {
  try {
    const response = await axios.delete(`${baseURL}/admin/v1/space/${id}`);

    console.log(response.data); // Assuming response contains data to log

    return response.data; // Return response data if needed
  } catch (error) {
    console.error('Error deleting space:', error);
    throw error; // Rethrow error to handle it in the caller function
  }
}

export async function deleteUserOfSpacebyId(userId: number, spaceId: number) {
  try {
    const body = {
      SpaceID: spaceId,
      UserID: userId,
      Propagate: true
    };

    const response = await axios.delete(
      `${baseURL}/admin/v1/space/delete-user-whitelist`,
      {
        data: JSON.stringify(body)
      }
    );

    console.log(response.data); // Assuming response contains data to log

    return response.data.message; // Return response data if needed
  } catch (error) {
    console.error('Error deleting space:', error);
    throw error; // Rethrow error to handle it in the caller function
  }
}

export async function addUserToSpace(userId: number, spaceId: number) {
  try {
    const body = {
      SpaceID: spaceId,
      UserID: userId,
      Propagate: true
    };

    const response = await axios.post(
      `${baseURL}/admin/v1/space/add-user-whitelist`,
      body
    );

    console.log(response.data.message); // Assuming response contains data to log

    return response.data.message; // Return response data if needed
  } catch (error) {
    console.error('Error deleting space:', error);
    throw error; // Rethrow error to handle it in the caller function
  }
}
export async function deleteUserById(id: number) {}
