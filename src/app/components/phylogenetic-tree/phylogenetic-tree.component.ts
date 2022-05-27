import {Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';

import * as phylotree from 'phylotree';

@Component({
  selector: 'app-phylogenetic-tree',
  templateUrl: './phylogenetic-tree.component.html',
  styleUrls: ['./phylogenetic-tree.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PhylogeneticTreeComponent implements OnInit {

  @Input() treeString: string;
  @ViewChild('treeContainer', {static: true}) treeContainer: ElementRef;

  public treeShowValue: string;

  constructor() { }

  ngOnInit(): void {
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
  }

}
