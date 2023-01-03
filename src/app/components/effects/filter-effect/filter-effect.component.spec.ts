/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterEffectComponent } from './filter-effect.component';

describe('FilterEffectComponent', () => {
  let component: FilterEffectComponent;
  let fixture: ComponentFixture<FilterEffectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterEffectComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterEffectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
