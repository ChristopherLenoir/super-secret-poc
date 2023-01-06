/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CompressorEffectComponent } from './compressor-effect.component';

describe('CompressorEffectComponent', () => {
  let component: CompressorEffectComponent;
  let fixture: ComponentFixture<CompressorEffectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompressorEffectComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompressorEffectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
