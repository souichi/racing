module Racing.Dto {
  export class Sequence {
    id: number;
  }

  export class Room {
    matched: boolean;
    cars: number[];
    result: number[];
  }

  export class Car {
    x: number;
    y: number;
    rotation: number;
  }
}
