// Data Source types

export type DataSourceType = 'rds' | 'polardb' | 'adb' | 'file';

export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  config: DataSourceConfig;
  isBuiltin: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  tables?: DataTable[];
}

export interface DataSourceConfig {
  // For database connections
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  ssl?: boolean;

  // For file uploads
  fileId?: string;
  filePath?: string;
  fileType?: string;
}

export interface DataTable {
  id: string;
  dataSourceId: string;
  name: string;
  description?: string;
  schema?: TableSchema;
  createdAt: Date;
  updatedAt: Date;
}

export interface TableSchema {
  columns: ColumnInfo[];
  primaryKey?: string[];
  foreignKeys?: ForeignKey[];
  indexes?: Index[];
}

export interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue?: string;
  comment?: string;
}

export interface ForeignKey {
  columns: string[];
  referencedTable: string;
  referencedColumns: string[];
}

export interface Index {
  name: string;
  columns: string[];
  unique: boolean;
}

export interface CreateDataSourceRequest {
  name: string;
  type: DataSourceType;
  config: DataSourceConfig;
  description?: string;
}

export interface TestConnectionRequest {
  type: DataSourceType;
  config: DataSourceConfig;
}

export interface TestConnectionResponse {
  success: boolean;
  message?: string;
  tables?: string[];
}
