import { ImagePickerAsset } from "expo-image-picker";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  ImageGravity,
  Query,
  Storage,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.aora",
  projectId: "66c58bdf0012f0da94ce",
  databaseId: "66c58e130022ebb86780",
  userCollectionId: "66c58e30003aec7f5391",
  videoCollectionId: "66c58e5700264ed2ec67",
  storageId: "66c5958d0014fecd9f96",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const datatbases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (
  email: string,
  password: string,
  username?: string
) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;
    else {
      const avatarUrl = avatars.getInitials(username);

      await signIn(email, password);

      const newUser = await datatbases.createDocument(
        config.databaseId,
        config.userCollectionId,
        ID.unique(),
        { accountId: newAccount?.$id, email, username, avatar: avatarUrl }
      );

      return newUser;
    }
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await datatbases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount?.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await datatbases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc("$createdAt")]
    );

    return posts.documents;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await datatbases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const searchPosts = async (query: string) => {
  try {
    const posts = await datatbases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.search("title", query)]
    );

    return posts.documents;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getUserPosts = async (userId: string) => {
  try {
    const posts = await datatbases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    return posts.documents;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error: any) {
    throw new Error(error);
  }
};

export interface IVideo {
  title: string;
  video: ImagePickerAsset | null;
  thumbnail: ImagePickerAsset | null;
  prompt: string;
  userId: string;
}

export const getFilePreview = async (
  fileId: string,
  type: "image" | "video"
) => {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(config.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        config.storageId,
        fileId,
        2000,
        2000,
        ImageGravity.Top,
        100
      );
    } else {
      throw new Error("Invalid file type");
    }
    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error: any) {
    throw new Error(error);
  }
};

const uploadFile = async (
  file: ImagePickerAsset | null,
  type: "image" | "video"
) => {
  if (!file) return;

  const asset = {
    name: file.fileName ?? "",
    type: file.mimeType ?? "",
    size: file.fileSize ?? 0,
    uri: file.uri ?? "",
  };

  try {
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset
    );
    const fileUrl = await getFilePreview(uploadedFile?.$id, type);

    return fileUrl;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const createVideo = async (form: IVideo) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await datatbases.createDocument(
      config.databaseId,
      config.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error: any) {
    throw new Error(error);
  }
};
