/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GateEffectComponent } from './gate-effect.component';

describe('GateEffectComponent', () => {
  let component: GateEffectComponent;
  let fixture: ComponentFixture<GateEffectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GateEffectComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GateEffectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
