import { DatabaseInfo, ForeignKeyInfo, NamedObjectInfo, TableInfo } from 'dbgate-types';
import uuidv1 from 'uuid/v1';

// export interface PerspectiveConfigColumns {
//   expandedColumns: string[];
//   checkedColumns: string[];
//   uncheckedColumns: string[];
// }

export interface PerspectiveCustomJoinConfig {
  joinid: string;
  joinName: string;
  baseUniqueName: string;
  conid?: string;
  database?: string;
  refSchemaName?: string;
  refTableName: string;
  columns: {
    baseColumnName: string;
    refColumnName: string;
  }[];
}

export interface PerspectiveFilterColumnInfo {
  columnName: string;
  filterType: string;
  pureName: string;
  schemaName: string;
  foreignKey: ForeignKeyInfo;
}

// export interface PerspectiveParentFilterConfig {
//   uniqueName: string;
// }
// export interface PerspectiveConfig extends PerspectiveConfigColumns {
//   rootObject: { schemaName?: string; pureName: string };
//   filters: { [uniqueName: string]: string };
//   sort: {
//     [parentUniqueName: string]: {
//       uniqueName: string;
//       order: 'ASC' | 'DESC';
//     }[];
//   };
//   customJoins: PerspectiveCustomJoinConfig[];
//   parentFilters: PerspectiveParentFilterConfig[];
// }

export interface PerspectiveNodeConfig {
  designerId: string;
  schemaName?: string;
  pureName: string;

  conid?: string;
  database?: string;

  isParentFilter?: true | undefined;

  expandedNodes: string[];
  checkedNodes: string[];
  uncheckedNodes: string[];

  sort: {
    columnName: string;
    order: 'ASC' | 'DESC';
  }[];

  filters: { [uniqueName: string]: string };
  isAutoGenerated?: true | undefined;

  position: {
    x: number;
    y: number;
  };
}

export interface PerspectiveReferenceConfig {
  designerId: string;

  sourceId: string;
  targetId: string;

  columns: {
    source: string;
    target: string;
  }[];

  isAutoGenerated?: true | undefined;
}

export interface PerspectiveConfig {
  rootDesignerId: string;
  nodes: PerspectiveNodeConfig[];
  references: PerspectiveReferenceConfig[];
}

export function createPerspectiveNodeConfig(name: { schemaName?: string; pureName: string }) {
  const node: PerspectiveNodeConfig = {
    ...name,
    designerId: uuidv1(),

    expandedNodes: [],
    checkedNodes: [],
    uncheckedNodes: [],

    sort: [],
    filters: {},
  };

  return node;
}

export function createPerspectiveConfig(rootObject: { schemaName?: string; pureName: string }): PerspectiveConfig {
  const rootNode = createPerspectiveNodeConfig(rootObject);
  return {
    nodes: [rootNode],
    references: [],
    rootDesignerId: rootNode.designerId,
  };
}

export type ChangePerspectiveConfigFunc = (
  changeFunc: (config: PerspectiveConfig) => PerspectiveConfig,
  reload?: boolean
) => void;

export function extractPerspectiveDatabases(
  { conid, database },
  cfg: PerspectiveConfig
): { conid: string; database: string }[] {
  const res: { conid: string; database: string }[] = [];
  res.push({ conid, database });

  function add(conid, database) {
    if (res.find(x => x.conid == conid && x.database == database)) return;
    res.push({ conid, database });
  }

  for (const node of cfg.nodes) {
    add(node.conid || conid, node.database || database);
  }
  return res;
}

export interface MultipleDatabaseInfo {
  [conid: string]: {
    [database: string]: DatabaseInfo;
  };
}
