import { Component, OnInit } from '@angular/core';
import { SharedNavigationService } from 'fastcode-shared-service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // encapsulation: ViewEncapsulation.ShadowDom
})
export class AppComponent implements OnInit {
  title: string = "";
  ngOnInit() {
    this.sharedNavService.navigation$.subscribe((path: any) => {
      if (path) {
        this.sharedNavService.navigate(path);
      }
    });
  }

  constructor(
    private sharedNavService: SharedNavigationService,
  ) { }
}
