import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaNonAutorizzatoComponent } from './pagina-non-autorizzato.component';

describe('PaginaNonAutorizzatoComponent', () => {
  let component: PaginaNonAutorizzatoComponent;
  let fixture: ComponentFixture<PaginaNonAutorizzatoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginaNonAutorizzatoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginaNonAutorizzatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
