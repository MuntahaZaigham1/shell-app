import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-shared-service',
  template: `
    <p>
      shared-service works!
    </p>
  `,
  styles: [
  ]
})
export class SharedServiceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
