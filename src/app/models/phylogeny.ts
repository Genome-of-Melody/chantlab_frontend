
export class PhylogenyResponse {
    constructor(
      public newick: string,
      public mbScript: string,
      public nexusAlignment: string,
      public nexusConTre: string,
    ) {}
  }
  