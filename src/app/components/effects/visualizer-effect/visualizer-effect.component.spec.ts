/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VisualizerEffectComponent } from './visualizer-effect.component';

describe('VisualizerEffectComponent', () => {
  let component: VisualizerEffectComponent;
  let fixture: ComponentFixture<VisualizerEffectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizerEffectComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizerEffectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
