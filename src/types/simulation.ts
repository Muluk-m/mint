/**
 * 仿真信息
 */
export interface SimulationInfo {
  taskId: string;
}

/**
 * 仿真列表项
 */
export interface SimulationItem extends SimulationInfo {
  name: string;
  modelKey: string;
  modelVersion: string;
  status: string;
  creator: string;
  createTime: number;
  /** 如果statusCode=0，这里是一条sql，点击查看结果需要复制到剪切板；如果statusCode=-1，这里是个文件URL，需要在newTab中打开URL */
  result: string;
  /** 状态码，不展示，用来辅助判断前端操作；0-成功，-1-失败，其他不用关注 */
  statusCode: number;
  confList: SimulationGroupItem[];
}

/**
 * 仿真列表筛选项
 */
export interface SimulationFilters {
  modelKey?: string;
  modelVersion?: string;
  ownerIsMe?: boolean;
  startTime?: number;
  endTime?: number;
}

export interface SimulationGroupItem {
  groupNumber: string;
  sql: string;
  /** 仿真参数 */
  parameter: string;
}

/**
 * 执行模型仿真入参
 */
export interface ExecuteSimulationParams {
  /** 模型标识 */
  modelId?: string;
  /** 模型版本id */
  versionId?: string;
  /** 模型版本标识 */
  modelVersion?: string;
  /** 仿真任务名称 */
  name?: string;
  /** 仿真配置 */
  confList: SimulationGroupItem[];
}
