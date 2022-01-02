/**
 * 版本信息
 */
export interface VersionInfo {
  versionId?: string;
  modelId: string;
  modelVersion: string;
  gitUrl: string;
  gitBranch: string;
  mainFunction: string;
  pomPath: string;
  desc: string;
}

/**
 * 版本列表项
 */
export interface VersionItem extends VersionInfo {
  versionId: string;
  /** 状态。链接形式呈现，URL为failMessageURL */
  status: string;
  /** 0-成功，-1-失败，1-进行中 */
  statusCode: 0 | -1 | 1;
  buildCommit: string;
  buildCommitUrl: string;
  deployCommit: string;
  deployCommitUrl: string;
  /** 失败原因URL，不展示 */
  failMessageURL: string;
}

/**
 * 列表筛选项
 */
export interface VersionFilters {
  modelId: string;
  /** 版本标识 */
  modelVersion?: string;
  /** 只看我的。筛选条件，default true */
  ownerIsMe?: boolean;
  startTime?: number;
  endTime?: number;
}

/**
 * 模型部署参数
 */
export interface DeployParams {
  versionId?: string;
  /** 部署环境 */
  env?: string;
  /** 交互方式 */
  interactionType?: string;
  parameter: string;
  startTime?: number;
  endTime?: number;
}
