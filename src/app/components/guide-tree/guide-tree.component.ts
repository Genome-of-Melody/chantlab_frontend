import {Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';

import * as phylotree from 'phylotree';
import {IChant} from '../../interfaces/chant.interface';
import {PhyloService} from '../../services/phylo.service';

@Component({
  selector: 'app-guide-tree',
  templateUrl: './guide-tree.component.html',
  styleUrls: ['./guide-tree.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GuideTreeComponent implements OnInit {

  @Input() treeString: string;
  @Input() newickNamesDict: Map<string, number>;
  @Input() chants: Array<IChant>;
  @ViewChild('treeContainer', {static: true}) treeContainer: ElementRef;

  public treeShowValue: string;

  constructor(
    private phyloService: PhyloService,
  ) { }

  ngOnInit(): void {

    // TODO: Add names dict handling.
    // const orderedCenturiesProportion = this.phyloService.computeOrderedCenturiesProportion(
    //   this.treeString, this.newickNamesDict, this.chants
    // );
    if(this.treeString != null){ // ToDo Remove the if-statement, and fix the functionality of the component
      const tree = new phylotree.phylotree(this.treeString);
      const renderedTree = tree.render({height: 600, width: 1000,
        'left-right-spacing': 'fit-to-size',
        'top-bottom-spacing': 'fit-to-size'});
      // console.log(renderedTree);

      const showValue = renderedTree.show();
      // console.log(showValue);
      // console.log(showValue.outerHTML);
      this.treeShowValue = showValue.outerHTML;
      // console.log(this.testBox);
      this.treeContainer.nativeElement.innerHTML = this.treeShowValue;
    }else{
      console.error("The Tree String is null or undefined. For this case, the functionality of Guide Trees is not supported.");
    }
  }

}
