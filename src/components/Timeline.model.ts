
export interface Day {
  label: string,
  id: string,
  month: number,
  isToday: boolean,
  date: Date
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
  startDay: Date;
  lengthInDays: number;
}

export const taskNames = [
  "Annual Disneyland Cast Member Training and Magic Kingdom Operations Summit",
  "Feed Dumbo",
  "Comprehensive Review of Magic Carpet Navigation Systems and Flying Protocol",
  "Tea with Mad Hatter",
  "Development of Next-Generation Princess Meet-and-Greet Experience Architecture",
  "Polish Glass Slippers",
  "Implementation of Advanced Fairy Godmother Wish Fulfillment System",
  "Quick Dwarfs' Mine Inspection",
  "Enchanted Forest Maintenance and Magical Creature Habitat Assessment",
  "Brush Rapunzel's Hair",
  "Finding Nemo: Advanced Underwater Search and Rescue Operations Planning",
  "Paint Roses Red",
  "Beast's Castle Library Cataloging and Magical Book Classification Project",
  "Wake Snow White",
  "Optimization of Seven Dwarfs Mining Operation Efficiency",
  "Visit Fairy Godmother",
  "Analysis of Hook's Ship Navigation Systems and Peter Pan Flight Patterns",
  "Feed Mushu",
  "Wonderland Tea Party Logistics and Mad Hatter Coordination Meeting",
  "Update Genie's Wish List",
  "Integration of Magic Mirror Communication Networks",
  "Dance",
  "Development of Anti-Villain Defense Systems for Princess Protection Program",
  "Sing with Birds",
  "Hundred Acre Wood Honey Production and Distribution Strategy Session",
  "Feed Sebastian",
  "Enchanted Rose Preservation Protocol Development",
  "Sweep Chimney",
  "Advanced Study of Pixie Dust Properties and Flight Mechanics",
  "Train Dragons",
  "Implementation of Kingdom-Wide Happy Thoughts Distribution Network",
  "Pick Poisoned Apples",
  "Ariel's Voice Storage System Security Audit",
  "Build Snowman",
  "Frozen Kingdom Climate Control Systems Maintenance",
  "Practice Magic",
  "Evaluation of Glass Slipper Durability Standards",
  "Royal Ball Planning",
  "Comprehensive Analysis of Fairy Tale Happy Ending Success Rates",
  "Feed Flounder"
];

export const exampleUserNames = [
  'Mickey', 'Minnie', 'Goofy', 'Pluto', 'Donald', 'Aladdin', 'Hercules', 'Ariel', 'Pinocchio', 'Robin Hood',
  'Jasmine', 'Simba', 'Timon', 'Pumbaa', 'Mulan', 'Merida', 'Belle', 'Beast', 'Snow White', 'Cinderella',
  'Aurora', 'Peter Pan', 'Wendy', 'Captain Hook', 'Tinker Bell', 'Alice', 'Mad Hatter', 'Dumbo', 'Bambi', 'Thumper',
  'Pocahontas', 'John Smith', 'Tarzan', 'Jane', 'Mowgli', 'Baloo', 'Bagheera', 'Rapunzel', 'Flynn Rider', 'Merlin',
  'Arthur', 'Tiana', 'Naveen', 'Lilo', 'Stitch', 'Moana', 'Maui', 'Anna', 'Elsa', 'Kristoff',
  'Olaf', 'Sven', 'Buzz Lightyear', 'Woody', 'Jessie', 'Rex', 'Hamm', 'Slinky Dog', 'Mr. Potato Head', 'Mrs. Potato Head'
];


export const projectNames = [
  "Operation Bibbidi Bobbidi Boo",
  "Project Glass Slipper",
  "The Wonderland Initiative",
  "Mission: Neverland",
  "The Pride Lands Program",
  "Operation Hakuna Matata",
  "The Frozen Protocol",
  "Project Let It Go",
  "The Beast's Transformation",
  "Operation True Love's Kiss",
  "The Mermaid Project",
  "Mission: Under the Sea",
  "Project Whole New World",
  "The Magic Carpet Initiative",
  "Operation Dragon Fire",
  "The Lost Boys Protocol",
  "Project Second Star",
  "The Hundred Acre Initiative",
  "Operation Bare Necessities",
  "Project Circle of Life"
];

export const clientNames = [
  "Corona Royal Holdings",
  "Agrabah Ventures Ltd",
  "Atlantica Marine Corp",
  "Pride Rock Enterprises",
  "Wonderland Consulting Group",
  "Neverland Aviation",
  "Arendelle Ice Industries",
  "Beast's Castle Management",
  "Dwarfs Mining Co.",
  "Fairy Godmother Industries",
  "Merlin's Magical Solutions",
  "Genie's Infinite Possibilities",
  "Olympus Peak Partners",
  "Sherwood Forest Fund",
  "Tiana's Palace Holdings",
  "Mad Hatter Tea Company",
  "Pixie Hollow Technologies",
  "Monstro Shipping Corp",
  "Princess Protection Agency",
  "Evil Queen Enterprises"
];
