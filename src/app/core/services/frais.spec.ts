import { TestBed } from '@angular/core/testing';

import { Frais } from './frais';

describe('Frais', () => {
  let service: Frais;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Frais);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
