import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfferComponent } from './list-offer.component';

describe('ListOfferComponent', () => {
  let component: ListOfferComponent;
  let fixture: ComponentFixture<ListOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOfferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
