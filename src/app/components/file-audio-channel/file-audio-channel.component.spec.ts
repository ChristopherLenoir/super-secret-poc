/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AudioChannelComponent } from './file-audio-channel.component';

describe('AudioChannelComponent', () => {
  let component: AudioChannelComponent;
  let fixture: ComponentFixture<AudioChannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AudioChannelComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
