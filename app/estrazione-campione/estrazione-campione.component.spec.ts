import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstrazioneCampioneComponent } from './estrazione-campione.component';

describe('EstrazioneCampioneComponent', () => {
  let component: EstrazioneCampioneComponent;
  let fixture: ComponentFixture<EstrazioneCampioneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstrazioneCampioneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstrazioneCampioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
