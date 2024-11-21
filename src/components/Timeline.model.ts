
export interface Day {
  label: string,
  id: string,
  entities: Entity[]
}

export interface Task {
  label: string;
  id: string;
  lengthInDays: number;
  startDay: number;
}

export interface Lane {
  label: string,
  id: string,
  tasks: Task[]
}


export interface Entity {
  label: string,
  id: string,
  lanes: Lane[],
  collapsed: boolean
}
