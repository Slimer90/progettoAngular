import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstrazioneUniversoComponent } from './estrazione-universo.component';

describe('EstrazioneUniversoComponent', () => {
  let component: EstrazioneUniversoComponent;
  let fixture: ComponentFixture<EstrazioneUniversoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstrazioneUniversoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstrazioneUniversoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
