import { renderHook, act } from '@testing-library/react-hooks';
import { usePage } from '../usePage';

describe('usePage', () => {
  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => usePage(100));

    expect(result.current.page).toBe(1);
    expect(result.current.pages).toBe(10);
    expect(result.current.rowsPerPage).toBe(10);
  });

  it('should calculate pages correctly', () => {
    const { result } = renderHook(() => usePage(45, 5));

    expect(result.current.pages).toBe(9);
  });

  it('should handle next page correctly', () => {
    const { result } = renderHook(() => usePage(100));

    act(() => {
      result.current.handleNextPage();
    });

    expect(result.current.page).toBe(2);
  });

  it('should not exceed total pages', () => {
    const { result } = renderHook(() => usePage(20, 10));

    act(() => {
      result.current.handleNextPage();
      result.current.handleNextPage();
    });

    expect(result.current.page).toBe(2);
  });
});