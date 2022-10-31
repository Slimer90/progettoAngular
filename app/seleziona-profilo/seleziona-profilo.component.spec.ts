import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelezionaProfiloComponent } from './seleziona-profilo.component';

describe('SelezionaProfiloComponent', () => {
  let component: SelezionaProfiloComponent;
  let fixture: ComponentFixture<SelezionaProfiloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelezionaProfiloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelezionaProfiloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
