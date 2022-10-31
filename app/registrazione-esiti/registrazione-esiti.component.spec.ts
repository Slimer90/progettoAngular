import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrazioneEsitiComponent } from './registrazione-esiti.component';

describe('RegistrazioneEsitiComponent', () => {
  let component: RegistrazioneEsitiComponent;
  let fixture: ComponentFixture<RegistrazioneEsitiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrazioneEsitiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrazioneEsitiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
