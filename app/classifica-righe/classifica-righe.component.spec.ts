import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassificaRigheComponent } from './classifica-righe.component';

describe('ClassificaRigheComponent', () => {
  let component: ClassificaRigheComponent;
  let fixture: ComponentFixture<ClassificaRigheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassificaRigheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassificaRigheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
