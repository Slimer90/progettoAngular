import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RisultanzeComponent } from './risultanze.component';

describe('RisultanzeComponent', () => {
  let component: RisultanzeComponent;
  let fixture: ComponentFixture<RisultanzeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RisultanzeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RisultanzeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
