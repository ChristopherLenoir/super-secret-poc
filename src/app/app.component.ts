import { Component, OnInit } from '@angular/core';
import { CurrentFileService, FilesService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'super-secret-poc';

  constructor(public filesService: FilesService, public currentFileService: CurrentFileService) {}

  ngOnInit() {}
}
