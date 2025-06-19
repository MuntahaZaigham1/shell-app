export interface Application {
  id?: any;
  name: string;
  uiBuilderProjectId?: number;
  uiBuilderClientId?: number;
  codegenProjectId?: number;
  apiBuilderProjectId?: number;
  bpmnModelerProjectId?: number;
  githubUrl?: string;
}