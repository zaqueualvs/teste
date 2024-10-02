import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRechargeComponent } from './dialog-recharge.component';

describe('DialogRechargeComponent', () => {
  let component: DialogRechargeComponent;
  let fixture: ComponentFixture<DialogRechargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogRechargeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogRechargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
