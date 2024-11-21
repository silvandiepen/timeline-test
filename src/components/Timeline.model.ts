
export interface Day {
  label: string,
  id: string
}


export interface Lane {
  label: string,
  id: string,
  tasks: Task[]
}


export interface Entity {
  id: string;
  label: string;
  collapsed?: boolean;
  lanes: {
    id: string;
    label: string;
    tasks: Task[];
  }[];
}

export interface Task {
  id: string;
  label: string;
  startDay: number;
  lengthInDays: number;
}
