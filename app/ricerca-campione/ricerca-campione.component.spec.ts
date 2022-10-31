import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RicercaCampioneComponent } from './ricerca-campione.component';

describe('RicercaCampioneComponent', () => {
  let component: RicercaCampioneComponent;
  let fixture: ComponentFixture<RicercaCampioneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RicercaCampioneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RicercaCampioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
