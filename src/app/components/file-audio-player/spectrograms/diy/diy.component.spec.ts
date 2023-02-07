/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DiyComponent } from './diy.component';

describe('DiyComponent', () => {
  let component: DiyComponent;
  let fixture: ComponentFixture<DiyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
