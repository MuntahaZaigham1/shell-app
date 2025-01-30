import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get(`https://127.0.0.1:8181/health`).subscribe();
  }

  healthCheck(){
    this.http.get(`https://127.0.0.1:8181/health`).subscribe();
  }

}
