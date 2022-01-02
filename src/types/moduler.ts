/**
 * 模型信息
 */
export interface ModulerInfo {
  id?: string;
  modelName: string;
  modelKey: string;
  owners: string[];
  scenes: any[];
  desc: string;
}

/**
 * 模型列表项
 */
export interface ModulerItem extends ModulerInfo {
  creator: string;
  updateTime: number;
  createTime: number;
}

/**
 * 模型列表筛选项
 */
export interface ModulerFilters {
  modelKey?: string;
  ownerIsMe?: boolean;
  startTime?: number;
  endTime?: number;
  sceneId?: string;
}

/** 场景 */
export interface ScenesItem {
  id: string;
  name?: string;
}

/** 操作日志项 */
export interface LogItem {
  modelId: string;
  modelKey: string;
  versionId: string;
  modelVersion: string;
  /** 操作类型 */
  opType: string;
  /** 操作人 */
  operator: string;
  /** GIT版本号 */
  gitCommit: string;
  /** 操作状态 */
  status: string;
  /** 操作时间 */
  createTime: string;
}
