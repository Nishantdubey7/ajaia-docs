export interface UserDTO {
  id: string;
  name: string;
  email: string;
}

export interface DocumentDTO {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner?: UserDTO;
}

export interface ShareDTO {
  id: string;
  documentId: string;
  userId: string;
  createdAt: string;
  user: UserDTO;
}
