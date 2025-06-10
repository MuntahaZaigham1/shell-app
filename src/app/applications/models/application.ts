export interface User {
  id: number;
  emailAddress: string;
}

export interface ApplicationMetadata {
  id: number,
  name: string
}

export interface Application {
  id: number;
  name: string;
  uiBuilderProjectId?: number;
  uiBuilderClientId?: number;
  codegenProjectId?: number;
  apiBuilderProjectId?: number;
  bpmnModelerProjectId?: number;
  createdAt?: string; // ISO date string
  updatedAt?: string;
  assignedUsers?: User[];
  activeUser?: User;
}
