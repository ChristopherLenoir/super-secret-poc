/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpresscanvasChartComponent } from './expresscanvas.component';

describe('ExpresscanvasChartComponent', () => {
  let component: ExpresscanvasChartComponent;
  let fixture: ComponentFixture<ExpresscanvasChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExpresscanvasChartComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpresscanvasChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
