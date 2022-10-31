import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteVerbaleComponent } from './note-verbale.component';

describe('NoteVerbaleComponent', () => {
  let component: NoteVerbaleComponent;
  let fixture: ComponentFixture<NoteVerbaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteVerbaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteVerbaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
