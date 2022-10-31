import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletaCampioneComponent } from './completa-campione.component';

describe('CompletaCampioneComponent', () => {
  let component: CompletaCampioneComponent;
  let fixture: ComponentFixture<CompletaCampioneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletaCampioneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletaCampioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
