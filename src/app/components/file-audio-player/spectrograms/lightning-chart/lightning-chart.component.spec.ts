/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LightningChartComponent } from './lightning-chart.component';

describe('LightningChartComponent', () => {
  let component: LightningChartComponent;
  let fixture: ComponentFixture<LightningChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LightningChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LightningChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
