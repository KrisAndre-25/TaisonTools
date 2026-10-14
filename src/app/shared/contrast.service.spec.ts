import { TestBed } from '@angular/core/testing';
import { ContrastService } from './contrast.service';

describe('ContrastService', () => {
  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-contrast');
  });

  it('toggles high-contrast mode on <html> and remembers the choice', () => {
    const service = TestBed.inject(ContrastService);
    expect(service.high()).toBe(false);

    service.toggle();
    TestBed.tick();
    expect(document.documentElement.getAttribute('data-contrast')).toBe('high');
    expect(localStorage.getItem('tt-contrast')).toBe('high');

    service.toggle();
    TestBed.tick();
    expect(document.documentElement.hasAttribute('data-contrast')).toBe(false);
    expect(localStorage.getItem('tt-contrast')).toBe('normal');
  });

  it('starts in high-contrast mode when it was saved before', () => {
    localStorage.setItem('tt-contrast', 'high');
    expect(TestBed.inject(ContrastService).high()).toBe(true);
  });
});
